CREATE TABLE "galleries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"featured_order" integer DEFAULT 0 NOT NULL,
	"landing_image" jsonb NOT NULL,
	"images" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "galleries_slug_unique" UNIQUE("slug")
);
