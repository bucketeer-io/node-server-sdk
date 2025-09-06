import { TimeoutError } from '../objects/errors';

/**
 * A utility class to handle initialization state and promises for processors.
 * This eliminates the need to duplicate initialization logic across different cache processors.
 */
export class InitializationPromise {
  private resolver?: (value: void) => void;
  private rejecter?: (reason: any) => void;
  private promise?: Promise<void>;
  private isInitialized: boolean = false;
  private failureError?: any;

  /**
   * Checks if the initialization has completed successfully.
   */
  isComplete(): boolean {
    return this.isInitialized;
  }

  /**
   * Marks the initialization as successful.
   * Should be called when the first operation completes successfully.
   */
  markAsInitialized(): void {
    if (!this.isInitialized && !this.failureError) {
      this.isInitialized = true;
      if (this.resolver) {
        this.resolver();
        this.cleanup();
      }
    }
  }

  /**
   * Marks the initialization as failed.
   * Should be called when the first operation fails.
   */
  markAsFailed(error: any): void {
    if (!this.isInitialized && !this.failureError) {
      this.failureError = error;
      if (this.rejecter) {
        this.rejecter(error);
        this.cleanup();
      }
    }
  }

  /**
   * Waits for initialization to complete with a timeout.
   *
   * @param timeout - Maximum time to wait for initialization in milliseconds
   * @returns Promise that resolves when initialized or rejects on timeout/error
   */
  async waitForInitialization(timeout: number): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.failureError) {
      throw this.failureError;
    }

    // Create the initialization promise if it doesn't exist
    if (!this.promise) {
      this.promise = new Promise<void>((resolve, reject) => {
        // Check state again after promise creation in case it changed
        if (this.isInitialized) {
          resolve();
          return;
        }
        
        if (this.failureError) {
          reject(this.failureError);
          return;
        }
        
        this.resolver = resolve;
        this.rejecter = reject;
      });
    }

    // Use Promise.race with timeout, but clear timeout on completion
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new TimeoutError(timeout, `Initialization timeout after ${timeout} ms`));
      }, timeout);
    });

    try {
      return await Promise.race([this.promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      this.cleanup();
    }
  }

  /**
   * Cleans up the resolver and rejecter references to prevent memory leaks.
   */
  private cleanup(): void {
    this.resolver = undefined;
    this.rejecter = undefined;
  }
}
