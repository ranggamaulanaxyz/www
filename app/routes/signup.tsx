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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/signup";
import { useEffect, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { getEmailClientUrl, validate } from "~/lib/utils";
import { SignupSchema } from "~/modules/auth/schemas";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { userSignUp } from "~/modules/auth/services";
import { toast } from "sonner";
import { Logo } from "~/components/ui/brand/logo";

export function meta() {
  return [
    { title: "Sign up" },
    {
      name: "description",
      content: "Create new account to join my community.",
    },
  ];
}

async function validateFormData(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    lastName: formData.get("last_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm_password") as string,
    termAccepted: formData.get("term_accepted") === "on",
  };
  const result = await validate(SignupSchema, data);
  return result;
}

export async function clientAction({
  request,
  context,
}: Route.ClientActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    return {
      errors: {
        fieldErrors: validation.errors,
      },
    };
  }

  const supabase = context.get(SupabaseClientContext);
  const { success, data, error } = await userSignUp(supabase, validation.data);

  if (success) {
    return { success, data };
  }

  return {
    success,
    errors: {
      formErrors: error ? [error] : null,
    },
  };
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const success = actionData?.success;
  const errors = actionData?.errors;
  const formErrors = errors?.formErrors || null;
  const initialFieldErrors = errors?.fieldErrors || null;
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);

  useEffect(() => {
    setFieldErrors(initialFieldErrors);
  }, [initialFieldErrors]);

  useEffect(() => {
    formErrors?.map((error) => {
      toast.error(error.message);
    });
  }, [formErrors]);

  const handleBlurForm = async (event: React.FocusEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const result = await validateFormData(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
    } else {
      setFieldErrors(null);
    }
  };

  if (success) {
    const email = actionData?.data?.email;
    return (
      <main className="flex min-h-svh items-center justify-center p-4">
        <div className="mx-auto max-w-md grow">
          <div className="mb-6 text-center">
            <Link to="/" className="text-lg font-bold">
              <Logo />
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                <h1>Registration successful</h1>
              </CardTitle>
              <CardDescription>
                Please check your email to activate your account.
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
                    href={getEmailClientUrl(email)}
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
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="mx-auto max-w-xl grow">
        <div className="mb-6 text-center">
          <Link to="/" className="text-lg font-bold">
            <Logo />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Create new account</h1>
            </CardTitle>
            <CardDescription>
              Create an account to join my community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="POST" onBlur={handleBlurForm}>
              <FieldGroup>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field data-invalid={!!fieldErrors?.name}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        aria-invalid={!!fieldErrors?.name}
                      />
                    </Field>
                    <Field data-invalid={!!fieldErrors?.lastName}>
                      <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                      <Input
                        id="last_name"
                        name="last_name"
                        type="text"
                        aria-invalid={!!fieldErrors?.lastName}
                      />
                    </Field>
                  </div>
                  <FieldError
                    errors={[
                      ...(fieldErrors?.name || []),
                      ...(fieldErrors?.lastName || []),
                    ]}
                  />
                </FieldGroup>
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    aria-invalid={!!fieldErrors?.password}
                  />
                  <FieldError errors={fieldErrors?.password} />
                </Field>
                <Field data-invalid={!!fieldErrors?.confirmPassword}>
                  <FieldLabel htmlFor="confirm_password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    aria-invalid={!!fieldErrors?.confirmPassword}
                  />
                  <FieldError errors={fieldErrors?.confirmPassword} />
                </Field>
                <Field
                  orientation="horizontal"
                  data-invalid={!!fieldErrors?.termAccepted}
                >
                  <Checkbox
                    id="term_accepted"
                    name="term_accepted"
                    aria-invalid={!!fieldErrors?.termAccepted}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="term_accepted">
                      Accept terms and conditions
                    </FieldLabel>
                    <FieldDescription>
                      By clicking this checkbox, you agree to the terms.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
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
