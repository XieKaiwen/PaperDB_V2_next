export class DataFetchingError extends Error {
  statusCode: number;
  constructor(message: string = 'An error occurred while fetching data', statusCode: number = 500) {
    super(message);
    this.name = 'DataFetchingError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, DataFetchingError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.statusCode}: ${this.message}`;
  }
}

export class AuthorizationError extends Error {
  statusCode: number;

  constructor(
    message: string = 'You are not authorized to perform this action',
    statusCode: number = 403,
  ) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.statusCode}: ${this.message}`;
  }
}

export class ResourceNotFoundError extends Error {
  resourceName: string;

  constructor(resourceName: string, message: string = 'Resource not found') {
    super(message);
    this.name = 'ResourceNotFoundError';
    this.resourceName = resourceName;

    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }

  toString(): string {
    return `${this.name} (Resource: ${this.resourceName}): ${this.message}`;
  }
}

export class TimeoutError extends Error {
  duration: number;

  constructor(duration: number, message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
    this.duration = duration;

    Object.setPrototypeOf(this, TimeoutError.prototype);
  }

  toString(): string {
    return `${this.name} (Duration: ${this.duration}ms): ${this.message}`;
  }
}

export class UnexpectedError extends Error {
  details?: string;

  constructor(message: string = 'An unexpected error occurred', details?: string) {
    super(message);
    this.name = 'UnexpectedError';
    this.details = details;

    Object.setPrototypeOf(this, UnexpectedError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.message}${this.details ? ` (Details: ${this.details})` : ''}`;
  }
}

export class NotFoundError extends Error {
  resource: string;
  statusCode: number;

  constructor(
    resource: string,
    message: string = 'The requested resource was not found',
    statusCode: number = 404,
  ) {
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.statusCode}: ${this.message} (Resource: ${this.resource})`;
  }
}

export class InternalServerError extends Error {
  details?: string;
  statusCode: number;

  constructor(
    message: string = 'An internal server error occurred',
    details?: string,
    statusCode: number = 500,
  ) {
    super(message);
    this.name = 'InternalServerError';
    this.details = details;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.statusCode}: ${this.message}${
      this.details ? ` (Details: ${this.details})` : ''
    }`;
  }
}
