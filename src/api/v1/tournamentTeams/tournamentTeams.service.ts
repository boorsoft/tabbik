import { eq } from "drizzle-orm";
import { db } from "../../../db/db";
import { tournamentTeam } from "../../../db/schema/tournament";
import { TournamentTeam } from "./types";
import { ApiError } from "../../../utils/apiError";

import * as tournamentService from "../tournaments/tournaments.service";
import { checkOwnership } from "../../../utils/ownership";

import * as notifcationService from "../../../services/notification.service";
import { NotificationType } from "../../../types/notification";

export async function getTournamentTeams(tournamentId?: number) {
  if (tournamentId) {
    return db.query.tournamentTeam.findMany({
      where: eq(tournamentTeam.tournamentId, tournamentId),
    });
  }

  return db.query.tournamentTeam.findMany();
}

export async function getTournamentTeamById(id: number) {
  return db.query.tournamentTeam.findFirst({
    where: eq(tournamentTeam.id, id),
  });
}

export async function createTournamentTeam(data: TournamentTeam) {
  const newTeam = await db.insert(tournamentTeam).values(data).returning();

  return newTeam[0];
}

export async function approveTournamentTeam(id: number, userId: number) {
  const currentTeam = await getTournamentTeamById(id);

  if (currentTeam) {
    if (currentTeam.isApproved) {
      throw new ApiError("The team is already approved!", 400);
    }

    const tournament = await tournamentService.getTournamentById(
      currentTeam.tournamentId
    );

    checkOwnership(userId, tournament.ownerId);

    const approvedTeam = await db
      .update(tournamentTeam)
      .set({ isApproved: true })
      .where(eq(tournamentTeam.id, id))
      .returning();

    const teamMembers = [
      approvedTeam[0].firstSpeakerId,
      approvedTeam[0].secondSpeakerId,
    ];

    teamMembers.forEach((member) => {
      notifcationService.sendNotificationToUser(
        {
          message: `Your team ${approvedTeam[0].title} is approved`,
          type: NotificationType.TOURNAMENT_TEAM_APPROVE,
        },
        member.toString()
      );
    });

    return approvedTeam[0];
  }

  throw new ApiError("Team not found", 404);
}
