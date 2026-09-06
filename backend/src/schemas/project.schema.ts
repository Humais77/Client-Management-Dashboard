import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(150),

  description: z
    .string()
    .trim()
    .min(2)
    .max(2000),

  client: z
    .string()
    .min(1),

  status: z
    .enum([
      "Pending",
      "In Progress",
      "Completed"
    ])
    .default("Pending")
});