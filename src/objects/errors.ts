export class InvalidStatusError extends Error {
  name = 'InvalidStatusError'
  readonly code: number | undefined;
  constructor(message: string, code: number | undefined) {
    super(message);
    this.code = code;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class IllegalArgumentError extends Error {
  name = 'BKTBaseException'
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class IllegalStateError extends Error {
  name = 'IllegalStateError'
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
