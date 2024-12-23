import { db } from "../../../db/db";
import { tournamentTeam } from "../../../db/schema/tournament";
import { TournamentTeam } from "./types";

export async function createTournamentTeam(data: TournamentTeam) {
  const newTeam = await db.insert(tournamentTeam).values(data).returning();

  return newTeam[0];
}
