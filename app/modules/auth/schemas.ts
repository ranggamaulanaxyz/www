import z from "zod";

export const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    lastName: z.string().optional().nullable(),
    email: z.email("Please input valid email"),
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
