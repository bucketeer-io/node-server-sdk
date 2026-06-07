import { AbortError, TimeoutError } from '../objects/errors';

// AbortSignal.any([AbortSignal.timeout(...), stopSignal]) would be cleaner but
// requires Node.js ≥ v20.3; this SDK targets v18, so we combine manually.
export class PollController {
  private current: AbortController | null = null;

  createSignal(pollingInterval: number): AbortSignal {
    this.current?.abort(new AbortError());
    const controller = new AbortController();
    this.current = controller;
    const timeoutId = setTimeout(
      () => controller.abort(new TimeoutError(pollingInterval)),
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

// Creates a one-shot AbortSignal that fires with TimeoutError(timeoutMs) after
// timeoutMs milliseconds. Unlike AbortSignal.timeout(), the abort reason is our
// SDK TimeoutError so callers can recover the timeout value from signal.reason.
// The timer is unref'd so it does not prevent the Node.js process from exiting
// once the request that owns this signal has already completed.
export function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new TimeoutError(timeoutMs)),
    timeoutMs,
  );
  timeoutId.unref();
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
  return controller.signal;
}

export function isOperationTimedOutError(e: unknown): boolean {
  return e instanceof TimeoutError || (e as any)?.name === 'TimeoutError';
}

export function isOperationAbortedError(e: unknown): boolean {
  return e instanceof AbortError || (e as any)?.name === 'AbortError';
}
