import z from "zod";

export const SignupSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    termsAgreed: z
      .boolean()
      .default(false)
      .refine((value) => value, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof SignupSchema>;
