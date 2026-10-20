import {
  data,
  Form,
  isRouteErrorResponse,
  Link,
  useNavigate,
  useNavigation,
} from "react-router";
import type { Route } from "./+types/password-recovery";
import { supabaseClientContext } from "~/context";
import { ErrorBoundary as RootErrorBoundary } from "~/root";
import Wrapper from "../components/wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import z from "zod";
import { passwordSchema } from "../schemas/password";
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { useEffect } from "react";
import { toast } from "~/components/ui/toast";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { authMiddleware, guestOnlyMiddleware } from "../middlewares.server";

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string("Mohon konfirmasi kata sandi.")
      .min(1, "Mohon konfirmasi kata sandi."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Kata sandi tidak sama.",
    path: ["confirmNewPassword"],
  });

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  guestOnlyMiddleware,
];

export function meta() {
  return [{ title: "Atur Ulang Kata Sandi" }];
}

export async function loader({ url }: Route.LoaderArgs) {
  const tokenHash = url.searchParams.get("token_hash");
  if (!tokenHash) {
    throw data({ message: "Halaman tidak ditemukan!" }, { status: 404 });
  }
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  const tokenHash = url.searchParams.get("token_hash");
  if (!tokenHash) {
    return data({
      lastResult: submission.reply({
        formErrors: ["TOKEN_INVALID"],
      }),
    });
  }

  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() });
  }

  const supabase = context.get(supabaseClientContext);
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (error) {
    switch (error.code) {
      case "otp_expired":
        throw data(
          {
            lastResult: submission.reply({
              formErrors: ["TOKEN_INVALID"],
            }),
          },
          { status: 403 },
        );

      default:
        throw error;
    }
  }
}

export default function PasswordRecovery({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isSubmitting = navigation.state === "submitting";

  const [form, fields] = useForm({
    lastResult: actionData?.lastResult ?? null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    form.errors?.map((error) => {
      const title =
        error === "TOKEN_INVALID"
          ? "Token sudah kadaluarsa atau invalid"
          : error;
      toast.add({
        title,
        actionProps: {
          children: "Perbarui",
          onClick() {
            navigate("/password/reset");
          },
        },
      });
    });
  }, [actionData?.lastResult]);

  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <CardTitle>Kata Sandi Baru</CardTitle>
          <CardDescription>
            Masukan kata sandi barumu dibawah ini untuk mengganti kata sandi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...getFormProps(form)} method="post">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={fields.newPassword.id}>
                  Kata Sandi Baru
                </FieldLabel>
                <Input
                  {...getInputProps(fields.newPassword, { type: "password" })}
                />
                <FieldError errors={fields.newPassword.errors} />
              </Field>
              <Field>
                <FieldLabel htmlFor={fields.confirmNewPassword.id}>
                  Konfirmasi Kata Sandi Baru
                </FieldLabel>
                <Input
                  {...getInputProps(fields.confirmNewPassword, {
                    type: "password",
                  })}
                />
                <FieldError errors={fields.confirmNewPassword.errors} />
              </Field>
              <Field>
                <Button type="submit" disabled={!isIdle}>
                  {isSubmitting && <Spinner />} Ubah Kata Sandi
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </Wrapper>
  );
}

export function ErrorBoundary({ error, params }: Route.ErrorBoundaryProps) {
  if (!isRouteErrorResponse(error) || error.status === 404) {
    return <RootErrorBoundary error={error} params={params} />;
  }

  if (error.status === 403) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Token Tidak Valid</CardTitle>
            <CardDescription>
              Token tidak valid atau sudah kadaluarsa. Ikuti tautan dibawah ini
              untuk meminta tatan baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:col-span-2">
              <Link
                to="/password/reset"
                title="Pemulihan kata sandi"
                className={buttonVariants({ variant: "default" })}
              >
                Minta Tautan Baru
              </Link>
              <Link
                to="/signin"
                title="Kembali ke Halaman Masuk"
                className={buttonVariants({ variant: "link" })}
              >
                <ArrowLeftIcon />
                Kembali Ke Halaman Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }
}
