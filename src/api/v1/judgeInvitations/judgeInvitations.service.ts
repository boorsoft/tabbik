import { ApiError } from "@/common/utils/apiError";
import { db } from "@/db/db";
import {
  tournamentJudgeInvitation,
  tournamentRound,
} from "@/db/schema/tournament";
import { RequestUser } from "@/db/schema/user";
import { and, eq } from "drizzle-orm";

import * as tournamentService from "@v1/tournaments/tournaments.service";
import { checkOwnership } from "@/common/utils/ownership";

export default class JudgeInvitationService {
  constructor() {}

  static init() {
    return new JudgeInvitationService();
  }

  async getInvitationById(id: number) {
    return db.query.tournamentJudgeInvitation.findFirst({
      where: eq(tournamentJudgeInvitation.id, id),
    });
  }

  async getUserInvitations(user: RequestUser) {
    return db.query.tournamentJudgeInvitation.findMany({
      where: eq(tournamentJudgeInvitation.judgeId, user.id),
      with: {
        tournament: true,
        judge: true,
      },
    });
  }

  async inviteToTournament(
    judgeId: number,
    tournamentId: number,
    user: RequestUser
  ) {
    const tournament = await tournamentService.getTournamentById(tournamentId);

    if (!tournament) {
      throw new ApiError("Tournament doesn't exist", 404);
    }

    if (tournament.ownerId !== user.id) {
      throw new ApiError(
        "You're not allowed to invite judges to this tournament",
        403
      );
    }

    const invitations = await db.query.tournamentJudgeInvitation.findFirst({
      where: and(
        eq(tournamentJudgeInvitation.judgeId, judgeId),
        eq(tournamentJudgeInvitation.tournamentId, tournamentId)
      ),
    });

    if (invitations) {
      throw new ApiError(
        "The judge is already invited to this tournament",
        400
      );
    }

    const data = await db
      .insert(tournamentJudgeInvitation)
      .values({
        judgeId,
        tournamentId,
        status: "PENDING",
      })
      .returning();

    return data[0];
  }

  async acceptInvitation(invitationId: number, user: RequestUser) {
    const invitation = await this.getInvitationById(invitationId);

    if (!invitation) throw new ApiError("Invitation not found", 404);

    if (invitation.judgeId !== user.id) {
      throw new ApiError("You are not allowed to perform this action", 403);
    }

    const data = await db
      .update(tournamentJudgeInvitation)
      .set({ status: "ACCEPTED" })
      .where(eq(tournamentJudgeInvitation.id, invitationId))
      .returning();

    return data[0];
  }

  async cancelInvitation(invitationId: number, user: RequestUser) {
    const invitation = await this.getInvitationById(invitationId);

    if (!invitation) {
      throw new ApiError("Invitation not found", 404);
    }

    const tournament = await tournamentService.getTournamentById(
      invitation.tournamentId
    );

    if (!tournament) throw new ApiError("Tournament doesn't exist", 404);

    checkOwnership(user.id, tournament.ownerId);

    return db
      .delete(tournamentJudgeInvitation)
      .where(eq(tournamentJudgeInvitation.id, invitationId));
  }

  async rejectInvitation(invitationId: number, user: RequestUser) {
    const invitation = await this.getInvitationById(invitationId);

    if (!invitation) {
      throw new ApiError("Invitation not found", 404);
    }

    checkOwnership(user.id, invitation.judgeId);

    const data = await db
      .update(tournamentJudgeInvitation)
      .set({ status: "REJECTED" })
      .where(eq(tournamentJudgeInvitation.id, invitationId))
      .returning();

    return data[0];
  }
}
