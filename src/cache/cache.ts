interface Cache {
  get(key: string): Promise<any | null>;
  put(key: string, value: any, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  scan(keyPrefix: string): Promise<string[]>;
  deleteAll(): Promise<void>;
}

export { Cache };