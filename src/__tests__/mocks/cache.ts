import { Cache } from '../../cache/cache';

class MockCache implements Cache {
  get(_key: string): Promise<any | null> {
    throw new Error('Method not implemented.');
  }
  put(_key: string, _value: any, _ttl: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(_key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  scan(_keyPrefix: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.');
  }

}

export { MockCache };