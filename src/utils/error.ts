type ErrorParams = {
  statusCode?: number;
  message: string;
  isOperational?: boolean;
  stack?: string;
};

// Extend the built-in Error object
export class AppError extends Error {
  public isOperational: NonNullable<ErrorParams['isOperational']>;
  public statusCode: ErrorParams['statusCode'];

  constructor({ message, isOperational, stack, statusCode }: ErrorParams) {
    super(message);

    this.message = message;

    this.isOperational =
      typeof isOperational === 'boolean' ? isOperational : true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    this.statusCode = statusCode;
  }
}
