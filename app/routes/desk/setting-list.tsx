import DeskHeader from "~/components/desk/header";
import Loading from "~/components/ui/loading";
import type { Route } from "./+types/setting-list";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findSettings } from "~/modules/setting/services";
import SettingListView from "~/modules/setting/components/list";
import {
  useNavigate,
  useNavigation,
  useOutlet,
  useSearchParams,
} from "react-router";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { parseFilter } from "~/lib/utils";
export async function clientLoader({ context, url }: Route.ClientActionArgs) {
  const { query, page, pageSize } = parseFilter(url.searchParams, {
    defaultPageSize: 100,
  });
  const supabase = context.get(SupabaseClientContext);
  const { settings, meta } = await findSettings(supabase, {
    query: query || undefined,
    page: page,
    pageSize: pageSize,
  });

  return { settings, meta };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function SettingList({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { settings, meta } = loaderData;

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
      navigate(`/desk/settings?${searchParams.toString()}`);
    }
  };

  return (
    <Loading loaded={true}>
      <DeskHeader />
      <SettingListView settings={settings} meta={meta} />
      <Dialog open={!!outlet} onOpenChange={handleOpenChange}>
        <DialogContent>{activeOutlet}</DialogContent>
      </Dialog>
    </Loading>
  );
}
