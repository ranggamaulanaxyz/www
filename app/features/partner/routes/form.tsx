import { data, Form, type UIMatch } from "react-router";
import type { Route } from "./+types/form";
import { parseWithZod } from "@conform-to/zod/v4";
import z from "zod";
import { phoneSchema } from "../schemas/partner";
import {
  getFormProps,
  getInputProps,
  useForm,
  type FieldMetadata,
} from "@conform-to/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const schema = z.object({
  name: z
    .string("Nama tidak valid.")
    .min(3, "Nama minimal 3 karakter.")
    .max(64, "Nama maksimal 64 karakter."),
  nickname: z.string("Nama panggilan tidak valid.").optional().nullable(),
  email: z.email("Alama email tidak valid.").nullable().optional(),
  phone: phoneSchema.optional().nullable(),
});

export const handle = {
  breadcrumb: (match: any) => {
    return "Kontak";
  },
};

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  return data({ lastResult: submission.reply() });
}

function FieldTextInput(props: {
  field: FieldMetadata;
  type?: "text" | "email";
  label: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
      <Input {...getInputProps(props.field, { type: props.type ?? "text" })} />
      <FieldError errors={props.field.errors} />
    </Field>
  );
}

export default function PartnerForm({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult ?? null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Form {...getFormProps(form)} method="post">
        <div className="grid md:grid-cols-2">
          <FieldGroup>
            <FieldTextInput field={fields.name} label="Nama" />
            <FieldTextInput field={fields.nickname} label="Nama Panggilan" />
            <FieldTextInput
              field={fields.email}
              type="email"
              label="Alamat Email"
            />
            <FieldTextInput field={fields.phone} label="Nomor Telepon" />
            <Field orientation="horizontal">
              <Button>Simpan</Button>
            </Field>
          </FieldGroup>
        </div>
      </Form>
    </div>
  );
}
