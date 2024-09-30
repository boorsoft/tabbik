import { createInsertSchema } from "drizzle-zod";
import { userTournamentTeamInvitation } from "../../../db/schema/tournament";

export const inviteUserToTournamentSchema = createInsertSchema(
  userTournamentTeamInvitation
).omit({ isAccepted: true, inviterId: true });