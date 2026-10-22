import { supabaseClientContext } from "~/context";
import type { Route } from "./+types/account-subtype-form";
import {
  getAccountSubtypeById,
  updateAccountSubtype,
} from "../services/account-subtype";
import { data, Form } from "react-router";
import z from "zod";
import { accountTypeSchema } from "../schemas/account-subtype";
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, useForm } from "@conform-to/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { accountTypeOptions } from "./account-subtype";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Handle } from "~/features/desk/types/route";

const schema = z.object({
  name: z.string("Nama tidak valid."),
  type: accountTypeSchema,
});

export const handle = {
  breadcrumb: (match) => ({
    label: match.loaderData?.accountSubtype.name || "Tanpa Nama",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const accountSubtype = await getAccountSubtypeById(
    supabase,
    params.accountSubtypeId,
  );

  return data({ accountSubtype });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateAccountSubtype(
    supabase,
    params.accountSubtypeId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function AccountSubtypeForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountSubtype } = loaderData;
  const [form, fields] = useForm({
    defaultValue: { ...loaderData.accountSubtype },
    lastResult: actionData?.lastResult || null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form {...getFormProps(form)} method="post">
      <TopBar>
        <DeskHeader>
          <div className="px-4">
            <Button type="submit">Simpan</Button>
          </div>
        </DeskHeader>
      </TopBar>
      <div className="max-w-1/2 p-4">
        <FieldGroup>
          <FieldTextInput field={fields.name} label="Name" />
          <Field data-invalid={!fields.type.valid}>
            <FieldLabel htmlFor={fields.type.id}>Tipe</FieldLabel>
            <Select
              id={fields.type.id}
              name={fields.type.name}
              items={accountTypeOptions}
              defaultValue={fields.type.defaultValue}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!fields.type.valid}
              >
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {accountTypeOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={fields.type.errors} />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Dibuat</FieldLabel>
            <Input
              id="createdAt"
              value={accountSubtype.createdAt}
              readOnly={true}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={accountSubtype.updatedAt || ""}
              readOnly={true}
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
