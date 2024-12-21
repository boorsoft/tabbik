CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(40) NOT NULL,
	"email" varchar(200) NOT NULL,
	"password" varchar(256) NOT NULL,
	"avatar" varchar(256),
	"firstName" varchar(100),
	"lastName" varchar(100),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tournament" ALTER COLUMN "ownerId" SET DATA TYPE integer USING "ownerId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_judge" ALTER COLUMN "judgeId" SET DATA TYPE integer USING "judgeId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_judge_point" ALTER COLUMN "judgeId" SET DATA TYPE integer USING "judgeId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_room" ALTER COLUMN "judgeId" SET DATA TYPE integer USING "judgeId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_team" ALTER COLUMN "firstSpeakerId" SET DATA TYPE integer USING "firstSpeakerId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_team" ALTER COLUMN "secondSpeakerId" SET DATA TYPE integer USING "secondSpeakerId"::integer;--> statement-breakpoint
ALTER TABLE "tournament_user_speaker_point" ALTER COLUMN "userId" SET DATA TYPE integer USING "userId"::integer;--> statement-breakpoint
ALTER TABLE "user_tournament_team_invitation" ALTER COLUMN "inviterId" SET DATA TYPE integer USING "inviterId"::integer;--> statement-breakpoint
ALTER TABLE "user_tournament_team_invitation" ALTER COLUMN "receiverId" SET DATA TYPE integer USING "receiverId"::integer;--> statement-breakpoint
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
 ALTER TABLE "tournament_judge_point" ADD CONSTRAINT "tournament_judge_point_judgeId_user_id_fk" FOREIGN KEY ("judgeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "tournament_user_speaker_point" ADD CONSTRAINT "tournament_user_speaker_point_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
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
