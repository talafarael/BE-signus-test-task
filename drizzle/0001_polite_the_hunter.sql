ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full-name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";