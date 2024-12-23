import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import { createTournamentSchema } from "./validationSchema";

import * as tournamentsController from "./tournaments.controller";
import validateQuery from "../../../middleware/queryValidation.middleware";
import paginationValidationSchema from "../../../common/paginationValidationSchema";
import roleMiddleware from "../../../middleware/role.middleware";

const tournaments = Router();

tournaments.get(
  "/",
  roleMiddleware(),
  validateQuery(paginationValidationSchema),
  tournamentsController.getTournaments
);

tournaments.get(
  "/:id",
  roleMiddleware(),
  tournamentsController.getTournamentDetails
);

tournaments.post(
  "/",
  roleMiddleware(),
  validateData(createTournamentSchema),
  tournamentsController.createTournament
);

tournaments.patch(
  "/:id",
  roleMiddleware(),
  validateData(createTournamentSchema),
  tournamentsController.updateTournament
);

tournaments.delete(
  "/:id",
  roleMiddleware(),
  tournamentsController.deleteTournament
);

export default tournaments;
