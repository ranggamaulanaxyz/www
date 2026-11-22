import z from "zod";

export const citySchema = z.object({
  id: z.string("ID kota tidak valid."),
  lokasi: z.string("Lokasi kota tidak valid."),
});

export const fetchCityResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(citySchema),
});

export const prayerTimesSchema = z.object({
  tanggal: z.string(),
  imsak: z.string(),
  subuh: z.string(),
  terbit: z.string(),
  dhuha: z.string(),
  dzuhur: z.string(),
  ashar: z.string(),
  maghrib: z.string(),
  isya: z.string(),
});
export type PrayerTimes = z.infer<typeof prayerTimesSchema>;

export const fetchTodayPrayerTimesResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    kabko: z.string(),
    prov: z.string(),
    jadwal: z.record(z.string(), prayerTimesSchema),
  }),
});
