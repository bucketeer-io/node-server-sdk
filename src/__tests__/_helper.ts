import test from 'ava';
import { FetchLike, FetchResponseLike } from '../api/fetch';
import { initialize, Bucketeer } from '../index';

function createFetch(makeReturnError?: boolean): FetchLike {
  return function fetchLike(): Promise<FetchResponseLike> {
    return Promise.resolve({
      ok: makeReturnError ? false : true,
      json() {
        return Promise.resolve({});
      },
    });
  };
}

export function createBucketeer(onInitialize?: () => void, makeReturnError?: boolean): Bucketeer {
  return initialize({
    host: 'https://api.bucketeer.jp',
    token: 'token',
    tag: 'web',
    user: {
      id: 'user',
      data: {
        foo: 'bar',
      },
    },
    fetch: createFetch(makeReturnError),
    // tslint:disable-next-line no-magic-numbers
    pollingIntervalForGetEvaluations: 2 * 60 * 1000,
    // tslint:disable-next-line no-magic-numbers
    pollingIntervalForRegisterEvents: 2 * 60 * 1000,
    onInitialize,
  });
}
