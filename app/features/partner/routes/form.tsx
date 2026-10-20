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
import { supabaseClientContext } from "~/context";
import { getPartnerById, updatePartner } from "../services/partner";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { hasAccess } from "~/features/desk/services/access";
import type { Handle } from "~/features/desk/types/route";

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
  breadcrumb: (match) => {
    return {
      label: "Kontak",
    };
  },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { partnerId } = params;
  const supabase = context.get(supabaseClientContext);
  const partner = await getPartnerById(supabase, partnerId);
  const canUpdate = await hasAccess(supabase, "update", "partners");
  return data({ partner, canUpdate });
}

export async function action({ request, context, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updatePartner(
    supabase,
    params.partnerId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

function FieldTextInput(props: {
  field: FieldMetadata;
  type?: "text" | "email";
  label: string;
  readOnly?: boolean;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
      <Input
        {...getInputProps(props.field, { type: props.type ?? "text" })}
        readOnly={props.readOnly}
      />
      <FieldError errors={props.field.errors} />
    </Field>
  );
}

export default function PartnerForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { partner, canUpdate } = loaderData;
  const [form, fields] = useForm({
    defaultValue: {
      name: partner.name,
      nickname: partner.nickname,
      email: partner.email,
      phone: partner.phone,
    },
    lastResult: actionData?.lastResult ?? null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form {...getFormProps(form)} method="post" className="flex flex-col">
      <PartnerTopBar options={{ showSaveButton: canUpdate }} />
      <div className="p-4">
        <div className="grid md:grid-cols-2">
          <FieldGroup>
            <FieldTextInput
              field={fields.name}
              label="Nama"
              readOnly={canUpdate !== true}
            />
            <FieldTextInput
              field={fields.nickname}
              label="Nama Panggilan"
              readOnly={canUpdate !== true}
            />
            <FieldTextInput
              field={fields.email}
              type="email"
              label="Alamat Email"
              readOnly={canUpdate !== true}
            />
            <FieldTextInput
              field={fields.phone}
              label="Nomor Telepon"
              readOnly={canUpdate !== true}
            />

            <Field>
              <FieldLabel htmlFor="updatedAt">Tanggal Dibuat</FieldLabel>
              <Input id="createdAt" value={partner.createdAt} readOnly={true} />
            </Field>

            <Field>
              <FieldLabel htmlFor="updatedAt">
                Tanggal Terakhir Diubah
              </FieldLabel>
              <Input
                id="updatedAt"
                value={partner.updatedAt || ""}
                readOnly={true}
              />
            </Field>
          </FieldGroup>
        </div>
      </div>
    </Form>
  );
}

function PartnerTopBar({
  options,
}: {
  options: { showSaveButton: boolean | null };
}) {
  return (
    <TopBar>
      <DeskHeader>
        <div className="px-4">
          {options.showSaveButton && <Button type="submit">Simpan</Button>}
        </div>
      </DeskHeader>
    </TopBar>
  );
}
