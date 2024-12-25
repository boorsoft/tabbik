import { NextFunction, Request, Response } from "express";
import * as tournamentTeamService from "./tournamentTeams.service";
import { ApiError } from "../../../utils/apiError";

export const createTournamentTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //     const newTeam = await tournamentTeamService.createTournamentTeam()
  // } catch (e) {
  //     next(e);
  // }
};

export const getTournamentTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tournamentId } = req.query;

  try {
    if (tournamentId) {
      const tournamentTeams = await tournamentTeamService.getTournamentTeams(
        +tournamentId
      );

      res.success(tournamentTeams);
      return;
    }

    const teams = await tournamentTeamService.getTournamentTeams();

    res.success(teams);
  } catch (e) {
    next(e);
  }
};

export const getTournamentTeamById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!id) return next(new ApiError("Tournament team id not provided", 400));

    const tournamentTeam = await tournamentTeamService.getTournamentTeamById(
      +id
    );

    return res.success(tournamentTeam);
  } catch (e) {
    next(e);
  }
};

export const approveTournamentTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!id) return next(new ApiError("Tournament team id not provided", 400));

    if (!req.user?.id)
      return next(new ApiError("Could not find current user", 404));

    const approvedTeam = await tournamentTeamService.approveTournamentTeam(
      +id!,
      req.user.id
    );

    return res.success(approvedTeam, "Team approved sucessfully!");
  } catch (e) {
    next(e);
  }
};
