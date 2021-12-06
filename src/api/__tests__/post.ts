import test from 'ava';
import { setFetch, FetchLike, FetchResponseLike } from '../fetch';
import { post } from '../shared';

function createFetch(ok: boolean): FetchLike {
  return function fetchLike(): Promise<FetchResponseLike> {
    return Promise.resolve({
      ok,
      json() {
        return Promise.resolve({});
      },
    });
  };
}

test('post: request ok', async (t) => {
  setFetch(createFetch(true));
  const res = await post('url', 'token', {});
  t.true(res.ok);
});

test('post: request false', async (t) => {
  setFetch(createFetch(false));
  const res = await post('url', 'token', {});
  t.false(res.ok);
});
