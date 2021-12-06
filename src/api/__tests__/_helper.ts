import { createOk, createErr, Result } from 'option-t/lib/PlainResult/Result';

export function createMockFetch<R>(fixture: R, isOk: boolean): () => Promise<Result<R, Error>> {
  return function fetch(): Promise<Result<R, Error>> {
    return new Promise((resolve) => {
      resolve(isOk ? createOk(fixture) : createErr(new Error()));
    });
  };
}
