import z from "zod";

export const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    lastName: z.string().optional().nullable(),
    email: z.email("Please input valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    termAccepted: z
      .boolean()
      .default(false)
      .refine((value) => value, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof SignupSchema>;

export const SigninSchema = z.object({
  email: z.string().nonempty("Email is required!"),
  password: z.string().nonempty("Password is required!"),
});

export type SigninSchema = z.infer<typeof SigninSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().nonempty("Email is required!"),
});

export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;