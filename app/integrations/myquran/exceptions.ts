export class MyQuranApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: unknown;
  constructor(
    message: string,
    options: ErrorOptions & {
      status: number;
      statusText: string;
      data?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "MyQuranApiError";
    this.status = options.status;
    this.statusText = options.statusText;
    this.data = options.data;
  }
}
