import z from "zod";

export const phoneSchema = z
  .string()
  .regex(
    /^\+[1-9]\d{1,14}$/,
    "Format nomor telepon tidak valid. (contoh: +6281234567890)",
  );

export const partnerSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  name: z.string("Nama kontak tidak valid."),
  nickname: z
    .string("Nama panggilan kontak tidak valid.")
    .optional()
    .nullable(),
  email: z.email("Alamat email kontak tidak valid.").optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  image: z.string().optional().nullable(),
});

export const partnerListSchema = z.array(partnerSchema);
