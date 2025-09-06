import test from 'ava';
import { InitializationPromise } from '../utils/initializationPromise';
import { TimeoutError } from '../objects/errors';

// Initial State Tests
test('should not be complete initially', t => {
  const initPromise = new InitializationPromise();
  t.false(initPromise.isComplete());
});

// Success Flow Tests
test('should be complete after marking as initialized', t => {
  const initPromise = new InitializationPromise();
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
});

test('should resolve immediately if already initialized', async t => {
  const initPromise = new InitializationPromise();
  initPromise.markAsInitialized();
  
  await t.notThrowsAsync(async () => {
    await initPromise.waitForInitialization(1000);
  });
});

test('should resolve immediately when markAsInitialized is called before waitForInitialization', async t => {
  const initPromise = new InitializationPromise();
  
  // Mark as initialized BEFORE calling waitForInitialization
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
  
  // Should resolve immediately
  await t.notThrowsAsync(async () => {
    await initPromise.waitForInitialization(1000);
  });
});

test('should reject immediately when markAsFailed is called before waitForInitialization', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Pre-initialization error');
  
  // Mark as failed BEFORE calling waitForInitialization
  initPromise.markAsFailed(testError);
  t.false(initPromise.isComplete()); // Should still be false since it failed, not completed successfully
  
  // Should reject immediately with the stored error
  const error = await t.throwsAsync(async () => {
    await initPromise.waitForInitialization(1000);
  });
  
  t.is(error, testError);
});

test('should resolve when markAsInitialized is called after waiting starts', async t => {
  const initPromise = new InitializationPromise();
  
  // Start waiting
  const waitPromise = initPromise.waitForInitialization(1000);
  
  // Mark as initialized after a short delay
  setTimeout(() => {
    initPromise.markAsInitialized();
  }, 50);
  
  await t.notThrowsAsync(async () => {
    await waitPromise;
  });
  
  t.true(initPromise.isComplete());
});

// Failure Flow Tests
test('should reject when markAsFailed is called', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Test initialization error');
  
  // Start waiting
  const waitPromise = initPromise.waitForInitialization(1000);
  
  // Mark as failed after a short delay
  setTimeout(() => {
    initPromise.markAsFailed(testError);
  }, 50);
  
  const error = await t.throwsAsync(async () => {
    await waitPromise;
  });
  
  t.is(error, testError);
});

test('should reject multiple waiters with same error', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Test initialization error');
  
  // Start multiple waiters
  const waitPromise1 = initPromise.waitForInitialization(1000);
  const waitPromise2 = initPromise.waitForInitialization(1000);
  const waitPromise3 = initPromise.waitForInitialization(1000);
  
  // Mark as failed after a short delay
  setTimeout(() => {
    initPromise.markAsFailed(testError);
  }, 50);
  
  const error1 = await t.throwsAsync(async () => await waitPromise1);
  const error2 = await t.throwsAsync(async () => await waitPromise2);
  const error3 = await t.throwsAsync(async () => await waitPromise3);
  
  t.is(error1, testError);
  t.is(error2, testError);
  t.is(error3, testError);
});

// Timeout Tests
test('should reject with timeout error after specified time', async t => {
  const initPromise = new InitializationPromise();
  
  const start = Date.now();
  const error = await t.throwsAsync(async () => {
    await initPromise.waitForInitialization(100);
  });
  const elapsed = Date.now() - start;
  
  t.true(error instanceof Error);
  t.true(error.message.includes('timeout'));
  t.true(error.message.includes('100 ms'));
  t.true(elapsed >= 100);
  t.true(elapsed < 200); // Should not take much longer than timeout
});

test('should timeout correctly with very short timeout', async t => {
  const initPromise = new InitializationPromise();
  
  const start = Date.now();
  const error = await t.throwsAsync(async () => {
    await initPromise.waitForInitialization(50);
  });
  const elapsed = Date.now() - start;
  
  t.true(error instanceof Error);
  t.true(error.message.includes('timeout'));
  t.true(elapsed >= 50);
  t.true(elapsed < 150);
});

test('should handle multiple waitForInitialization calls after pre-initialization success', async t => {
  const initPromise = new InitializationPromise();
  
  // Mark as initialized first
  initPromise.markAsInitialized();
  
  // Multiple calls should all resolve immediately
  await t.notThrowsAsync(async () => {
    await Promise.all([
      initPromise.waitForInitialization(1000),
      initPromise.waitForInitialization(1000),
      initPromise.waitForInitialization(1000)
    ]);
  });
});

test('should handle multiple waitForInitialization calls after pre-initialization failure', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Pre-initialization error');
  
  // Mark as failed first
  initPromise.markAsFailed(testError);
  
  // Multiple calls should all reject with the same error
  const error1 = await t.throwsAsync(async () => await initPromise.waitForInitialization(1000));
  const error2 = await t.throwsAsync(async () => await initPromise.waitForInitialization(1000));
  const error3 = await t.throwsAsync(async () => await initPromise.waitForInitialization(1000));
  
  t.is(error1, testError);
  t.is(error2, testError);
  t.is(error3, testError);
});

// Multiple Waiters Tests
test('should resolve all waiters when markAsInitialized is called', async t => {
  const initPromise = new InitializationPromise();
  
  // Start multiple waiters
  const waitPromise1 = initPromise.waitForInitialization(1000);
  const waitPromise2 = initPromise.waitForInitialization(1000);
  const waitPromise3 = initPromise.waitForInitialization(1000);
  
  // Mark as initialized after a short delay
  setTimeout(() => {
    initPromise.markAsInitialized();
  }, 50);
  
  await t.notThrowsAsync(async () => {
    await Promise.all([waitPromise1, waitPromise2, waitPromise3]);
  });
  
  t.true(initPromise.isComplete());
});

// Edge Cases
test('should be safe to call markAsInitialized multiple times', t => {
  const initPromise = new InitializationPromise();
  
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
  
  // Should not throw or change state
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
});

test('should ignore markAsFailed after markAsInitialized', async t => {
  const initPromise = new InitializationPromise();
  
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
  
  // This should have no effect
  initPromise.markAsFailed(new Error('Should be ignored'));
  t.true(initPromise.isComplete());
  
  // Should still resolve immediately
  await t.notThrowsAsync(async () => {
    await initPromise.waitForInitialization(100);
  });
});

test('should ignore markAsInitialized after markAsFailed', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Test error');
  
  // Start waiting
  const waitPromise = initPromise.waitForInitialization(1000);
  
  // Mark as failed first
  setTimeout(() => {
    initPromise.markAsFailed(testError);
    // This should have no effect
    initPromise.markAsInitialized();
  }, 50);
  
  const error = await t.throwsAsync(async () => {
    await waitPromise;
  });
  
  t.is(error, testError);
  t.false(initPromise.isComplete()); // Should be false because it failed, not completed successfully
});

test('should ignore multiple markAsFailed calls after first one', async t => {
  const initPromise = new InitializationPromise();
  const firstError = new Error('First error');
  const secondError = new Error('Second error');
  
  // Mark as failed first
  initPromise.markAsFailed(firstError);
  t.false(initPromise.isComplete());
  
  // This should have no effect
  initPromise.markAsFailed(secondError);
  t.false(initPromise.isComplete());
  
  // Should still reject with first error
  const error = await t.throwsAsync(async () => {
    await initPromise.waitForInitialization(100);
  });
  
  t.is(error, firstError);
});

test('should ignore markAsFailed after markAsInitialized when called in sequence', async t => {
  const initPromise = new InitializationPromise();
  
  // Mark as initialized first
  initPromise.markAsInitialized();
  t.true(initPromise.isComplete());
  
  // This should have no effect
  initPromise.markAsFailed(new Error('Should be ignored'));
  t.true(initPromise.isComplete()); // Should still be true
  
  // Should still resolve immediately
  await t.notThrowsAsync(async () => {
    await initPromise.waitForInitialization(100);
  });
});

// Concurrent Operations Tests
test('should handle concurrent waitForInitialization calls correctly', async t => {
  const initPromise = new InitializationPromise();
  
  // Start multiple concurrent waits
  const promises = Array.from({ length: 10 }, () => 
    initPromise.waitForInitialization(1000)
  );
  
  // Mark as initialized after all waits have started
  setTimeout(() => {
    initPromise.markAsInitialized();
  }, 100);
  
  await t.notThrowsAsync(async () => {
    await Promise.all(promises);
  });
  
  t.true(initPromise.isComplete());
});

test('should handle race condition between timeout and success', async t => {
  const initPromise = new InitializationPromise();
  
  // Start waiting with a very short timeout
  const waitPromise = initPromise.waitForInitialization(75);
  
  // Mark as initialized right around the timeout time
  setTimeout(() => {
    initPromise.markAsInitialized();
  }, 70);
  
  // Either should resolve (if markAsInitialized happens first) or timeout
  // Both are valid outcomes due to race condition
  try {
    await waitPromise;
    t.true(initPromise.isComplete());
  } catch (error) {
    t.true(error instanceof TimeoutError);
  }
});

// Memory Management Tests
test('should not leak memory after successful initialization', async t => {
  const initPromise = new InitializationPromise();
  
  // Start waiting
  const waitPromise = initPromise.waitForInitialization(1000);
  
  // Mark as initialized
  setTimeout(() => {
    initPromise.markAsInitialized();
  }, 50);
  
  await waitPromise;
  
  // Access private properties via type assertion for testing
  const privateProps = initPromise as any;
  t.is(privateProps.resolver, undefined);
  t.is(privateProps.rejecter, undefined);
});

test('should not leak memory after failed initialization', async t => {
  const initPromise = new InitializationPromise();
  const testError = new Error('Test error');
  
  // Start waiting
  const waitPromise = initPromise.waitForInitialization(1000);
  
  // Mark as failed
  setTimeout(() => {
    initPromise.markAsFailed(testError);
  }, 50);
  
  await t.throwsAsync(async () => await waitPromise);
  
  // Access private properties via type assertion for testing
  const privateProps = initPromise as any;
  t.is(privateProps.resolver, undefined);
  t.is(privateProps.rejecter, undefined);
});
