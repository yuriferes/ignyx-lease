import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants, users } from './identity';

export const franchiseeStatusEnum = pgEnum('franchisee_status', ['active', 'inactive']);

/**
 * franchisees — registro de negócio do franqueado.
 * Espelha um user (role=franqueado) com dados específicos da rede:
 * região de cobertura (CEP base) e comissão.
 */
export const franchisees = pgTable(
  'franchisees',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    homeRegionCep: text('home_region_cep'),
    commissionPct: numeric('commission_pct', { precision: 5, scale: 4 })
      .default('0.0900')
      .notNull(),
    status: franchiseeStatusEnum('status').default('active').notNull(),
    activatedAt: timestamp('activated_at', { withTimezone: true }).defaultNow().notNull(),
    deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    tenantIdx: index('franchisees_tenant_idx').on(t.tenantId),
    userUq: uniqueIndex('franchisees_user_uq').on(t.userId),
    statusIdx: index('franchisees_status_idx').on(t.tenantId, t.status),
  }),
);

export const franchiseesRelations = relations(franchisees, ({ one }) => ({
  tenant: one(tenants, { fields: [franchisees.tenantId], references: [tenants.id] }),
  user: one(users, { fields: [franchisees.userId], references: [users.id] }),
}));

export type Franchisee = typeof franchisees.$inferSelect;
export type NewFranchisee = typeof franchisees.$inferInsert;
