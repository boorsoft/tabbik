import { createInsertSchema } from "drizzle-zod";
import { tournament } from "../../../db/schema/tournament";
import { z } from "zod";

export const createTournamentSchema = createInsertSchema(tournament, {
  maxTeams: z
    .number()
    .int()
    .refine((val) => val % 4 === 0, {
      message: "The value has to be divisible by 4",
    }),
}).omit({
  ownerId: true,
  isActive: true,
  isRunning: true,
});

export const tournamentFilterSchema = z.object({
  title: z.string().optional(),
  owner: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  isRunning: z.boolean().optional(),
});
