class CustomError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

function createNodeJSError(message: string, code: string): CustomError {
  return new CustomError(message, code);
}

export { CustomError, createNodeJSError };