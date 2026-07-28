import DeskHeader from "~/components/desk/header";
import Loading from "~/components/ui/loading";
import type { Route } from "./+types/setting-list";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findSettings } from "~/modules/setting/repositories";
import SettingListView from "~/modules/setting/components/list";
import { useNavigate, useOutlet } from "react-router";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const supabase = context.get(SupabaseClientContext);
  const { settings } = await findSettings(supabase);

  return { settings };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function SettingList({ loaderData }: Route.ComponentProps) {
  const { settings } = loaderData;

  const outlet = useOutlet();
  const navigate = useNavigate();

  const [activeOutlet, setActiveOutlet] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (outlet) {
      setActiveOutlet(outlet);
    }
  }, [outlet]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate("/desk/settings");
    }
  };

  return (
    <Loading loaded={true}>
      <DeskHeader />
      <SettingListView settings={settings} />
      <Dialog open={!!outlet} onOpenChange={handleOpenChange}>
        <DialogContent>{activeOutlet}</DialogContent>
      </Dialog>
    </Loading>
  );
}
