import { AbortError, DeadlineExceededError } from '../objects/errors';

// AbortSignal.any([AbortSignal.timeout(...), stopSignal]) would be cleaner but
// requires Node.js ≥ v20.3; this SDK targets v18, so we combine manually.
export class PollController {
  private current: AbortController | null = null;

  createSignal(pollingInterval: number): AbortSignal {
    this.current?.abort(new AbortError());
    const controller = new AbortController();
    this.current = controller;
    const timeoutId = setTimeout(
      () => controller.abort(new DeadlineExceededError(pollingInterval)),
      pollingInterval,
    );
    controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
    return controller.signal;
  }

  abort(): void {
    this.current?.abort(new AbortError());
    this.current = null;
  }
}

// Creates a one-shot AbortSignal that fires with DeadlineExceededError(timeoutMs) after
// timeoutMs milliseconds. Unlike AbortSignal.timeout(), the abort reason is our
// SDK DeadlineExceededError so callers can recover the timeout value from signal.reason.
// The timer is unref'd so it does not prevent the Node.js process from exiting
// once the request that owns this signal has already completed.
// Use this for API client calls (getEvaluation, registerEvents, getFeatureFlags, getSegmentUsers).
export function createDeadlineExceededSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DeadlineExceededError(timeoutMs)),
    timeoutMs,
  );
  timeoutId.unref();
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
  return controller.signal;
}

// Ordering rule: always call isDeadlineExceededError before isOperationAbortedError.
// Node wraps the abort reason in a DOMException{name:'AbortError', cause:<reason>} when
// https.request is cancelled via its signal. isOperationAbortedError returns true for any
// such DOMException regardless of cause, so checking for timeout first is required to
// distinguish a deadline expiry from a genuine abort.

export function isDeadlineExceededError(e: unknown): boolean {
  return (
    e instanceof DeadlineExceededError ||
    (e as any)?.name === 'DeadlineExceededError' ||
    (e instanceof DOMException && e.name === 'TimeoutError') || // DOMException from AbortSignal.timeout()
    (e as any)?.cause instanceof DeadlineExceededError
  );
}

export function isOperationAbortedError(e: unknown): boolean {
  return e instanceof AbortError || (e as any)?.name === 'AbortError';
}
