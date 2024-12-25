import { Router } from "express";

import * as tournamentTeamControllers from "./tournamentTeams.controller";
import roleMiddleware from "../../../middleware/role.middleware";

const tournamentTeams = Router();

tournamentTeams.get(
  "/tournament-teams",
  tournamentTeamControllers.getTournamentTeams
);

tournamentTeams.get(
  "/tournament-teams/:id",
  tournamentTeamControllers.getTournamentTeamById
);

tournamentTeams.post(
  "/tournament-teams/:id/approve",
  roleMiddleware(["USER"]),
  tournamentTeamControllers.approveTournamentTeam
);
