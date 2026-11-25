CREATE TABLE "submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_kind_check" CHECK ("kind" in ('review', 'feedback', 'suggestion', 'complaint'))
);
--> statement-breakpoint
CREATE INDEX "submissions_public_feed_idx" ON "submissions" ("kind","approved","created_at");