DO $$ BEGIN
 CREATE TYPE "public"."roundStatus" AS ENUM('PENDING', 'IN_PROGRESS', 'FEEDBACKING', 'FINISHED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "tournamentStatus" ADD VALUE 'IN_PROGRESS';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motion" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tournament" DROP CONSTRAINT "tournament_ownerId_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "resolutionIdx";--> statement-breakpoint
ALTER TABLE "tournament_round" ADD COLUMN "motionId" integer;--> statement-breakpoint
ALTER TABLE "tournament_round" ADD COLUMN "status" "roundStatus" DEFAULT 'PENDING';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament" ADD CONSTRAINT "tournament_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "resolutionIdx" ON "tournament_round" USING btree ("motionId");--> statement-breakpoint
ALTER TABLE "tournament_round" DROP COLUMN IF EXISTS "resolution";--> statement-breakpoint
ALTER TABLE "tournament_round" DROP COLUMN IF EXISTS "isClosed";