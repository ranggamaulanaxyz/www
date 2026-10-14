import z from "zod";

export const passwordSchema = z
  .string("Kata sandi tidak valid")
  .min(8, "Kata sandi minimal 8 karakter.")
  .max(64, "Kata sandi maksimal 64 karakter.")
  .regex(/[A-Z]/, "Kata sandi harus mengandung huruf besar.")
  .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil.")
  .regex(/[0-9]/, "Kata sandi harus mengandung angka")
  .regex(
    /[^A-Za-z0-9]/,
    "Kata sandi harus mengandung spesial karakter (!@#$%^&*, dll.).",
  );
