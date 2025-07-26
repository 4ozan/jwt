import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar({ length: 255 }).notNull().unique(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
