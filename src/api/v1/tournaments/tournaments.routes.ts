import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import { createTournamentSchema } from "./validationSchema";

import * as tournamentsController from "./tournaments.controller";
import validateQuery from "../../../middleware/queryValidation.middleware";
import paginationValidationSchema from "../../../common/paginationValidationSchema";

const tournaments = Router();

tournaments.get(
  "/",
  validateQuery(paginationValidationSchema),
  tournamentsController.getTournaments
);

tournaments.get("/:id", tournamentsController.getTournamentDetails);

tournaments.post(
  "/",
  validateData(createTournamentSchema),
  tournamentsController.createTournament
);

tournaments.patch(
  "/:id",
  validateData(createTournamentSchema),
  tournamentsController.updateTournament
);

tournaments.delete("/:id", tournamentsController.deleteTournament);

export default tournaments;
