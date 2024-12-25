import { z } from "zod";

export const loginValidationSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const signupValidationSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email("Invalid email format"),
  firstName: z.string(),
  lastName: z.string(),
  isNovice: z.boolean().default(false),
});
