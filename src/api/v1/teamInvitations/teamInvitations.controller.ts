import { NextFunction, Request, Response } from "express";

import * as teamInvitationService from "./teamInvitations.service";
import { ApiError } from "../../../utils/apiError";

export const inviteUserToTournament = async (req: Request, res: Response) => {
  const teamInvitation = await teamInvitationService.inviteUserToTournament({
    ...req.body,
    inviterId: req.user?.id,
  });

  return res.success(teamInvitation);
};

export const getUserTeamInvitations = async (req: Request, res: Response) => {
  const teamInvitations = await teamInvitationService.getUserTeamInvitations();

  return res.success(teamInvitations);
};

export const acceptTeamInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const currentInvitation = await teamInvitationService.getTeamInvitationById(
    +id!
  );

  if (req.user?.id !== currentInvitation?.receiverId) {
    next(new ApiError("You are not allowed to accept this invitation", 403));
  }

  const invitation = await teamInvitationService.acceptInvitation(+id!);

  return res.success(invitation);
};
