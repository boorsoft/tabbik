DO $$ BEGIN
 CREATE TYPE "public"."invitationStatus" AS ENUM('ACCEPTED', 'REJECTED', 'PENDING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."roundStatus" AS ENUM('PENDING', 'IN_PROGRESS', 'FEEDBACKING', 'FINISHED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."teamJoinRequestStatus" AS ENUM('APPROVED', 'REJECTED', 'PENDING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tournamentRoomPosition" AS ENUM('OPENING_GOVERNMENT', 'CLOSING_GOVERNMENT', 'OPENING_OPPOSITION', 'CLOSING_OPPOSITION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tournamentStatus" AS ENUM('IN_PROGRESS', 'PENDING', 'FINISHED', 'CANCELED', 'HIDDEN');
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
CREATE TABLE IF NOT EXISTS "motion" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" varchar(256) NOT NULL,
	"data" json,
	"type" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notificationRecipient" (
	"id" serial PRIMARY KEY NOT NULL,
	"notificationId" integer,
	"roomId" varchar(255),
	"isViewed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
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
	"status" "tournamentStatus" DEFAULT 'PENDING' NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "tournament_judge_invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournamentId" integer NOT NULL,
	"judgeId" integer NOT NULL,
	"status" "invitationStatus" DEFAULT 'PENDING' NOT NULL
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
	"motionId" integer,
	"status" "roundStatus" DEFAULT 'PENDING',
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
	"title" varchar(160) NOT NULL,
	"firstSpeakerId" integer NOT NULL,
	"secondSpeakerId" integer NOT NULL,
	"tournamentId" integer NOT NULL,
	"status" "teamJoinRequestStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "tournament_team_title_unique" UNIQUE("title")
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
	"status" "invitationStatus" DEFAULT 'PENDING' NOT NULL,
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
	"isNovice" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notificationRecipient" ADD CONSTRAINT "notificationRecipient_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament" ADD CONSTRAINT "tournament_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "tournament_judge_invitation" ADD CONSTRAINT "tournament_judge_invitation_tournamentId_tournament_id_fk" FOREIGN KEY ("tournamentId") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_judge_invitation" ADD CONSTRAINT "tournament_judge_invitation_judgeId_user_id_fk" FOREIGN KEY ("judgeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "tournament_round" ADD CONSTRAINT "tournament_round_motionId_motion_id_fk" FOREIGN KEY ("motionId") REFERENCES "public"."motion"("id") ON DELETE no action ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "resolutionIdx" ON "tournament_round" USING btree ("motionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tournamentTeamTitleIdx" ON "tournament_team" USING btree ("title");