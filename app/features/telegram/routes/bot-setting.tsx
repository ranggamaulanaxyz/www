import { getEnv } from "~/utils/env.server";
import type { Route } from "./+types/bot-setting";
import { getFormProps, useForm } from "@conform-to/react";
import z from "zod";
import { parseForm } from "~/utils/request";
import { Form } from "react-router";
import { FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";

const schema = z.object({ url: z.url() });

export async function loader() {
  const response = await fetch(
    `https://api.telegram.org/bot${getEnv("ZET_TELEGRAM_API_TOKEN")}/getWebhookInfo`,
  );
  const body = await response.json();

  return { data: body as any };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema });
  if (submission.status !== "success") {
    return { lastResult: submission.reply() };
  }
  const response = await fetch(
    `https://api.telegram.org/bot${getEnv("ZET_TELEGRAM_API_TOKEN")}/setWebhook?url=${submission.value.url}`,
  );
  const body = await response.json();

  return { data: body as any };
}

export default function TelegramBotSetting({
  loaderData,
}: Route.ComponentProps) {
  const { data } = loaderData;
  const [form, fields] = useForm({
    defaultValue: {
      url: data?.result?.url || "",
    },
    onValidate({ formData }) {
      return parseForm(formData, { schema });
    },
  });
  return (
    <Form {...getFormProps(form)} method="post">
      <FieldText field={fields.url} label="URL" />
      <Button type="submit">Simpan</Button>
    </Form>
  );
}
