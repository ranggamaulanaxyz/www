import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getTodayPrayerTimes } from "../services/prayer-time";
import type { PrayerTimes } from "~/integrations/myquran/schemas";
import { Await, useLoaderData } from "react-router";
import { clientLoader } from "~/features/desk/routes/desk";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";

export default function TodayPrayerTimesCard() {
  const { todayPrayerTimesPromise } = useLoaderData<typeof clientLoader>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Shalat Hari Ini</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="text-center">Memuat data...</div>}>
          <Await
            resolve={todayPrayerTimesPromise}
            errorElement={
              <div className="text-destructive text-center">
                Gagal memuat jadwal shalat!
              </div>
            }
          >
            {({ schedule }) => (
              <div className="grid grid-cols-2 gap-1">
                <div className="font-bold">Imsak</div>
                <div className="text-right">{schedule.imsak}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Shubuh</div>
                <div className="text-right">{schedule.subuh}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Terbit</div>
                <div className="text-right">{schedule.terbit}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Dzuhur</div>
                <div className="text-right">{schedule.dzuhur}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Ashar</div>
                <div className="text-right">{schedule.ashar}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Maghrib</div>
                <div className="text-right">{schedule.maghrib}</div>
                <Separator className="col-span-2" />
                <div className="font-bold">Isya</div>
                <div className="text-right">{schedule.isya}</div>
              </div>
            )}
          </Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}
