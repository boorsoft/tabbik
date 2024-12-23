import { eq } from "drizzle-orm";
import { db } from "../../../db/db";
import { userTournamentTeamInvitation } from "../../../db/schema/tournament";
import { UserTournamentTeamInvitation } from "./types";

export async function inviteUserToTournament(
  invitationData: UserTournamentTeamInvitation
) {
  return db
    .insert(userTournamentTeamInvitation)
    .values(invitationData)
    .returning();
}

export async function getTeamInvitationById(id: number) {
  return db.query.userTournamentTeamInvitation.findFirst({
    where: eq(userTournamentTeamInvitation.id, id),
  });
}

export async function getUserTeamInvitations(userId: number) {
  return db.query.userTournamentTeamInvitation.findMany({
    where: eq(userTournamentTeamInvitation.receiverId, userId),
    with: {
      tournament: { columns: { id: true, title: true, startDate: true } },
    },
  });
}

export async function acceptInvitation(invitationId: number) {
  return db
    .update(userTournamentTeamInvitation)
    .set({ isAccepted: true })
    .where(eq(userTournamentTeamInvitation.id, invitationId))
    .returning();
}
