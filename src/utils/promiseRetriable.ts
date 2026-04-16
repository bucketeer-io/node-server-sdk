import { InvalidStatusError } from '../objects/errors'

export interface RetryPolicy {
  /** Maximum number of retry attempts */
  maxRetries: number
  /** Initial backoff interval in milliseconds */
  initialInterval: number
  /** Maximum backoff interval in milliseconds. Set to 0 for no cap. */
  maxInterval: number
  /** Exponential backoff multiplier. Defaults to 2.0. (internal) */
  multiplier?: number
}

export interface RetryDecision {
  retry: boolean
  delayOverrideMs?: number
}

/**
 * Function to determine if an error should trigger a retry.
 */
export type ShouldRetryFn = (error: Error) => RetryDecision

const RETRYABLE_CODES = new Set<string>([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNABORTED',
])

const RETRYABLE_STATUS_CODES = new Set<number>([500, 502, 503, 504, 499])

/**
 * Checks if an error is retryable based on Node.js network error codes or
 * retryable HTTP status codes. For InvalidStatusError with a Retry-After
 * header the delay override is threaded back via RetryDecision.
 */
export function isRetryable(error: Error): RetryDecision {
  const code = (error as NodeJS.ErrnoException).code
  if (RETRYABLE_CODES.has(code ?? '')) return { retry: true }

  if (error instanceof InvalidStatusError && RETRYABLE_STATUS_CODES.has(error.code ?? 0)) {
    return { retry: true, delayOverrideMs: error.retryAfterMs }
  }

  return { retry: false }
}

/**
 * Calculates exponential backoff delay with ±25% jitter.
 * interval = initialInterval × (multiplier ^ attempt), capped at maxInterval.
 * Exported for testing purposes.
 */
export function calculateBackoff(attempt: number, policy: RetryPolicy): number {
  const initialInterval = Math.max(0, policy.initialInterval)
  if (initialInterval === 0) {
    return 0
  }

  const multiplier = policy.multiplier && policy.multiplier > 0 ? policy.multiplier : 2.0

  // Exponential backoff: initialInterval * (multiplier ^ attempt)
  let backoff = initialInterval * Math.pow(multiplier, attempt)

  // Add ±25% jitter to prevent thundering herd
  const jitter = backoff * 0.25 * (Math.random() * 2 - 1)
  backoff += jitter

  // Cap at maxInterval
  if (policy.maxInterval > 0 && backoff > policy.maxInterval) {
    backoff = policy.maxInterval
  }

  // Ensure non-negative (edge case with jitter on very small values)
  if (backoff < 0) {
    backoff = initialInterval
  }

  return Math.floor(backoff)
}

function abortableSleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/**
 * A generic retry utility that executes a function with configurable retry logic.
 * Uses exponential backoff with ±25% jitter between retries.
 * @param fn The function to execute. Receives an optional AbortSignal.
 * @param retryPolicy The retry configuration
 * @param shouldRetry Function to determine if error should trigger retry. Defaults to isRetryable.
 * @param signal Optional AbortSignal to cancel the operation at any point.
 * @returns Promise resolving to the result or throwing the last error
 */
export async function promiseRetriable<T>(
  fn: (signal: AbortSignal | undefined) => Promise<T>,
  retryPolicy: RetryPolicy,
  shouldRetry: ShouldRetryFn = isRetryable,
  signal?: AbortSignal,
): Promise<T> {
  const { maxRetries } = retryPolicy
  let attempts = 0

  while (attempts <= maxRetries) {
    if (signal?.aborted) throw signal.reason

    attempts++

    try {
      return await fn(signal)
    } catch (error) {
      const lastError = error instanceof Error ? error : new Error(String(error))

      // If this was the last attempt or we shouldn't retry this error, throw
      if (attempts > maxRetries) {
        throw lastError
      }

      const decision = shouldRetry(lastError)
      if (!decision.retry) {
        throw lastError
      }

      const waitTime =
        decision.delayOverrideMs !== undefined
          ? retryPolicy.maxInterval > 0
            ? Math.min(decision.delayOverrideMs, retryPolicy.maxInterval)
            : decision.delayOverrideMs
          : calculateBackoff(attempts - 1, retryPolicy)

      if (waitTime > 0) {
        await abortableSleep(waitTime, signal)
      }
    }
  }

  // This should never be reached due to the logic above
  throw new Error('Unexpected end of retry loop')
}
