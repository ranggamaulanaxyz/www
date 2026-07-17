import { userVerify } from "~/modules/auth/services";
import type { Route } from "./+types/signup-confirmation";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { data, Form, Link, useFetcher } from "react-router";
import { Logo } from "~/components/brand/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Loading from "~/components/ui/loading";

export async function loader({ url }: Route.LoaderArgs) {
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  if (!token) {
    throw data({ message: "Token is required" }, { status: 404 });
  }
  return { token, email: email, success: null, content: null };
}

export async function clientLoader({
  context,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const supabase = context.get(SupabaseClientContext);
  const { success, data, error } = await userVerify(supabase, serverData.token);
  if (error) {
    return {
      ...serverData,
      success,
      data,
      content: { title: error.title, message: error.message },
    };
  }

  return {
    ...serverData,
    success,
    data,
    content: {
      title: "Hooray! Your account has been activated.",
      message: "You can now sign in using your email and password.",
    },
  };
}

clientLoader.hydrate = true as const;

export default function SignupConfirmation({
  loaderData,
}: Route.ComponentProps) {
  const { success, content } = loaderData;
  const loaded = success !== null;
  const fetcher = useFetcher();

  return (
    <Loading loaded={loaded}>
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
                <h1>{content?.title || "Something Went Wrong"}</h1>
              </CardTitle>
              <CardDescription>
                {content?.message ||
                  "We couldn't complete your request. Please try again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form method="post" className="grid gap-4 md:grid-cols-2">
                {success ? (
                  <Button asChild>
                    <Link to="/signin">Signin Now</Link>
                  </Button>
                ) : (
                  <Button type="submit">Resend</Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </Loading>
  );
}
