import { Nullable } from 'option-t/lib/Nullable/Nullable';
import { unwrapNullable } from 'option-t/lib/Nullable/unwrap';

export type FetchRequestLike = {
  method: string;
  headers: { [key: string]: string };
  body: string;
};

export type FetchResponseLike = {
  ok: boolean;
  json: () => Promise<any>; // tslint:disable-line no-any
};

export type FetchLike = (url: string, request: FetchRequestLike) => Promise<FetchResponseLike>;

let fetch: Nullable<FetchLike> = null;

export function setFetch(_fetch: FetchLike): void {
  fetch = _fetch;
}

export function getFetch(): FetchLike {
  return unwrapNullable(fetch);
}
