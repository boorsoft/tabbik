import { eq } from "drizzle-orm";
import { tournament } from "../../../db/schema/tournament";
import { Tournament } from "./types";
import { db } from "../../../db/db";
import { DEFAULT_PAGE_SIZE } from "../../../constants/common";
import { tournamentFilterSchema } from "./validationSchema";

export async function getTournaments(
  page: number = 1,
  size: number = DEFAULT_PAGE_SIZE,
  filters?: typeof tournamentFilterSchema
) {
  return db
    .select()
    .from(tournament)
    .limit(size)
    .offset((page - 1) * size);
}

export async function getTournamentById(id: number) {
  const data = await db.query.tournament.findFirst({
    where: eq(tournament.id, id),
    with: {
      judges: true,
      teams: true,
    },
  });

  return data?.[0] as Tournament;
}

export async function createTournament(data: Tournament) {
  const newTournament = await db.insert(tournament).values(data).returning();

  return newTournament[0];
}

export async function updateTournament(id: number, data: Partial<Tournament>) {
  const updatedTournament = await db
    .update(tournament)
    .set(data)
    .where(eq(tournament.id, id))
    .returning();

  return updatedTournament[0];
}

export async function deleteTournament(id: number) {
  return db.delete(tournament).where(eq(tournament.id, id));
}
