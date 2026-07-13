export interface ValidationErrorDetail {
  message: string;
}

export type ValidationError<T> = {
  [K in keyof T]?: ValidationErrorDetail[];
} & {
  unrecognizedKey?: ValidationErrorDetail[];
};
