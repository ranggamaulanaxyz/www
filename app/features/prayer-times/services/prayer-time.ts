import {
  fetchPrayerTimeCities,
  fetchTodayPrayerTimes,
} from "~/integrations/myquran/services";
import { CityNotFoundError, TodayScheduleNotFoundError } from "../execeptions";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserBySession } from "~/features/auth/sevices/user";

export async function getPrayerTimesLocation(id: "all" | string = "all") {
  const data = await fetchPrayerTimeCities(id);
  return data;
}
export async function getTodayPrayerTimes(supabase: SupabaseClient) {
  const user = await getUserBySession(supabase);
  let cityId = user?.prayerTimesCityId;
  if (!cityId) {
    const cities = await getPrayerTimesLocation();
    const city = cities.at(0);
    if (!city) {
      throw new CityNotFoundError("City not found.");
    }
    cityId = city.id;
  }

  const data = await fetchTodayPrayerTimes(cityId);
  const schedule = Object.values(data.jadwal).at(0);
  if (!schedule) {
    throw new TodayScheduleNotFoundError("Today prayer times not found");
  }
  return { city: data.kabko, schedule };
}
