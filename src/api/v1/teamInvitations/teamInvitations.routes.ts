import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import { inviteUserToTournamentSchema } from "./validationSchema";

import * as teamInvitationController from "./teamInvitations.controller";
import roleMiddleware from "../../../middleware/role.middleware";

const teamInvitations = Router();

teamInvitations.post(
  "/invite_user",
  roleMiddleware(["USER"]),
  validateData(inviteUserToTournamentSchema),
  teamInvitationController.inviteUserToTournament
);

teamInvitations.get(
  "/",
  roleMiddleware(["USER"]),
  teamInvitationController.getUserTeamInvitations
);

teamInvitations.post(
  "/:id/accept",
  roleMiddleware(["USER"]),
  teamInvitationController.acceptTeamInvitation
);

teamInvitations.delete(
  "/:id/cancel",
  roleMiddleware(["USER"]),
  teamInvitationController.cancelTeamInvitation
);

teamInvitations.post(
  "/:id/reject",
  roleMiddleware(["USER"]),
  teamInvitationController.rejectTeamInvitation
);

export default teamInvitations;
