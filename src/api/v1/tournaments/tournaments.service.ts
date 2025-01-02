import { count, desc, eq } from "drizzle-orm";
import { tournament, tournamentJudge } from "../../../db/schema/tournament";
import { Tournament } from "./types";
import { db } from "../../../db/db";
import { DEFAULT_PAGE_SIZE } from "../../../constants/common";
import { tournamentFilterSchema } from "./validationSchema";
import paginate from "@/common/utils/pagination";
import { IPaginationMetadata } from "@/common/types/response";

export async function getTournaments(
  page: number = 1,
  size: number = DEFAULT_PAGE_SIZE,
  filters?: typeof tournamentFilterSchema
) {
  const { offset, limit } = paginate({ page, size });

  const tournaments = await db
    .select()
    .from(tournament)
    .orderBy(desc(tournament.id))
    .limit(limit)
    .offset(offset);

  const totalTournaments = await db.select({ count: count() }).from(tournament);

  const totalData = totalTournaments[0].count;

  const paginationMetadata: IPaginationMetadata = {
    page,
    size,
    totalData,
    totalPages: Math.ceil(totalData / size),
  };

  return { tournaments, paginationMetadata };
}

export async function getTournamentById(id: number) {
  const data = await db.query.tournament.findFirst({
    where: eq(tournament.id, id),
    with: {
      judges: true,
      teams: true,
    },
  });

  return data;
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

export async function getTournamentJudges(tournamentId: number) {
  return db.query.tournamentJudge.findMany({
    where: eq(tournamentJudge.tournamentId, tournamentId),
  });
}
