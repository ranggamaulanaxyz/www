export interface ValidationErrorDetail {
  message: string;
}

export type ValidationError<T> = {
  [K in keyof T]?: ValidationErrorDetail[];
} & {
  unrecognized_key?: ValidationErrorDetail[];
};
