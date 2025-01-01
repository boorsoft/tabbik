import { Router } from "express";
import JudgeInvitationController from "./judegInvitations.controller";
import JudgeInvitationService from "./judgeInvitations.service";
import validateQuery from "@/middleware/queryValidation.middleware";
import { judgeInvitationValidationSchema } from "./validationSchema";
import roleMiddleware from "@/middleware/role.middleware";

const judgeInvitationsRouter = Router();

const judgeInvitationService = JudgeInvitationService.init();

const judgeInvitationController = JudgeInvitationController.init(
  judgeInvitationService
);

judgeInvitationsRouter.post(
  "/invite_judge",
  roleMiddleware(["USER"]),
  validateQuery(judgeInvitationValidationSchema),
  judgeInvitationController.inviteToTournament
);

judgeInvitationsRouter.post(
  "/:id/accept",
  roleMiddleware(["USER"]),
  judgeInvitationController.acceptInvitation
);

judgeInvitationsRouter.post(
  "/:id/reject",
  roleMiddleware(["USER"]),
  judgeInvitationController.rejectInvitation
);

judgeInvitationsRouter.post(
  "/:id/cancel",
  roleMiddleware(["USER"]),
  judgeInvitationController.cancelInvitation
);

judgeInvitationsRouter.get(
  "/:id",
  roleMiddleware(["USER"]),
  judgeInvitationController.getInvitationById
);

judgeInvitationsRouter.get(
  "/",
  roleMiddleware(["USER"]),
  judgeInvitationController.getJudgeInvitations
);
