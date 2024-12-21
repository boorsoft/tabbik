import { NextFunction, Request, Response, Router } from "express";
import {
  createTournament,
  deleteTournament,
  getTournamentById,
  getTournaments,
  updateTournament,
} from "./tournaments.service";
import { validateData } from "../../../middleware/validation.middleware";
import { createTournamentSchema } from "./validationSchema";
import { ApiError } from "../../../utils/apiError";

const tournaments = Router();

tournaments.get("/", async (req: Request, res: Response) => {
  const tournaments = await getTournaments();

  return res.status(200).json(tournaments);
});

tournaments.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tournament = await getTournamentById(+id!);

    if (!tournament) {
      return next(new ApiError("Not found", 404));
    }

    return res.status(200).json(tournament);
  }
);

tournaments.post(
  "/",
  validateData(createTournamentSchema),
  async (req: Request, res: Response) => {
    const newTournament = await createTournament({
      ...req.body,
      ownerId: req.user?.id,
    });

    return res.status(200).json(newTournament);
  }
);

tournaments.patch(
  "/:id",
  validateData(createTournamentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (req.user?.id !== parseInt(id)) {
      return next(
        new ApiError("You are not allowed to update this resource", 403)
      );
    }

    const updatedTournament = await updateTournament(+id!, req.body);

    return res.status(200).json(updatedTournament);
  }
);

tournaments.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (req.user?.id !== parseInt(id)) {
      return next(
        new ApiError("You are not allowed to delete this resource", 403)
      );
    }

    await deleteTournament(+id!).catch((e) =>
      next(new ApiError(e.message, 400))
    );

    return res.status(200).json({ message: "Deleted successfully" });
  }
);

export default tournaments;
