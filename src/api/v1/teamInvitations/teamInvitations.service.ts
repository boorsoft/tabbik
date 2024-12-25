import { eq, or } from "drizzle-orm";
import { db } from "../../../db/db";
import { userTournamentTeamInvitation } from "../../../db/schema/tournament";
import { UserTournamentTeamInvitation } from "./types";
import { ApiError } from "../../../utils/apiError";

import * as tournamentTeamService from "../tournamentTeams/tournamentTeams.service";

export async function inviteUserToTournament(
  invitationData: UserTournamentTeamInvitation
) {
  const invitations = await db.query.userTournamentTeamInvitation.findFirst({
    where: or(
      eq(userTournamentTeamInvitation.inviterId, invitationData.inviterId),
      eq(userTournamentTeamInvitation.receiverId, invitationData.receiverId)
    ),
  });

  if (invitations) {
    throw new ApiError(
      "You already have invited or have an invitation from this user",
      400
    );
  }

  const data = await db
    .insert(userTournamentTeamInvitation)
    .values(invitationData)
    .returning();

  return data[0];
}

export async function getTeamInvitationById(id: number) {
  return db.query.userTournamentTeamInvitation.findFirst({
    where: eq(userTournamentTeamInvitation.id, id),
  });
}

export async function getUserTeamInvitations(userId: number) {
  return db.query.userTournamentTeamInvitation.findMany({
    where: or(
      eq(userTournamentTeamInvitation.receiverId, userId),
      eq(userTournamentTeamInvitation.inviterId, userId)
    ),
    with: {
      inviter: {
        columns: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      receiver: {
        columns: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      tournament: { columns: { id: true, title: true, startDate: true } },
    },
  });
}

export async function acceptInvitation(invitationId: number) {
  const currentInvitation = await getTeamInvitationById(invitationId);

  if (!currentInvitation) throw new ApiError("Invitation not found", 404);

  const existingTeams = await tournamentTeamService.getTournamentTeams(
    currentInvitation.tournamentId
  );

  if (
    existingTeams.some((team) => team.title === currentInvitation.teamTitle)
  ) {
    throw new ApiError("Team already exists", 400);
  }

  const data = await db
    .update(userTournamentTeamInvitation)
    .set({ isAccepted: true })
    .where(eq(userTournamentTeamInvitation.id, invitationId))
    .returning();

  const team = await tournamentTeamService.createTournamentTeam({
    tournamentId: currentInvitation.tournamentId,
    firstSpeakerId: currentInvitation.inviterId,
    secondSpeakerId: currentInvitation.receiverId,
    title: currentInvitation.teamTitle,
  });

  return { invitation: data[0], team };
}

export async function cancelOrRejectInvitation(invitationId: number) {
  return db
    .delete(userTournamentTeamInvitation)
    .where(eq(userTournamentTeamInvitation.id, invitationId));
}
