import z from "zod";

export const accountSchema = z.object({
  id: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  code: z.string("Kode akun tidak valid."),
  name: z.string("Nama akun tidak valid."),
  accountSubtypeId: z.uuid("Subtipe akun tidak valid."),
});

export const accountListSchema = z.array(accountSchema);
