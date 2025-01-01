import { eq, or } from "drizzle-orm";
import { db } from "@/db/db";
import { userTournamentTeamInvitation } from "@/db/schema/tournament";
import { UserTournamentTeamInvitation } from "./types";
import { ApiError } from "@/common/utils/apiError";

import * as tournamentService from "@/api/v1/tournaments/tournaments.service";
import * as tournamentTeamService from "@/api/v1/tournamentTeams/tournamentTeams.service";
import * as notificationService from "@/services/notification.service";
import { NotificationType } from "@/common/types/notification";
import { RequestUser } from "@/db/schema/user";

export async function inviteUserToTournament(
  invitationData: UserTournamentTeamInvitation,
  user: RequestUser
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

  const invitationTournament = await tournamentService.getTournamentById(
    invitationData.tournamentId
  );

  if (!invitationTournament) {
    throw new ApiError(
      "Tournament which the invite was sent to is not found",
      404
    );
  }

  notificationService.sendUserNotification(
    {
      message: `${user.username} invited you to join the team ${invitationData.teamTitle} in tournament ${invitationTournament.title}`,
      type: NotificationType.TOURNAMENT_TEAM_INVITE,
      data: { userId: user.id, tournamentId: invitationTournament.id },
    },
    invitationData.receiverId.toString()
  );

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
          isNovice: true,
        },
      },
      receiver: {
        columns: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
          isNovice: true,
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
    .set({ status: "ACCEPTED" })
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

export async function cancelTeamInvitation(invitationId: number) {
  return db
    .delete(userTournamentTeamInvitation)
    .where(eq(userTournamentTeamInvitation.id, invitationId));
}

export async function rejectTeamInvitation(invitationId: number) {
  const data = await db
    .update(userTournamentTeamInvitation)
    .set({ status: "REJECTED" })
    .where(eq(userTournamentTeamInvitation.id, invitationId));

  return data[0];
}
