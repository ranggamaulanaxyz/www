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
import { validate } from "~/lib/utils";
import { SignupSchema } from "~/modules/auth/schemas";
import { toast } from "sonner";

async function userSignupApi(data: SignupSchema): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      confirm_password: data.confirmPassword,
      terms_agreed: data.termsAgreed,
    }),
  });

  return await response.json();
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signup" },
    {
      name: "description",
      content: "Create new account to join my community.",
    },
  ];
}

async function validateFormData(formData: FormData) {
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm_password") as string,
    termsAgreed: formData.get("terms_agreed") === "on",
  };
  const result = await validate(SignupSchema, data);
  return result;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    return {
      errors: {
        fieldErrors: validation.errors,
      },
    };
  }

  const signup = await userSignupApi(validation.data);
  if (!signup.success) {
    return {
      errors: {
        formErrors: [{ message: signup.message }],
      },
    };
  }

  redirect("/signin");
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
  }, [actionData?.errors.formErrors]);

  const handleBlurForm = async (event: React.FocusEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const result = await validateFormData(formData);
    if (!result.success) {
      setFieldErrors(result.errors);
    } else {
      setFieldErrors(null);
    }
  };

  return (
    <main className="flex h-svh items-center justify-center">
      <div className="mx-auto max-w-sm grow">
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
                <Field data-invalid={!!fieldErrors?.username}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    aria-invalid={!!fieldErrors?.username}
                  />
                  <FieldError errors={fieldErrors?.username} />
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
                  data-invalid={!!fieldErrors?.termsAgreed}
                >
                  <Checkbox
                    id="terms_agreed"
                    name="terms_agreed"
                    aria-invalid={!!fieldErrors?.termsAgreed}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="terms_agreed">
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
