import { CommandIcon } from "lucide-react";
import { Link } from "react-router";
import PartnerSummaryCard from "~/features/partner/components/partner-summary-card";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex justify-between">
        <Link to="/desk">
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
            <CommandIcon className="size-4" />
          </div>
        </Link>
      </header>
      <main className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <PartnerSummaryCard />
      </main>
    </div>
  );
}
