import { NextFunction, Request, Response } from "express";

import * as teamInvitationService from "./teamInvitations.service";
import * as tournamentTeamService from "../tournamentTeams/tournamentTeams.service";
import { ApiError } from "../../../utils/apiError";

export const inviteUserToTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamInvitation = await teamInvitationService.inviteUserToTournament({
      ...req.body,
      inviterId: req.user?.id,
    });

    return res.success(teamInvitation);
  } catch (e) {
    next(e);
  }
};

export const getUserTeamInvitations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    const teamInvitations = await teamInvitationService.getUserTeamInvitations(
      userId!
    );

    return res.success(teamInvitations);
  } catch (e) {
    next(e);
  }
};

export const acceptTeamInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const currentInvitation = await teamInvitationService.getTeamInvitationById(
      +id!
    );

    if (req.user?.id !== currentInvitation?.receiverId) {
      next(new ApiError("You are not allowed to accept this invitation", 403));
      return;
    }

    const invitation = await teamInvitationService.acceptInvitation(+id!);

    const team = await tournamentTeamService.createTournamentTeam({
      tournamentId: invitation.tournamentId,
      firstSpeakerId: invitation.inviterId,
      secondSpeakerId: invitation.receiverId,
      title: invitation.teamTitle,
    });

    return res.success({ invitation, team });
  } catch (e) {
    next(e);
  }
};

export const cancelTeamInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const currentUser = req.user;

  try {
    const currentInvitation = await teamInvitationService.getTeamInvitationById(
      +id!
    );

    if (currentUser?.id !== currentInvitation?.inviterId) {
      next(
        new ApiError(
          "You cannot cancel this team invitation since you're not who invited",
          400
        )
      );
      return;
    }

    await teamInvitationService.cancelOrRejectInvitation(+id!);

    return res.success(null, "Invitation cancelled successfully");
  } catch (e) {
    next(e);
  }
};

export const rejectTeamInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const currentUser = req.user;

  try {
    const currentInvitation = await teamInvitationService.getTeamInvitationById(
      +id!
    );

    if (currentUser?.id !== currentInvitation?.receiverId) {
      next(
        new ApiError(
          "You cannot reject this invitation since you're not the invitee",
          400
        )
      );
      return;
    }

    await teamInvitationService.cancelOrRejectInvitation(+id!);

    return res.success(null, "Invitation rejected successfully");
  } catch (e) {
    next(e);
  }
};
