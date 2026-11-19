import { data, Form, Link, redirect, useNavigation } from "react-router";
import {
  Card,
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
import { ArrowLeftIcon } from "lucide-react";
import type { Route } from "./+types/signin";
import { supabaseClientContext } from "~/context";
import { authMiddleware, guestOnlyMiddleware } from "../middlewares.server";
import Wrapper from "../components/wrapper";
import { useEffect } from "react";
import { toast } from "~/components/ui/toast";
import { Spinner } from "~/components/ui/spinner";
import { InvalidCredentialsError } from "../exceptions/auth";
import { hasGroup, signInWithPassword } from "../sevices/user";

const schema = z.object({
  email: z.email("Alamat email tidak valid."),
  password: z.string("Kata sandi tidak valid."),
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
    return data({ success: false, lastResult: submission.reply() });
  }
  const supabase = context.get(supabaseClientContext);
  console.log("[SIGNIN] Action started");

  try {
    console.log("[SIGNIN] Calling Supabase Auth");

    await signInWithPassword(supabase, submission.value);

    console.log("[SIGNIN] Supabase Auth success");
  } catch (error: unknown) {
    console.log("[SIGNIN] CATCH REACHED");

    const details = {
      isError: error instanceof Error,
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
      properties:
        error && typeof error === "object"
          ? Object.getOwnPropertyNames(error)
          : [],
    };

    console.log("[SIGNIN] ERROR DETAILS", JSON.stringify(details));

    if (error instanceof InvalidCredentialsError) {
      return data({
        success: false,
        lastResult: submission.reply({
          formErrors: ["Alamat email atau kata sandi tidak valid."],
        }),
      });
    }

    throw error;
  }

  let isInternalUser: boolean;

  try {
    isInternalUser = await hasGroup(supabase, "Internal Users");
  } catch (error) {
    console.error("Group Verification Error", error);
    throw error;
  }

  if (isInternalUser) {
    throw redirect("/desk");
  }

  throw redirect("/");
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    form.errors?.map((message) => {
      toast.add({
        title: message,
        type: "info",
      });
    });
  }, [form.errors]);

  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>
            Silahkan masukan alamat email dan kata sandi anda untuk mengakses
            fitur yang lebih banyak.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...getFormProps(form)} method="post">
            <FieldGroup>
              <Field data-invalid={!fields.email.valid}>
                <FieldLabel htmlFor={fields.email.id}>Alamat Email</FieldLabel>
                <Input
                  {...getInputProps(fields.email, { type: "email" })}
                  autoComplete="current-password"
                />
                <FieldError errors={fields.email.errors} />
              </Field>
              <Field data-invalid={!fields.password.valid}>
                <FieldLabel htmlFor={fields.password.id}>Kata Sandi</FieldLabel>
                <Input
                  {...getInputProps(fields.password, { type: "password" })}
                  autoComplete="current-password"
                />
                <FieldError errors={fields.password.errors} />
              </Field>
              <p>
                <Link
                  to="/password/reset"
                  title="Lupa kata sandi?"
                  className="text-xs"
                >
                  Lupa kata sandi?
                </Link>
              </p>
              <Field>
                <Button type="submit" disabled={!isIdle}>
                  {isSubmitting && <Spinner />}Masuk
                </Button>
                <Link
                  to="/"
                  title="Kembali ke Halaman Utama"
                  className={buttonVariants({ variant: "link" })}
                >
                  <ArrowLeftIcon /> Kembali ke Halaman Utama
                </Link>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
