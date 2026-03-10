import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tokens = sqliteTable("tokens", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  label: text("label").notNull(), // e.g., "AWS Production"
  encryptedSecret: text("encrypted_secret").notNull(),
  algorithm: text("algorithm").notNull().default("sha1"),
  digits: integer("digits").notNull().default(6),
  period: integer("period").notNull().default(30),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  userId: text("user_id"), // Optional for now
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  role: text("role").notNull().default("member"), // 'admin' | 'member'
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const memberTokens = sqliteTable("member_tokens", {
  memberId: text("member_id")
    .notNull()
    .references(() => members.id),
  tokenId: text("token_id")
    .notNull()
    .references(() => tokens.id),
});
