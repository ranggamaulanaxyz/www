import { useForm, type SubmissionResult } from "@conform-to/react";
import type { z } from "zod";
import { parseForm } from "~/utils/request";

export type DeskFormSchema = z.ZodType;

export type DeskFormOptions<T extends DeskFormSchema> = {
  /** Zod schema used to validate the form. */
  schema: T;
  /** Optional form id. Defaults to a stable React `useId`. */
  id?: string;
  /** Initial values of the form. */
  defaultValue?: z.input<T>;
  /** When the form should be validated. */
  shouldValidate?: "onSubmit" | "onBlur" | "onInput";
  /** When the form should be revalidated. */
  shouldRevalidate?: "onSubmit" | "onBlur" | "onInput";
  /**
   * The result of the last submission, usually the `lastResult` returned by
   * the route action. Used to show server side errors on the form.
   */
  lastResult?: SubmissionResult<string[]> | null;
};

/** The form shape Conform knows about, derived from the schema input. */
type FormShape<T extends DeskFormSchema> = z.input<T> extends Record<
  string,
  unknown
>
  ? z.input<T>
  : Record<string, unknown>;

/**
 * Desk form hook: wires a Zod schema into Conform's client side validation.
 *
 * ```tsx
 * const { form, fields } = useDeskForm({ schema: createProductBrandSchema });
 *
 * <Form {...getFormProps(form)} method="post">
 *   <input name={fields.name.name} />
 *   {fields.name.errors?.[0]}
 * </Form>
 * ```
 */
export function useDeskForm<T extends DeskFormSchema>({
  schema,
  id,
  defaultValue,
  shouldValidate = "onSubmit",
  shouldRevalidate = shouldValidate,
  lastResult,
}: DeskFormOptions<T>) {
  const [form, fields] = useForm<FormShape<T>, z.output<T>, string[]>({
    id,
    defaultValue: defaultValue as never,
    shouldValidate,
    shouldRevalidate,
    lastResult,
    onValidate({ formData }) {
      return parseForm(formData, { schema }) as never;
    },
  });

  return { form, fields };
}
