import {
  fetchPrayerTimeCities,
  fetchTodayPrayerTimes,
} from "~/integrations/myquran/services";
import { CityNotFoundError, TodayScheduleNotFoundError } from "../execeptions";

export async function getPrayerTimesLocation(id: "all" | string = "all") {
  const data = await fetchPrayerTimeCities(id);
  return data;
}
export async function getTodayPrayerTimes() {
  const cities = await getPrayerTimesLocation();
  const city = cities.at(0);
  if (!city) {
    throw new CityNotFoundError("City not found.");
  }
  const data = await fetchTodayPrayerTimes(city?.id);
  const schedule = Object.values(data.jadwal).at(0);
  if (!schedule) {
    throw new TodayScheduleNotFoundError("Today prayer times not found");
  }
  return schedule;
}
