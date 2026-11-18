import z from "zod";

export const citySchema = z.object({
  id: z.string("ID kota tidak valid."),
  lokasi: z.string("Lokasi kota tidak valid."),
});

export const getCitySchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(citySchema),
});
