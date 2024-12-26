import { z } from "zod";

export const userFilterSchema = z.object({
  search: z.string().min(3, "Minimum 3 characters required").optional(),
});
