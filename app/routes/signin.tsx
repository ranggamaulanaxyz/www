import { Form, Link, redirect } from "react-router";
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
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/signin";
import { useEffect, useState } from "react";
import { validate } from "~/lib/utils";
import { SigninSchema } from "~/modules/auth/schemas";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { userSignIn } from "~/modules/auth/services";
import { toast } from "sonner";
import { authMiddleware, onlyGuestMiddleware } from "~/modules/auth/middleware";
import { Logo } from "~/components/brand/logo";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  onlyGuestMiddleware,
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to your account." },
  ];
}

async function validateFormData(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const result = await validate(SigninSchema, data);
  return result;
}

export async function action({ request, context }: Route.ActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    return { errors: { fieldErrors: validation.errors } };
  }
  const supabase = context.get(SupabaseClientContext);
  const { success, data, error } = await userSignIn(supabase, validation.data);
  if (!success) {
    return { errors: { formErrors: error ? [error] : null } };
  }
  return redirect("/");
}

export async function clientAction({
  request,
  serverAction,
}: Route.ClientActionArgs) {
  const clientRequest = request.clone();
  const validation = await validateFormData(await clientRequest.formData());
  if (validation.success) {
    return serverAction();
  }

  return { errors: { fieldErrors: validation.errors } };
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const formErrors = actionData?.errors.formErrors || null;
  const initialFieldErrors = actionData?.errors.fieldErrors || null;
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);

  useEffect(() => {
    setFieldErrors(initialFieldErrors);
  }, [initialFieldErrors]);

  useEffect(() => {
    formErrors?.map((error) => {
      toast.error(error.message);
    });
  }, [formErrors]);

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
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Sign in to your account to access more features.
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
                  />
                  <FieldError errors={fieldErrors?.email} />
                </Field>
                <Field data-invalid={!!fieldErrors?.password}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      to="/password/forgot"
                      title="Forgot your password?"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    aria-invalid={!!fieldErrors?.password}
                  />
                  <FieldError errors={fieldErrors?.password} />
                </Field>
                <Field>
                  <Button type="submit">Sign In</Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
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
