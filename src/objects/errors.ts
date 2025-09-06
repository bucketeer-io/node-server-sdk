import typeUtils from 'node:util/types';

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

export class BKTBaseError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 300..399: Redirect
export class RedirectRequestError extends BKTBaseError {
  name = 'RedirectRequestError' as const;
  statusCode: number;

  constructor(statusCode: number, msg?: string) {
    super(msg);
    this.statusCode = statusCode;
  }
}

// 400: Bad Request
export class BadRequestError extends BKTBaseError {
  name = 'BadRequestError' as const;
}

// 401: Unauthorized
export class UnauthorizedError extends BKTBaseError {
  name = 'UnauthorizedError' as const;
}

// 403: Forbidden
export class ForbiddenError extends BKTBaseError {
  name = 'ForbiddenError' as const;
}

// 404: Not Found
export class NotFoundError extends BKTBaseError {
  name = 'NotFoundError' as const;
}

// 405: Invalid HTTP Method
export class InvalidHttpMethodError extends BKTBaseError {
  name = 'InvalidHttpMethodError' as const;
}

// 413: Payload Too Large
export class PayloadTooLargeError extends BKTBaseError {
  name = 'PayloadTooLargeError' as const;
}

// 499: Client Closed Request
export class ClientClosedRequestError extends BKTBaseError {
  name = 'ClientClosedRequestError' as const;
}

// 500: Internal Server Error
export class InternalServerError extends BKTBaseError {
  name = 'InternalServerError' as const;
}

// 502, 503, 504: Service Unavailable
export class ServiceUnavailableError extends BKTBaseError {
  name = 'ServiceUnavailableError' as const;
}

// Network errors
export class TimeoutError extends BKTBaseError {
  name = 'TimeoutError' as const;
  timeoutMillis: number;

  constructor(timeoutMillis: number, msg?: string) {
    super(msg);
    this.timeoutMillis = timeoutMillis;
  }
}

export class NetworkError extends BKTBaseError {
  name = 'NetworkError' as const;
}

// SDK errors
export class IllegalArgumentError extends BKTBaseError {
  name = 'IllegalArgumentError' as const;
}

export class IllegalStateError extends BKTBaseError {
  name = 'IllegalStateError' as const;
}

// Unknown errors
export class UnknownError extends BKTBaseError {
  name = 'UnknownError' as const;
  statusCode?: number;

  constructor(msg?: string, statusCode?: number) {
    super(msg);
    this.statusCode = statusCode;
  }
}

export function toBKTError(e: unknown, params: {
  timeout?: number
}): BKTBaseError {
  if (e instanceof BKTBaseError) {
    return e;
  }
  
  if (e instanceof InvalidStatusError) {
    const statusCode = e.code ?? 0;
    switch (true) {
      case statusCode >= 300 && statusCode < 400:
        return new RedirectRequestError(statusCode, e.message);
      case statusCode == 400:
        return new BadRequestError(e.message);
      case statusCode == 401:
        return new UnauthorizedError(e.message);
      case statusCode == 403:
        return new ForbiddenError(e.message);
      case statusCode == 404:
        return new NotFoundError(e.message);
      case statusCode == 405:
        return new InvalidHttpMethodError(e.message);
      case statusCode == 408:
        return new TimeoutError(params.timeout ?? 0, e.message); // timeoutMillis unknown
      case statusCode == 413:
        return new PayloadTooLargeError(e.message);
      case statusCode == 499:
        return new ClientClosedRequestError(e.message);
      case statusCode == 500:
        return new InternalServerError(e.message);
      case [502, 503, 504].includes(statusCode):
        return new ServiceUnavailableError(e.message);
      default:
        return new UnknownError(e.message, statusCode);
    }
  }
  
  // Check for Node.js system errors
  if (isNodeError(e)) {
    switch (e.code) {
      case 'ECONNRESET':
        return new TimeoutError(params.timeout ?? 0, e.message);
      case 'EHOSTUNREACH':
      case 'ECONNREFUSED':
        return new NetworkError(e.message);
      default:
        return new UnknownError(e.message);
    }
  }
  
  // Generic Error
  if (e instanceof Error) {
    return new UnknownError(e.message);
  }
  
  // Non-Error values
  return new UnknownError(String(e));
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeUtils.isNativeError(error);
}