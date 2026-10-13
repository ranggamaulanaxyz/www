import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Wrapper from "../components/wrapper";
import { data, Form, Link, useNavigation } from "react-router";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import z from "zod";
import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowLeftIcon, Car } from "lucide-react";
import { cn } from "cn";
import { parseWithZod } from "@conform-to/zod/v4";
import { authMiddleware, guestOnlyMiddleware } from "../middlewares.server";
import type { Route } from "./+types/reset-password";
import { supabaseClientContext } from "~/context";
import { getEnv } from "~/utils/env.server";
import { Spinner } from "~/components/ui/spinner";

const schema = z.object({
  email: z.email("Alamat email tidak valid."),
});

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  guestOnlyMiddleware,
];

export function meta() {
  return [{ title: "Pemulihan Kata Sandi" }];
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const baseUrl = getEnv("BASE_URL");
  const supabase = context.get(supabaseClientContext);
  const { error } = await supabase.auth.resetPasswordForEmail(
    submission.value.email,
    {
      redirectTo: `${baseUrl}/password/recovery`,
    },
  );

  if (error) {
    throw error;
  }

  return data({ success: true, lastResult: submission.reply() });
}

export default function ResetPassword({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  if (actionData?.success) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Email Terkirim!</CardTitle>
            <CardDescription>
              Silahkan periksa dan klik URL untuk memulihkan kata sandimu di
              forlder kotak masuk atau folder spam emailmu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/signin"
              title="Kembali ke halaman masuk"
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Kembali Ke Halaman Masuk
            </Link>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <CardTitle>Pemulihan Kata Sandi</CardTitle>
          <CardDescription>
            Masukan emailmu untuk mendapatkan URL pemulihan kata sandi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" {...getFormProps(form)}>
            <FieldGroup>
              <Field data-invalid={!fields.email.valid}>
                <FieldLabel htmlFor={fields.email.id}>Alamat Email</FieldLabel>
                <Input
                  {...getInputProps(fields.email, { type: "email" })}
                  placeholder="Ketikan alamat email disini..."
                />
                <FieldError errors={fields.email.errors}></FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={!isIdle}>
                  {isSubmitting && <Spinner />} Kirim
                </Button>
                <Link
                  to="/signin"
                  title="Masuk"
                  className={cn(buttonVariants({ variant: "link" }), "text-xs")}
                >
                  <ArrowLeftIcon />
                  Kembali ke halaman masuk.
                </Link>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
