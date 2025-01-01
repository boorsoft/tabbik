import { NextFunction, Request, Response } from "express";
import JudgeInvitationService from "./judgeInvitations.service";
import { ApiError } from "@/common/utils/apiError";

export default class JudgeInvitationController {
  private judgeInvitationService: JudgeInvitationService;
  constructor(judgeInvitationService: JudgeInvitationService) {
    this.judgeInvitationService = judgeInvitationService;
  }

  static init(judgeInvitationService: JudgeInvitationService) {
    return new JudgeInvitationController(judgeInvitationService);
  }

  async getJudgeInvitations(req: Request, res: Response, next: NextFunction) {
    try {
      const invitations = await this.judgeInvitationService.getUserInvitations(
        req.user
      );

      return res.success(invitations);
    } catch (e) {
      next(e);
    }
  }

  async getInvitationById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const invitation = await this.judgeInvitationService.getInvitationById(
        +id
      );

      return res.success(invitation);
    } catch (e) {
      next(e);
    }
  }

  async inviteToTournament(req: Request, res: Response, next: NextFunction) {
    const { judgeId, tournamentId } = req.query;

    if (!judgeId || !tournamentId) {
      next(new ApiError("Judge ID or Tournament ID not provided", 400));
    }

    try {
      const invitation = await this.judgeInvitationService.inviteToTournament(
        +judgeId!,
        +tournamentId!,
        req.user
      );

      return res.success(invitation, "Invitation successful");
    } catch (e) {
      next(e);
    }
  }

  async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const invitation = await this.judgeInvitationService.acceptInvitation(
        +id,
        req.user
      );

      return res.success(invitation);
    } catch (e) {
      next(e);
    }
  }

  async cancelInvitation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const invitation = await this.judgeInvitationService.cancelInvitation(
        +id,
        req.user
      );

      return res.success(invitation);
    } catch (e) {
      next(e);
    }
  }

  async rejectInvitation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const invitation = await this.judgeInvitationService.rejectInvitation(
        +id,
        req.user
      );

      return res.success(invitation);
    } catch (e) {
      next(e);
    }
  }
}
