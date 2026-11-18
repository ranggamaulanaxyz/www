export type AppErrorOptions = ErrorOptions & {
  status?: number;
};
export class AppError extends Error {
  public name: string = "AppError";
  public status: number = 500;
  constructor(message: string, options?: AppErrorOptions) {
    super(message, { cause: options?.cause });
    this.status = options?.status ?? 500;
  }
}
