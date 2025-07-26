import { pgTable, text, serial } from "drizzle-orm/pg-core"

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text("username").notNull(),
  fullName: text("full-name").notNull(),
  password: text("password").notNull(),
})
