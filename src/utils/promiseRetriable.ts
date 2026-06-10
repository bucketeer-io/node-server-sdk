import { InvalidStatusError } from '../objects/errors';
import { isOperationAbortedError, isDeadlineExceededError } from './pollController';

const DEFAULT_INITIAL_INTERVAL_MS = 1_000;

// When a deadline or abort fires, decide what error to surface to the caller.
// For timeout: prefer the last meaningful HTTP error over a bare TimeoutError.
// For abort: always surface the AbortError (intentional cancel, no HTTP context).
function resolveThrowable(e: unknown, lastHttpError: Error | undefined): Error {
  const err = e instanceof Error ? e : new Error(String(e));
  if (lastHttpError !== undefined && isDeadlineExceededError(err)) return lastHttpError;
  return err;
}

export interface RetryPolicy {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial backoff interval in milliseconds. Set to 0 for no delay between retries. */
  initialInterval: number;
  /** Maximum backoff interval in milliseconds. Set to 0 for no cap. */
  maxInterval: number;
  /** Exponential backoff multiplier. Defaults to 2.0. (internal) */
  multiplier?: number;
}

export interface RetryDecision {
  retry: boolean;
  delayOverrideMs?: number;
}

/**
 * Function to determine if an error should trigger a retry.
 */
export type ShouldRetryFn = (error: Error) => RetryDecision;

const RETRYABLE_CODES = new Set<string>([
  'ECONNREFUSED', // Connection refused
  'ECONNRESET', // Connection reset by peer
  'ETIMEDOUT', // Operation timed out
  'ENOTFOUND', // DNS lookup failed
  'EAI_AGAIN', // DNS lookup temporary failure
  'ECONNABORTED', // Connection aborted
  'EHOSTUNREACH', // Host unreachable
  'ENETUNREACH', // Network unreachable
  'EPIPE', // Broken pipe
]);

const RETRYABLE_STATUS_CODES = new Set<number>([
  429, // Too Many Requests
  499, // Client Closed Request
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

/**
 * Checks if an error is retryable based on Node.js network error codes or
 * retryable HTTP status codes. For InvalidStatusError with a Retry-After
 * header the delay override is threaded back via RetryDecision.
 */
export function isRetryable(error: Error): RetryDecision {
  if (isOperationAbortedError(error) || isDeadlineExceededError(error)) return { retry: false };

  const code = (error as NodeJS.ErrnoException).code;
  if (RETRYABLE_CODES.has(code ?? '')) return { retry: true };

  if (error instanceof InvalidStatusError && RETRYABLE_STATUS_CODES.has(error.code ?? 0)) {
    return { retry: true, delayOverrideMs: error.retryAfterMs };
  }

  return { retry: false };
}

/**
 * Calculates exponential backoff delay with ±25% jitter.
 * interval = initialInterval × (multiplier ^ attempt), capped at maxInterval.
 * Exported for testing purposes.
 */
export function calculateBackoff(attempt: number, policy: RetryPolicy): number {
  const initialInterval = policy.initialInterval > 0 ? policy.initialInterval : DEFAULT_INITIAL_INTERVAL_MS;
  const multiplier = policy.multiplier && policy.multiplier > 0 ? policy.multiplier : 2.0;

  // Exponential backoff: initialInterval * (multiplier ^ attempt)
  let backoff = initialInterval * Math.pow(multiplier, attempt);

  // Add ±25% jitter to prevent thundering herd
  const jitter = backoff * 0.25 * (Math.random() * 2 - 1);
  backoff += jitter;

  // Cap at maxInterval
  if (policy.maxInterval > 0 && backoff > policy.maxInterval) {
    backoff = policy.maxInterval;
  }

  // Ensure non-negative (edge case with jitter on very small values)
  if (backoff < 0) {
    backoff = initialInterval;
  }

  return Math.floor(backoff);
}

function abortableSleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal!.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
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
  const { maxRetries } = retryPolicy;
  let retriesPerformed = 0;
  let lastHttpError: Error | undefined;

  while (true) {
    // Path C: deadline may have fired between attempts
    if (signal?.aborted) throw resolveThrowable(signal.reason, lastHttpError);

    try {
      return await fn(signal);
    } catch (error) {
      const lastError = error instanceof Error ? error : new Error(String(error));

      // Path A: timeout may be replaced by the last HTTP error
      if (isDeadlineExceededError(lastError)) {
        throw resolveThrowable(lastError, lastHttpError);
      }

      // AbortError carries no HTTP context; exclude it from lastHttpError
      if (!isOperationAbortedError(lastError)) {
        lastHttpError = lastError;
      }

      // If we have no more retries allowed, throw immediately
      if (retriesPerformed >= maxRetries) {
        throw lastError;
      }

      // Check if the error itself allows a retry
      const decision = shouldRetry(lastError);
      if (!decision.retry) {
        throw lastError;
      }

      // Retry-After is still capped at maxInterval for safety — a misbehaving server
      // cannot force arbitrarily long waits. Mirrors go-server-sdk retry.go behavior.
      let waitTime: number;
      if (decision.delayOverrideMs !== undefined) {
        const serverRequestedDelay = decision.delayOverrideMs;
        const retryAfterCappedAtMaxInterval = Math.min(
          serverRequestedDelay,
          retryPolicy.maxInterval,
        );
        const maxIntervalIsSet = retryPolicy.maxInterval > 0;
        waitTime = maxIntervalIsSet ? retryAfterCappedAtMaxInterval : serverRequestedDelay;
      } else {
        waitTime = calculateBackoff(retriesPerformed, retryPolicy);
      }

      if (waitTime > 0) {
        // Path B: deadline may fire during inter-retry sleep
        try {
          await abortableSleep(waitTime, signal);
        } catch (sleepError) {
          throw resolveThrowable(sleepError, lastHttpError);
        }
      }

      retriesPerformed++;
    }
  }
}
