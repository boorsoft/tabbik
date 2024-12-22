import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import { inviteUserToTournamentSchema } from "./validationSchema";

import * as teamInvitationController from "./teamInvitations.controller";

const teamInvitations = Router();

teamInvitations.post(
  "/invite_user",
  validateData(inviteUserToTournamentSchema),
  teamInvitationController.inviteUserToTournament
);

teamInvitations.get("/", teamInvitationController.getUserTeamInvitations);

teamInvitations.post(
  "/:id/accept",
  teamInvitationController.acceptTeamInvitation
);

export default teamInvitations;
