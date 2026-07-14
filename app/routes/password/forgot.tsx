import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/forgot";
import { useEffect, useState } from "react";
import { getEmailClientUrl, validate } from "~/lib/utils";
import { ForgotPasswordSchema } from "~/modules/auth/schemas";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { sendEmailResetPassword } from "~/modules/auth/services";
import { authMiddleware, onlyGuestMiddleware } from "~/modules/auth/middleware";
import { Logo } from "~/components/ui/brand/logo";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  onlyGuestMiddleware,
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password" },
    { name: "description", content: "Reset your password." },
  ];
}

async function validateFormData(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
  };
  const result = await validate(ForgotPasswordSchema, data);
  return result;
}

export async function action({ request, context }: Route.ClientActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    return { errors: { fieldErrors: validation.errors } };
  }
  const supabase = context.get(SupabaseClientContext);
  const { success } = await sendEmailResetPassword(supabase, validation.data);
  //   if (!success) {
  //     return { errors: { formErrors: error ? [error] : null } };
  //   }
  return { success, data: validation.data };
}

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  const success = !!actionData?.success;
  //   const formErrors = actionData?.errors.formErrors || null;
  const initialFieldErrors = actionData?.errors?.fieldErrors || null;
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);

  useEffect(() => {
    setFieldErrors(initialFieldErrors);
  }, [initialFieldErrors]);

  //   useEffect(() => {
  //     formErrors?.map((error) => {
  //       toast.error(error.message);
  //     });
  //   }, [formErrors]);

  if (success) {
    return (
      <main className="flex h-svh items-center justify-center">
        <div className="mx-auto max-w-sm grow">
          <div className="mb-6 text-center">
            <Link to="/" className="text-lg font-bold">
              <Logo />
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Email sent!</CardTitle>
              <CardDescription>
                Check your email for a message with instructions on how to reset
                your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p>
                If you don't receive an email within a few minutes, please check
                your spam folder.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Button asChild>
                  <a
                    href={getEmailClientUrl(actionData?.data?.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Inbox
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/signin">Signin Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-svh items-center justify-center">
      <div className="mx-auto max-w-sm grow">
        <div className="mb-6 text-center">
          <Link to="/" className="text-lg font-bold">
            <Logo />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <FieldGroup>
                <Field data-invalid={!!fieldErrors?.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    aria-invalid={!!fieldErrors?.email}
                    placeholder="youremail@example.com"
                  />
                  <FieldError errors={fieldErrors?.email} />
                </Field>
                <Field>
                  <Button type="submit">Send Reset Link</Button>
                  <FieldDescription className="text-center">
                    Go Back to{" "}
                    <Link to="/signin" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
