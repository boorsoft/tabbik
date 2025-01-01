import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const tournamentRoomPosition = pgEnum("tournamentRoomPosition", [
  "OPENING_GOVERNMENT",
  "CLOSING_GOVERNMENT",
  "OPENING_OPPOSITION",
  "CLOSING_OPPOSITION",
]);

export const tournamentStatus = pgEnum("tournamentStatus", [
  "RUNNING",
  "PENDING",
  "FINISHED",
  "CANCELED",
  "HIDDEN",
]);

export const invitationStatus = pgEnum("invitationStatus", [
  "ACCEPTED",
  "REJECTED",
  "PENDING",
]);

export const teamJoinRequestStatus = pgEnum("teamJoinRequestStatus", [
  "APPROVED",
  "REJECTED",
  "PENDING",
]);

export const tournament = pgTable(
  "tournament",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).unique().notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 256 }),
    location: varchar("location", { length: 256 }).notNull(),
    ownerId: integer("ownerId")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    maxTeams: integer("maxTeams").notNull(),
    registrationFee: integer("registrationFee").notNull(),
    isActive: boolean("isActive").default(true),
    status: tournamentStatus("status").default("PENDING").notNull(),
    startDate: timestamp("startDate"),
    endDate: timestamp("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAT: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    titleIdx: index("tournamentTitleIdx").on(table.title),
  })
);

export const tournamentTeam = pgTable(
  "tournament_team",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).unique().notNull(),
    firstSpeakerId: integer("firstSpeakerId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    secondSpeakerId: integer("secondSpeakerId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    tournamentId: integer("tournamentId")
      .references(() => tournament.id, { onDelete: "cascade" })
      .notNull(),
    status: teamJoinRequestStatus("status").default("PENDING").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAT: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({ titleIdx: index("tournamentTeamTitleIdx").on(table.title) })
);

export const tournamentJudge = pgTable("tournament_judge", {
  id: serial("id").primaryKey(),
  judgeId: integer("judgeId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  tournamentId: integer("tournamentId")
    .references(() => tournament.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAT: timestamp("updatedAt").defaultNow(),
});

export const tournamentUserSpeakerPoint = pgTable(
  "tournament_user_speaker_point",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    tournamentId: integer("tournamentId")
      .references(() => tournament.id, {
        onDelete: "cascade",
      })
      .notNull(),
    speakerPoints: integer("speakerPoints").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAT: timestamp("updatedAt").defaultNow(),
  }
);

export const tournamentJudgePoint = pgTable("tournament_judge_point", {
  id: serial("id").primaryKey(),
  judgeId: integer("judgeId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  tournamentId: integer("tournamentId")
    .references(() => tournament.id, {
      onDelete: "cascade",
    })
    .notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAT: timestamp("updatedAt").defaultNow(),
});

export const tournamentRound = pgTable(
  "tournament_round",
  {
    id: serial("id").primaryKey(),
    round: integer("round").notNull(),
    resolution: text("resolution").notNull(),
    isClosed: boolean("isClosed").default(false),
    tournamentId: integer("tournamentId")
      .references(() => tournament.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAT: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({ resolutionIdx: index("resolutionIdx").on(table.resolution) })
);

export const tournamentRoundPoint = pgTable("tournament_round_point", {
  id: serial("id").primaryKey(),
  roundId: integer("roundId")
    .references(() => tournamentRound.id, {
      onDelete: "cascade",
    })
    .notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAT: timestamp("updatedAt").defaultNow(),
});

export const tournamentRoom = pgTable("tournament_room", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournamentId")
    .references(() => tournament.id, {
      onDelete: "cascade",
    })
    .notNull(),
  judgeId: integer("judgeId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  room: integer("room"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAT: timestamp("updatedAt").defaultNow(),
});

export const tournamentRoomTeam = pgTable("tournament_room_team", {
  id: serial("id").primaryKey(),
  teamId: integer("teamId")
    .references(() => tournamentTeam.id, {
      onDelete: "cascade",
    })
    .notNull(),
  roomId: integer("roomId")
    .references(() => tournamentRoom.id, { onDelete: "cascade" })
    .notNull(),
  position: tournamentRoomPosition("tournamentRoomPosition"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAT: timestamp("updatedAt").defaultNow(),
});

export const tournamentJudgeInvitation = pgTable(
  "tournament_judge_invitation",
  {
    id: serial("id").primaryKey(),
    tournamentId: integer("tournamentId")
      .references(() => tournament.id, {
        onDelete: "cascade",
      })
      .notNull(),
    judgeId: integer("judgeId")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    status: invitationStatus("status").default("PENDING").notNull(),
  }
);

export const userTournamentTeamInvitation = pgTable(
  "user_tournament_team_invitation",
  {
    id: serial("id").primaryKey(),
    inviterId: integer("inviterId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: integer("receiverId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    tournamentId: integer("tournamentId")
      .references(() => tournament.id)
      .notNull(),
    teamTitle: varchar("teamTitle", { length: 130 }).notNull(),
    status: invitationStatus("status").default("PENDING").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAT: timestamp("updatedAt").defaultNow(),
  }
);

// Relations

export const tournamentRelations = relations(tournament, ({ many, one }) => ({
  teams: many(tournamentTeam),
  judges: many(tournamentJudge),
  userSpeakerPoints: many(tournamentUserSpeakerPoint),
  judgePoints: many(tournamentJudgePoint),
  rounds: many(tournamentRound),
  rooms: many(tournamentRoom),
  owner: one(user, { fields: [tournament.ownerId], references: [user.id] }),
}));

export const tournamentTeamRelations = relations(tournamentTeam, ({ one }) => ({
  tournament: one(tournament, {
    fields: [tournamentTeam.tournamentId],
    references: [tournament.id],
  }),
  firstSpeaker: one(user, {
    fields: [tournamentTeam.firstSpeakerId],
    references: [user.id],
  }),
  secondSpeaker: one(user, {
    fields: [tournamentTeam.secondSpeakerId],
    references: [user.id],
  }),
}));

export const tournamentJudgeRelations = relations(
  tournamentJudge,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [tournamentJudge.tournamentId],
      references: [tournament.id],
    }),
    judge: one(user, {
      fields: [tournamentJudge.judgeId],
      references: [user.id],
    }),
  })
);

export const tournamentUserSpeakerPointRelations = relations(
  tournamentUserSpeakerPoint,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [tournamentUserSpeakerPoint.tournamentId],
      references: [tournament.id],
    }),
    user: one(user, {
      fields: [tournamentUserSpeakerPoint.userId],
      references: [user.id],
    }),
  })
);

export const tournamentJudgePointRelations = relations(
  tournamentJudgePoint,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [tournamentJudgePoint.tournamentId],
      references: [tournament.id],
    }),
    judge: one(user, {
      fields: [tournamentJudgePoint.judgeId],
      references: [user.id],
    }),
  })
);

export const tournamentRoundRelations = relations(
  tournamentRound,
  ({ one, many }) => ({
    tournament: one(tournament, {
      fields: [tournamentRound.tournamentId],
      references: [tournament.id],
    }),
    roundPoints: many(tournamentRoundPoint),
  })
);

export const tournamentRoundPointRelations = relations(
  tournamentRoundPoint,
  ({ one }) => ({
    round: one(tournamentRound, {
      fields: [tournamentRoundPoint.roundId],
      references: [tournamentRound.id],
    }),
  })
);

export const tournamentRoomRelations = relations(
  tournamentRoom,
  ({ one, many }) => ({
    tournament: one(tournament, {
      fields: [tournamentRoom.tournamentId],
      references: [tournament.id],
    }),
    roomTeams: many(tournamentRoomTeam),
    judge: one(user, {
      fields: [tournamentRoom.judgeId],
      references: [user.id],
    }),
  })
);

export const tournamentRoomTeamRelations = relations(
  tournamentRoomTeam,
  ({ one }) => ({
    team: one(tournamentTeam, {
      fields: [tournamentRoomTeam.teamId],
      references: [tournamentTeam.id],
    }),
    room: one(tournamentRoom, {
      fields: [tournamentRoomTeam.roomId],
      references: [tournamentRoom.id],
    }),
  })
);

export const userTournamentTeamInvitationRelations = relations(
  userTournamentTeamInvitation,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [userTournamentTeamInvitation.tournamentId],
      references: [tournament.id],
    }),
    inviter: one(user, {
      fields: [userTournamentTeamInvitation.inviterId],
      references: [user.id],
    }),
    receiver: one(user, {
      fields: [userTournamentTeamInvitation.receiverId],
      references: [user.id],
    }),
  })
);

export const tournamentJudgeInvitationRelations = relations(
  tournamentJudgeInvitation,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [tournamentJudgeInvitation.tournamentId],
      references: [tournament.id],
    }),
    judge: one(user, {
      fields: [tournamentJudgeInvitation.judgeId],
      references: [user.id],
    }),
  })
);
