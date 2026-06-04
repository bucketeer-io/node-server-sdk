// AbortSignal.any([AbortSignal.timeout(...), stopSignal]) would be cleaner but
// requires Node.js ≥ v20.3; this SDK targets v18, so we combine manually.
export class PollController {
  private current: AbortController | null = null;

  createSignal(pollingInterval: number): AbortSignal {
    this.current?.abort();
    const controller = new AbortController();
    this.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), pollingInterval);
    controller.signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
    return controller.signal;
  }

  abort(): void {
    this.current?.abort();
    this.current = null;
  }
}
