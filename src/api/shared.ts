import { createOk, createErr, Result } from 'option-t/lib/PlainResult/Result';
import { Token } from '../shared';
import { getFetch } from './fetch';

export type PostFn<T, U> = (url: string, token: Token, body: T) => Promise<Result<U, Error>>;

export function post<T, U>(url: string, token: Token, body: T): Promise<Result<U, Error>> {
  return getFetch()(url, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(createOk)
    .catch(createErr);
}
