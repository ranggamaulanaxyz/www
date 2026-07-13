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
import z, { ZodError } from "zod";
import { useEffect, useState } from "react";

const SigninSchema = z.object({
  username: z.string().nonempty("Username is required!"),
  password: z.string().nonempty("Password is required!"),
});

interface ValidationErrorDetail {
  message: string;
}

type ValidationError<T> = {
  [K in keyof T]?: ValidationErrorDetail[];
} & {
  unrecognized_key?: ValidationErrorDetail[];
};

function formatError<T>(error: z.ZodError): ValidationError<T> {
  const formattedErrors = error.issues.reduce<
    Record<string, ValidationErrorDetail[]>
  >((prev, current) => {
    const key =
      current.path.length > 0 ? String(current.path[0]) : "unrecognized_key";
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push({
      message: current.message,
    });

    return prev;
  }, {});
  return formattedErrors as ValidationError<T>;
}

async function validate<S extends z.ZodRawShape>(
  schema: z.ZodObject<S>,
  data: unknown,
): Promise<
  | { success: true; data: z.infer<typeof schema> }
  | { success: false; errors: ValidationError<z.infer<typeof schema>> }
> {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const error = formatError<z.infer<typeof schema>>(result.error);
  return { success: false, errors: error };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
  const result = await validate(SigninSchema, data);
  if (result.success) {
    return redirect("/");
  }

  return { errors: result.errors };
}

export async function clientAction({
  request,
  serverAction,
}: Route.ClientActionArgs) {
  const clientRequest = request.clone();
  const formData = await clientRequest.formData();
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
  const result = await validate(SigninSchema, data);
  if (result.success) {
    return serverAction();
  }

  return { errors: result.errors };
}

export default function Signin({ actionData }: Route.ComponentProps) {
  const [fieldErrors, setFieldErrors] = useState(actionData?.errors);
  useEffect(() => {
    setFieldErrors(actionData?.errors);
  }, [actionData?.errors]);
  return (
    <main className="flex h-svh items-center justify-center">
      <div className="mx-auto max-w-sm grow">
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
