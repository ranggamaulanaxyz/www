import { CommandIcon } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import AccountingSummaryCard from "~/features/accounting/accounting-summary-card";
import PartnerSummaryCard from "~/features/partner/components/partner-summary-card";
import TodayPrayerTimesCard from "~/features/prayer-times/components/today-prayer-times-card";
import ProductSummaryCard from "~/features/product/components/product-summary-card";
import { DeskLiveClock } from "./live-clock";
import { clientLoader } from "../routes/desk";

export default function Home() {
  const { user } = useLoaderData<typeof clientLoader>();
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex justify-between">
        <Link to="/desk">
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
            <CommandIcon className="size-4" />
          </div>
        </Link>
        <DeskLiveClock tz={user?.timeZone} />
      </header>
      <main className="grid gap-4">
        <TodayPrayerTimesCard />
        <AccountingSummaryCard />
        <ProductSummaryCard />
        <PartnerSummaryCard />
      </main>
    </div>
  );
}
