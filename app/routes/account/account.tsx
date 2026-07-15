import { AuthContext, onlyUserMiddleware } from "~/modules/auth/middleware";
import type { Route } from "./+types/account";
import { Outlet } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export const middleware: Route.MiddlewareFunction[] = [onlyUserMiddleware];

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const auth = context.get(AuthContext);
  const user = auth?.user ?? null;
  return { user };
}

export default function Account() {
  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2">
        <div>
          <div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="">
              <div>
                <p>Rangga</p>
                <p>Partner</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
