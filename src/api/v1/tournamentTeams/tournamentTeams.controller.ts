import { NextFunction, Request, Response } from "express";
import * as tournamentTeamService from "./tournamentTeams.service";

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
