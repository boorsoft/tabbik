DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('RUNNING', 'PENDING', 'FINISHED', 'CANCELED', 'HIDDEN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_judge_invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournamentId" integer,
	"judgeId" integer,
	"status" "status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "startDate" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ADD COLUMN "status" "status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament_team" ADD COLUMN "status" "status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_tournament_team_invitation" ADD COLUMN "status" "status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
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
ALTER TABLE "tournament" DROP COLUMN IF EXISTS "isRunning";--> statement-breakpoint
ALTER TABLE "tournament_team" DROP COLUMN IF EXISTS "isApproved";--> statement-breakpoint
ALTER TABLE "user_tournament_team_invitation" DROP COLUMN IF EXISTS "isAccepted";