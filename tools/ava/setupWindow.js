const { MockLocalStorage } = require('./MockLocalStorage');

global.window = {
  localStorage: new MockLocalStorage(),
  setInterval: () => {},
  clearInterval: () => {},
};
