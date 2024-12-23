import { tournamentTeam } from "../../../db/schema/tournament";

export type TournamentTeam = typeof tournamentTeam.$inferInsert;
