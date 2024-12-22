import { NextFunction, Request, Response } from "express";

import * as tournamentService from "./tournaments.service";
import { ApiError } from "../../../utils/apiError";

export const getTournaments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tournaments = await tournamentService.getTournaments();

    return res.status(200).json(tournaments);
  } catch (e) {
    next(e);
  }
};

export const getTournamentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const tournament = await tournamentService.getTournamentById(+id!);

    if (!tournament) {
      return next(new ApiError("Not found", 404));
    }

    return res.success(tournament);
  } catch (e) {
    next(e);
  }
};

export const createTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTournament = await tournamentService.createTournament({
      ...req.body,
      ownerId: req.user?.id,
    });

    return res.success(newTournament);
  } catch (e) {
    next(e);
  }
};

export const updateTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (req.user?.id !== parseInt(id)) {
      return next(
        new ApiError("You are not allowed to update this resource", 403)
      );
    }

    const updatedTournament = await tournamentService.updateTournament(
      +id!,
      req.body
    );

    return res.success(updatedTournament);
  } catch (e) {
    next(e);
  }
};

export const deleteTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (req.user?.id !== parseInt(id)) {
      return next(
        new ApiError("You are not allowed to delete this resource", 403)
      );
    }

    await tournamentService
      .deleteTournament(+id!)
      .catch((e) => next(new ApiError(e.message, 400)));

    return res.success(null, "Tournament deleted successfully!");
  } catch (e) {
    next(e);
  }
};
