import { StatusCodes } from "http-status-codes";

export class CustomHttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends CustomHttpError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class NotFound extends CustomHttpError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class Unauthenticated extends CustomHttpError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class Forbidden extends CustomHttpError {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
