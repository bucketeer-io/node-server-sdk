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
   * @param timeoutMs - Maximum time to wait for initialization in milliseconds
   * @returns Promise that resolves when initialized or rejects on timeout/error
   */
  async waitForInitialization(timeoutMs: number): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    if (this.failureError) {
      return Promise.reject(this.failureError);
    }

    // Create the initialization promise if it doesn't exist
    if (!this.promise) {
      this.promise = new Promise<void>((resolve, reject) => {
        this.resolver = resolve;
        this.rejecter = reject;
        
        // Check state again after creating promise in case it changed
        if (this.isInitialized) {
          resolve();
          this.cleanup();
        } else if (this.failureError) {
          reject(this.failureError);
          this.cleanup();
        }
      });
    }

    return Promise.race([
      this.promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Initialization timeout after ${timeoutMs} ms`));
        }, timeoutMs);
      })
    ]);
  }
  
  /**
   * Cleans up the resolver and rejecter references to prevent memory leaks.
   */
  private cleanup(): void {
    this.resolver = undefined;
    this.rejecter = undefined;
  }
}
