import { NextFunction, Request, Response } from "express";

import { ApiError } from "../../../common/utils/apiError";

import * as tournamentService from "./tournaments.service";

export const getTournaments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, size } = req.query;

  try {
    const { tournaments, paginationMetadata } =
      await tournamentService.getTournaments(
        page ? +page : undefined,
        size ? +size : undefined
      );

    return res.paginated(tournaments, paginationMetadata);
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
      return next(new ApiError("Tournament not found", 404));
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
    const existingTournament = await tournamentService.getTournamentById(+id);

    if (req.user?.id !== existingTournament?.ownerId) {
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
    const existingTournament = await tournamentService.getTournamentById(+id);

    if (req.user?.id !== existingTournament?.ownerId) {
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

export const getTournamentJudges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const judges = await tournamentService.getTournamentJudges(+id);

    return res.success(judges);
  } catch (e) {
    next(e);
  }
};
