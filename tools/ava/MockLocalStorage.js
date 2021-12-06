class MockLocalStorage {
  constructor() {
    this._map = new Map();
  }

  getItem(key) {
    return this._map.get(key) || null;
  }

  setItem(key, value) {
    this._map.set(key, value);
  }

  removeItem(key) {
    this._map.delete(key);
  }

  clear() {
    this._map.clear();
  }
}

module.exports = {
  MockLocalStorage,
};
