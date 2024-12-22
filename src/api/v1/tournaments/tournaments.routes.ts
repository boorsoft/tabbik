import { Router } from "express";
import { validateData } from "../../../middleware/validation.middleware";
import { createTournamentSchema } from "./validationSchema";

import * as tournamentsController from "./tournaments.controller";

const tournaments = Router();

tournaments.get("/", tournamentsController.getTournaments);

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
