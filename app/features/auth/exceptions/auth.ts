import { AppError, type AppErrorOptions } from "~/exceptions";

export class InvalidCredentialsError extends AppError {
  public code: string = "invalid_credentials";
  public status: number = 401;
  constructor(message: string, options?: AppErrorOptions) {
    super(message, options);
  }
}
