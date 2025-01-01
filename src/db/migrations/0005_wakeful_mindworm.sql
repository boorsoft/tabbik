DO $$ BEGIN
 CREATE TYPE "public"."invitationStatus" AS ENUM('ACCEPTED', 'REJECTED', 'PENDING');
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
 CREATE TYPE "public"."tournamentStatus" AS ENUM('RUNNING', 'PENDING', 'FINISHED', 'CANCELED', 'HIDDEN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "status" SET DATA TYPE tournamentStatus;--> statement-breakpoint
ALTER TABLE "tournament_judge_invitation" ALTER COLUMN "status" SET DATA TYPE invitationStatus;--> statement-breakpoint
ALTER TABLE "tournament_team" ALTER COLUMN "status" SET DATA TYPE teamJoinRequestStatus;--> statement-breakpoint
ALTER TABLE "user_tournament_team_invitation" ALTER COLUMN "status" SET DATA TYPE invitationStatus;