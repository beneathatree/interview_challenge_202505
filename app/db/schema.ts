import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { pgTable, serial, text, timestamp, integer , boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle instance
export const db = drizzle(pool);

/**
 * Users table schema
 * Note: Password is stored in plain text as per requirements
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Notes table schema
 */
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  hasFavourite: boolean("has_favourite").default(false).notNull(),
});

/**
 * Relations configuration
 */
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

/**
 * TypeScript types for our models
 */
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;

// Configure Drizzle with prepared queries
export const queries = {
  users: {
    findByEmail: (email: string) =>
      db
        .select()
        .from(users)
        .where(sql`${users.email} = ${email}`)
        .limit(1),
    findById: (id: number) =>
      db
        .select()
        .from(users)
        .where(sql`${users.id} = ${id}`)
        .limit(1),
  },
  notes: {
    findByUserId: (userId: number) =>
      db
        .select()
        .from(notes)
        .where(sql`${notes.userId} = ${userId}`),
  },
};
