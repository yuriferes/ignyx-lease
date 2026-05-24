import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);

export const roleEnum = pgEnum('role', [
  'franqueador',
  'franqueado',
  'representante',
  'tecnico_instalador',
  'fabrica',
  'cliente',
]);

// ============================================================================
// tenants — multi-tenant root. No MVP só "Maff".
// ============================================================================

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// users — espelha auth.users do Supabase via id (uuid).
// O Supabase Auth gerencia senha; aqui guardamos dados de negócio.
// ============================================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    email: text('email').notNull(),
    whatsappNumber: text('whatsapp_number'),
    fullName: text('full_name').notNull(),
    cpf: text('cpf'),
    profileImageUrl: text('profile_image_url'),
    status: userStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    tenantIdx: index('users_tenant_idx').on(t.tenantId),
    emailUq: uniqueIndex('users_tenant_email_uq').on(t.tenantId, t.email),
    whatsappUq: uniqueIndex('users_tenant_whatsapp_uq')
      .on(t.tenantId, t.whatsappNumber)
      .where(sql`${t.whatsappNumber} IS NOT NULL`),
  }),
);

// ============================================================================
// profiles — papel funcional do usuário, com hierarquia opcional.
// Um usuário pode (em tese) ter mais de um profile, mas no MVP é 1:1.
// ============================================================================

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull(),
    parentId: uuid('parent_id'),
    homeRegionCep: text('home_region_cep'),
    metadata: jsonb('metadata').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    tenantIdx: index('profiles_tenant_idx').on(t.tenantId),
    userIdx: index('profiles_user_idx').on(t.userId),
    parentIdx: index('profiles_parent_idx').on(t.parentId),
    roleIdx: index('profiles_role_idx').on(t.tenantId, t.role),
  }),
);

// ============================================================================
// audit_logs — trilha de auditoria de operações sensíveis.
// ============================================================================

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entity_id'),
    payload: jsonb('payload').default({}).notNull(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    tenantIdx: index('audit_logs_tenant_idx').on(t.tenantId, t.createdAt),
    entityIdx: index('audit_logs_entity_idx').on(t.entity, t.entityId),
  }),
);

// ============================================================================
// RELATIONS
// ============================================================================

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  profiles: many(profiles),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  auditLogs: many(auditLogs),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  tenant: one(tenants, { fields: [profiles.tenantId], references: [tenants.id] }),
  parent: one(profiles, {
    fields: [profiles.parentId],
    references: [profiles.id],
    relationName: 'parent_child',
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, { fields: [auditLogs.tenantId], references: [tenants.id] }),
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

// ============================================================================
// TYPES
// ============================================================================

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type Role = (typeof roleEnum.enumValues)[number];
