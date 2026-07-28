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

// Loader & Action
export interface LoaderResponse<TData = any, TError = any> {
  success: boolean;
  message: string;
  error?: TError;
  data?: TData;
}

export interface ActionResponse<TData = any, TError = any> {
  success: boolean;
  message: string;
  error?: TError;
  data?: TData;
}
