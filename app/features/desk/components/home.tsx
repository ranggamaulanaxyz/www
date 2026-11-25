import {
  ArrowLeft,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookTextIcon,
  CalendarCheckIcon,
  ClockIcon,
  CommandIcon,
  EllipsisVerticalIcon,
  HandCoins,
  PackageIcon,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";
import AccountingSummaryCard from "~/features/accounting/accounting-summary-card";
import PartnerSummaryCard from "~/features/partner/components/partner-summary-card";
import TodayPrayerTimesCard from "~/features/prayer-times/components/today-prayer-times-card";
import ProductSummaryCard from "~/features/product/components/product-summary-card";
import { DeskLiveClock } from "./live-clock";
import { clientLoader } from "../routes/desk";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function Home() {
  const { user } = useLoaderData<typeof clientLoader>();
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex justify-between">
        <div className="flex gap-2">
          <div>
            <Avatar size="lg">
              <AvatarFallback>
                {user?.firstName.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-base">
            <div>{user?.firstName || "Pengguna"}</div>
            <p className="text-muted-foreground text-xs">{user?.email || ""}</p>
          </div>
        </div>
      </header>
      <main className="grid gap-2">
        <div className="grid gap-1">
          <h2>Keagamaan</h2>
          <ItemGroup className="grid gap-0">
            <Item variant="outline">
              <ItemMedia variant="icon">
                <span className="text-background flex size-6 items-center justify-center rounded bg-amber-600">
                  <ClockIcon />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <Link to="/desk/prayer">Jadwal Shalat</Link>
                </ItemTitle>
                <ItemDescription>
                  Jadwal shalat harian, mingguan dan bulanan.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button size="icon" variant="outline">
                        <EllipsisVerticalIcon />
                      </Button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        render={
                          <Link to="/desk/prayer?today=true">
                            <CalendarCheckIcon /> <span>Jadwal Hari Ini</span>
                          </Link>
                        }
                      />
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <span className="text-background flex size-6 items-center justify-center rounded bg-emerald-600">
                  <BookTextIcon />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Al-Qur'an</ItemTitle>
                <ItemDescription>
                  Baca Al-Qur'an dengan terjemahan dan suara.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  nativeButton={false}
                  size="icon"
                  variant="outline"
                  render={
                    <Link to="/muslim/prayer">
                      <ArrowRightIcon />
                    </Link>
                  }
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
        <div>
          <h2>Keuangan</h2>
          <ItemGroup>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <span className="text-background flex size-6 items-center justify-center rounded bg-pink-600">
                  <HandCoins />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Keuangan</ItemTitle>
                <ItemDescription>
                  Catat pemasukan dan pengeluaran.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  nativeButton={false}
                  size="icon"
                  variant="outline"
                  render={
                    <Link to="/desk/accounting">
                      <ArrowRightIcon />
                    </Link>
                  }
                />
              </ItemActions>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <span className="text-background flex size-6 items-center justify-center rounded bg-violet-600">
                  <PackageIcon />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Produk</ItemTitle>
                <ItemDescription>
                  Tambah dan ubah informasi produk.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  nativeButton={false}
                  size="icon"
                  variant="outline"
                  render={
                    <Link to="/desk/products">
                      <ArrowRightIcon />
                    </Link>
                  }
                />
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </main>
    </div>
  );
}
