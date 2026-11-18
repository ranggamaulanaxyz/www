import { AppError, type AppErrorOptions } from "~/exceptions";

export class InvalidCredentialsError extends AppError {
  public name: string = "InvalidCredentialsError";
  public status: number = 401;
  constructor(message: string, options?: AppErrorOptions) {
    super(message, options);
  }
}
