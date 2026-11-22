export type AppErrorOptions = ErrorOptions & {
  status?: number;
  code?: string;
};
export class AppError extends Error {
  public code: string = "unexpected";
  public status: number = 500;
  constructor(message: string, options?: AppErrorOptions) {
    super(message, { cause: options?.cause });
    this.code = options?.code ?? this.code;
    this.status = options?.status ?? this.status;
  }
}

export class NotFoundError extends AppError {
  public code: string = "not_found";
}
