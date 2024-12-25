import { Router } from "express";

import * as tournamentTeamControllers from "./tournamentTeams.controller";
import roleMiddleware from "../../../middleware/role.middleware";

const tournamentTeamsRoutes = Router();

tournamentTeamsRoutes.get("/", tournamentTeamControllers.getTournamentTeams);

tournamentTeamsRoutes.get(
  "/:id",
  tournamentTeamControllers.getTournamentTeamById
);

tournamentTeamsRoutes.post(
  "/:id/approve",
  roleMiddleware(["USER"]),
  tournamentTeamControllers.approveTournamentTeam
);

export default tournamentTeamsRoutes;
