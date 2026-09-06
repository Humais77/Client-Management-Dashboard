import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .string()
    .trim()
    .email(),

  company: z
    .string()
    .trim()
    .min(2)
    .max(150)
});