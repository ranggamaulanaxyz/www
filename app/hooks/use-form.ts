import { useState } from "react";
import {
  useLocation,
  useSubmit,
  type FormMethod,
  type FormProps,
} from "react-router";
import type { z, ZodObject, ZodRawShape } from "zod";
import { formatError, validateData } from "~/lib/utils";
import type { ValidationError } from "~/types";
import { useIsMounted } from "./use-mounted";

type FormOptions<S extends ZodRawShape> = {
  id?: string;
  action?: string;
  method?: FormMethod;
  schema: ZodObject<S>;
  defaultValues?: Partial<z.infer<ZodObject<S>>>;
  initialErrors?: ValidationError<z.infer<ZodObject<S>>> | null;
  onSubmit?: (
    e: React.SyntheticEvent<HTMLFormElement>,
    data?: z.infer<ZodObject<S>>,
    error?: ValidationError<z.infer<ZodObject<S>>> | {},
  ) => void;
};

export function useForm<S extends ZodRawShape>({
  id,
  action,
  method,
  schema,
  defaultValues,
  initialErrors,
  onSubmit,
}: FormOptions<S>) {
  const isMounted = useIsMounted();

  const formId = id ?? crypto.randomUUID();
  const submit = useSubmit();
  const location = useLocation();
  const [fieldErrors, setFieldErrors] = useState<ValidationError<
    z.infer<ZodObject<S>>
  > | null>(initialErrors ?? null);

  const validateField = (key: keyof S, value: unknown) => {
    const fieldSchema = schema.shape[key] as unknown as
      z.ZodTypeAny | undefined;
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      const errorDetail = result.error.issues.map(
        (issue: z.core.$ZodIssue) => ({
          message: issue.message,
        }),
      );
      setFieldErrors((prev) => ({
        ...prev,
        [key]: errorDetail,
      }));
    } else {
      setFieldErrors((prev) => {
        if (!prev || !prev[key as keyof typeof prev]) return prev;
        const newErrors = { ...prev };
        delete newErrors[key as keyof typeof newErrors];
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const result = schema.safeParse(rawData);

    if (result.success) {
      e.preventDefault();
      setFieldErrors(null);
      submit(e.currentTarget, {
        method: (method || "post") as FormMethod,
        action: action ?? location.pathname,
      });
    } else {
      e.preventDefault();
      const error = formatError(result.error);
      setFieldErrors(error);
    }

    if (onSubmit) {
      onSubmit(e, result.data, result.error);
    }
  };

  const getProps = (): FormProps => {
    return {
      id: formId,
      method: method || "post",
      action: action ?? location.pathname,
      onSubmit: handleSubmit,
      noValidate: isMounted,
    };
  };

  const getFieldErrors = (key: keyof S) => {
    return fieldErrors?.[key as keyof typeof fieldErrors];
  };

  const getFieldProps = (key: keyof S) => {
    const hasErrors = Boolean(getFieldErrors(key)?.length);
    return { "data-invalid": hasErrors ? true : undefined };
  };

  const getInputProps = (key: keyof S) => {
    const keyStr = String(key);
    const hasErrors = Boolean(getFieldErrors(key)?.length);
    const defaultValue = defaultValues?.[keyStr as keyof typeof defaultValues];

    return {
      id: keyStr,
      name: keyStr,
      defaultValue:
        defaultValue !== undefined ? String(defaultValue) : undefined,
      "aria-invalid": hasErrors ? true : undefined,
      onBlur: (
        e: React.FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        validateField(key, e.target.value);
      },
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        if (fieldErrors?.[key as keyof typeof fieldErrors]) {
          validateField(key, e.target.value);
        }
      },
    };
  };

  return {
    id: formId,
    getProps,
    getFieldProps,
    getFieldErrors,
    getInputProps,
  };
}
