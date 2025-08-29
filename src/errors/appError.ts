// Base class for all application errors
export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  public toResponse() {
    return {
      status: this.statusCode,
      data: null,
      message: this.message,
      errors: true,
      success: false,
      errorCode: this.errorCode,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

// Common child error classes
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, 429, "TOO_MANY_REQUESTS");
  }
}

export class ServiceError extends AppError {
  constructor(message: string) {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}
