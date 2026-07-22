import type { Route } from "./+types/drive-list";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findAll } from "~/modules/drive/services";
import Loading from "~/components/ui/loading";
import DriveGridView from "~/modules/drive/components/item";
import { DriveEmptyVIew } from "~/modules/drive/components/empty";
import DeskHeader from "~/components/desk/header";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  const drives = await findAll(supabase);

  return { loaded: true, drives };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function DriveList({ loaderData }: Route.ComponentProps) {
  const { loaded, drives } = loaderData;

  return (
    <Loading loaded={loaded}>
      <DeskHeader />
      {drives.length ? <DriveGridView items={drives} /> : <DriveEmptyVIew />}
    </Loading>
  );
}
