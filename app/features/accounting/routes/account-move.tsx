import { supabaseClientContext } from "~/context";
import { getAccountMoves } from "../services/account-move";
import { data } from "react-router";
import type { Route } from "./+types/account-move";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import type { Handle } from "~/features/desk/types/route";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Form, PlusIcon } from "lucide-react";
import { FieldTextInput } from "~/components/ui/field-input";

const title = "Jurnal Umum";

export const handle = { breadcrumb: { label: title } } satisfies Handle<
  Route.ComponentProps["loaderData"]
>;

export async function loader({ url, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const accountMoves = await getAccountMoves(supabase);

  return data({ accountMoves });
}
export default function AccountMove({ loaderData }: Route.ComponentProps) {
  const { accountMoves } = loaderData;
  return (
    <div className="flex-1">
      <AccountMoveTopBar />
    </div>
  );
}

function AccountMoveTopBar() {
  return (
    <TopBar>
      <DeskHeader>
        <div className="flex gap-2 px-4">
          <AccountMoveDialogCreate />
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountMoveDialogCreate() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Tambah
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Jurnal Umum</DialogTitle>
        </DialogHeader>
        <Form></Form>
      </DialogContent>
    </Dialog>
  );
}
