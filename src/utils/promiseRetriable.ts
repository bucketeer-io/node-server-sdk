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

/**
 * Function to determine if an error should trigger a retry
 */
export type ShouldRetryFn = (error: Error) => boolean

const RETRYABLE_CODES = new Set<string>([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNABORTED',
])

/**
 * Checks if an error is retryable based on Node.js network error codes.
 * Returns true for known transient network errors.
 */
export function isRetryable(error: Error): boolean {
  const code = (error as NodeJS.ErrnoException).code
  return RETRYABLE_CODES.has(code ?? '')
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

/**
 * A generic retry utility that executes a function with configurable retry logic.
 * Uses exponential backoff with ±25% jitter between retries.
 * @param fn The function to execute
 * @param retryPolicy The retry configuration
 * @param shouldRetry Function to determine if error should trigger retry. Defaults to isRetryable.
 * @returns Promise resolving to the result or throwing the last error
 */
export async function promiseRetriable<T>(
  fn: () => Promise<T>,
  retryPolicy: RetryPolicy,
  shouldRetry: ShouldRetryFn = isRetryable
  // Future improvement: Allow cancellation in the future by adding an AbortSignal parameter
): Promise<T> {
  const { maxRetries } = retryPolicy
  let attempts = 0

  while (attempts <= maxRetries) {
    attempts++

    try {
      return await fn()
    } catch (error) {
      const lastError = error instanceof Error ? error : new Error(String(error))

      // If this was the last attempt or we shouldn't retry this error, throw
      if (attempts > maxRetries || !shouldRetry(lastError)) {
        throw lastError
      }

      // Wait before next attempt using exponential backoff (0-indexed attempt)
      const waitTime = calculateBackoff(attempts - 1, retryPolicy)
      if (waitTime > 0) {
        await sleep(waitTime)
      }
    }
  }

  // This should never be reached due to the logic above
  throw new Error('Unexpected end of retry loop')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
