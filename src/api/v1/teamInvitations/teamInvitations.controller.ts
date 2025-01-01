import { NextFunction, Request, Response } from "express";

import * as teamInvitationService from "./teamInvitations.service";
import { ApiError } from "@/common/utils/apiError";

export const inviteUserToTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;

  try {
    const teamInvitation = await teamInvitationService.inviteUserToTournament(
      {
        ...req.body,
        inviterId: req.user?.id,
      },
      req.user
    );

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
    if (!id) return next(new ApiError("Team invitation id not provided", 400));

    const currentInvitation = await teamInvitationService.getTeamInvitationById(
      +id
    );

    if (req.user?.id !== currentInvitation?.receiverId) {
      next(new ApiError("You are not allowed to accept this invitation", 403));
      return;
    }

    const { invitation, team } = await teamInvitationService.acceptInvitation(
      +id!
    );

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

    await teamInvitationService.cancelTeamInvitation(+id!);

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

    await teamInvitationService.rejectTeamInvitation(+id!);

    return res.success(null, "Invitation rejected successfully");
  } catch (e) {
    next(e);
  }
};
