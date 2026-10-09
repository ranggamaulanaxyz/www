import { data, Form, Link } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import z from "zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { XIcon } from "lucide-react";
import type { Route } from "./+types/signin";
import { supabaseClientContext } from "~/context";
import { authMiddleware, guestOnlyMiddleware } from "../middlewares.server";

const schema = z.object({
  email: z.email("Alamat email tidak sah"),
  password: z.string("Kata sandi tidak sah"),
});

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  guestOnlyMiddleware,
];

export function meta() {
  return [
    { title: "Masuk" },
    { name: "description", content: "Masuk untuk mengakses fitur lainnya" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() });
  }
  const supabase = context.get(supabaseClientContext);
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(submission.value);

  if (error) {
    switch (error.code) {
      case "email_address_invalid":
      case "invalid_credentials":
        return data({ message: "Alamat email atau kata sandi salah" });

      default:
        throw error;
    }
  }

  return data({ message: user?.email });
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="mx-auto max-w-md flex-1 grow">
        <Card>
          <CardHeader>
            <CardTitle>Masuk</CardTitle>
            <CardDescription>
              Silahkan masukan alamat email dan kata sandi anda untuk mengakses
              fitur yang lebih banyak.
            </CardDescription>
            <CardAction>
              <Link
                to="/"
                title="Kembali ke halaman utama"
                className={buttonVariants({ variant: "ghost" })}
              >
                <XIcon />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Form {...getFormProps(form)} method="post">
              <FieldGroup>
                <Field data-invalid={!fields.email.valid}>
                  <FieldLabel htmlFor={fields.email.id}>
                    Alamat Email
                  </FieldLabel>
                  <Input {...getInputProps(fields.email, { type: "email" })} />
                  {fields.email.errors && (
                    <FieldError>{fields.email.errors[0]}</FieldError>
                  )}
                </Field>
                <Field data-invalid={!fields.password.valid}>
                  <FieldLabel htmlFor={fields.password.id}>
                    Kata Sandi
                  </FieldLabel>
                  <Input
                    {...getInputProps(fields.password, { type: "password" })}
                  />
                  {fields.password.errors && (
                    <FieldError>{fields.password.errors[0]}</FieldError>
                  )}
                </Field>
                <Field>
                  <Button type="submit">Masuk</Button>
                </Field>
              </FieldGroup>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
