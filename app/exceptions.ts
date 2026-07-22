export abstract class AppError extends Error {
  readonly status: number = 500;
  constructor(message: string = "Something went wrong") {
    super(message);
    this.name = "INTERNALSERVERERROR";
  }
}

export abstract class AccessForbiddenError extends AppError {
  readonly status: number = 403;
  constructor(message: string = "Access Forbidden") {
    super(message);
    this.name = "ACCESSFORBIDDENERROR";
  }
}

export abstract class NotFoundError extends AppError {
  readonly status: number = 404;
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NOTFOUNDERROR";
  }
}
