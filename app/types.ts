export interface ValidationErrorDetail {
  code?: string;
  title?: string;
  message: string;
}

export type ValidationError<T> = {
  [K in keyof T]?: ValidationErrorDetail[];
} & {
  unrecognizedKey?: ValidationErrorDetail[];
};
