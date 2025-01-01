import { z } from "zod";

export const judgeInvitationValidationSchema = z.object({
  tournamentId: z.number().positive(),
  judgeId: z.number().positive(),
});
