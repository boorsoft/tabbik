import { NextFunction, Request, Response } from "express";

import * as teamInvitationService from "./teamInvitations.service";
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

    return res.success(invitation);
  } catch (e) {
    next(e);
  }
};
