ALTER TABLE "tournament_team" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isNovice" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament_team" ADD CONSTRAINT "tournament_team_title_unique" UNIQUE("title");