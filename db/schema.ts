import { boolean, check, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const submissions = pgTable('submissions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  kind: text().notNull(),
  name: text().notNull(),
  message: text().notNull(),
  approved: boolean().default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check('submissions_kind_check', sql`${table.kind} in ('review', 'feedback', 'suggestion', 'complaint')`),
  index('submissions_public_feed_idx').on(table.kind, table.approved, table.createdAt),
]);
