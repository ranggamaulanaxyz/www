import { data, isRouteErrorResponse, Link } from "react-router";
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
import { buttonVariants } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function meta() {
  return [{ title: "Atur Ulang Kata Sandi" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const tokenHash = url.searchParams.get("token_hash");
  if (!tokenHash) {
    throw data({ message: "Halaman tidak ditemukan!" }, { status: 404 });
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
          { message: "Token tidak valid atau kadaluarsa!" },
          { status: 403 },
        );

      default:
        break;
    }
  }
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  const { error } = props;
  if (!isRouteErrorResponse(error) || error.status === 404) {
    return <RootErrorBoundary {...props} />;
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

export default function PasswordRecovery() {
  return;
}
