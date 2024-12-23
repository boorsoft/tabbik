DO $$ BEGIN
 CREATE TYPE "public"."tournamentRoomPosition" AS ENUM('OPENING_GOVERNMENT', 'CLOSING_GOVERNMENT', 'OPENING_OPPOSITION', 'CLOSING_OPPOSITION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('ADMIN', 'USER', 'MODERATOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(256),
	"location" varchar(256) NOT NULL,
	"ownerId" integer NOT NULL,
	"maxTeams" integer NOT NULL,
	"registrationFee" integer NOT NULL,
	"isActive" boolean DEFAULT true,
	"isRunning" boolean DEFAULT false,
	"startDate" timestamp DEFAULT now(),
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "tournament_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_judge" (
	"id" serial PRIMARY KEY NOT NULL,
	"judgeId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_judge_point" (
	"id" serial PRIMARY KEY NOT NULL,
	"judgeId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"points" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_room" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournamentId" integer NOT NULL,
	"judgeId" integer NOT NULL,
	"room" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_room_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"roomId" integer NOT NULL,
	"tournamentRoomPosition" "tournamentRoomPosition",
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_round" (
	"id" serial PRIMARY KEY NOT NULL,
	"round" integer NOT NULL,
	"resolution" text NOT NULL,
	"isClosed" boolean DEFAULT false,
	"tournamentId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_round_point" (
	"id" serial PRIMARY KEY NOT NULL,
	"roundId" integer NOT NULL,
	"points" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160),
	"firstSpeakerId" integer NOT NULL,
	"secondSpeakerId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_user_speaker_point" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"speakerPoints" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tournament_team_invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"inviterId" integer NOT NULL,
	"receiverId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"teamTitle" varchar(130) NOT NULL,
	"isAccepted" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(40) NOT NULL,
	"email" varchar(200) NOT NULL,
	"password" varchar(256) NOT NULL,
	"avatar" varchar(256),
	"firstName" varchar(100),
	"lastName" varchar(100),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament" ADD CONSTRAINT "tournament_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_judge" ADD CONSTRAINT "tournament_judge_judgeId_user_id_fk" FOREIGN KEY ("judgeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_judge" ADD CONSTRAINT "tournament_judge_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_judge_point" ADD CONSTRAINT "tournament_judge_point_judgeId_user_id_fk" FOREIGN KEY ("judgeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_judge_point" ADD CONSTRAINT "tournament_judge_point_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_room" ADD CONSTRAINT "tournament_room_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_room" ADD CONSTRAINT "tournament_room_judgeId_user_id_fk" FOREIGN KEY ("judgeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_room_team" ADD CONSTRAINT "tournament_room_team_teamId_tournament_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."tournament_team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_room_team" ADD CONSTRAINT "tournament_room_team_roomId_tournament_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."tournament_room"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_round" ADD CONSTRAINT "tournament_round_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_round_point" ADD CONSTRAINT "tournament_round_point_roundId_tournament_round_id_fk" FOREIGN KEY ("roundId") REFERENCES "public"."tournament_round"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_team" ADD CONSTRAINT "tournament_team_firstSpeakerId_user_id_fk" FOREIGN KEY ("firstSpeakerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_team" ADD CONSTRAINT "tournament_team_secondSpeakerId_user_id_fk" FOREIGN KEY ("secondSpeakerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_team" ADD CONSTRAINT "tournament_team_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_user_speaker_point" ADD CONSTRAINT "tournament_user_speaker_point_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_user_speaker_point" ADD CONSTRAINT "tournament_user_speaker_point_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tournament_team_invitation" ADD CONSTRAINT "user_tournament_team_invitation_inviterId_user_id_fk" FOREIGN KEY ("inviterId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tournament_team_invitation" ADD CONSTRAINT "user_tournament_team_invitation_receiverId_user_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tournament_team_invitation" ADD CONSTRAINT "user_tournament_team_invitation_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tournamentTitleIdx" ON "tournament" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resolutionIdx" ON "tournament_round" USING btree ("resolution");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tournamentTeamTitleIdx" ON "tournament_team" USING btree ("title");