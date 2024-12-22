import { NextFunction, Request, Response } from "express";

import * as tournamentService from "./tournaments.service";
import { ApiError } from "../../../utils/apiError";

export const getTournaments = async (req: Request, res: Response) => {
  const tournaments = await tournamentService.getTournaments();

  return res.status(200).json(tournaments);
};

export const getTournamentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const tournament = await tournamentService.getTournamentById(+id!);

  if (!tournament) {
    return next(new ApiError("Not found", 404));
  }

  return res.status(200).json(tournament);
};

export const createTournament = async (req: Request, res: Response) => {
  const newTournament = await tournamentService.createTournament({
    ...req.body,
    ownerId: req.user?.id,
  });

  return res.status(200).json(newTournament);
};

export const updateTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (req.user?.id !== parseInt(id)) {
    return next(
      new ApiError("You are not allowed to update this resource", 403)
    );
  }

  const updatedTournament = await tournamentService.updateTournament(
    +id!,
    req.body
  );

  return res.status(200).json(updatedTournament);
};

export const deleteTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (req.user?.id !== parseInt(id)) {
    return next(
      new ApiError("You are not allowed to delete this resource", 403)
    );
  }

  await tournamentService
    .deleteTournament(+id!)
    .catch((e) => next(new ApiError(e.message, 400)));

  return res.status(200).json({ message: "Deleted successfully" });
};
