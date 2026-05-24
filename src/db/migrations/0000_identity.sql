-- =============================================================================
-- 0000_identity — tabelas base de Identity & Access
-- Gerado manualmente; aceito como source-of-truth do schema inicial.
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE "user_status" AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "role" AS ENUM (
    'franqueador',
    'franqueado',
    'representante',
    'tecnico_instalador',
    'fabrica',
    'cliente'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "tenants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY,
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE RESTRICT,
  "email" text NOT NULL,
  "whatsapp_number" text,
  "full_name" text NOT NULL,
  "cpf" text,
  "profile_image_url" text,
  "status" "user_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "deleted_at" timestamptz
);

CREATE INDEX IF NOT EXISTS "users_tenant_idx" ON "users" ("tenant_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_tenant_email_uq" ON "users" ("tenant_id", "email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_tenant_whatsapp_uq"
  ON "users" ("tenant_id", "whatsapp_number")
  WHERE "whatsapp_number" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE RESTRICT,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" "role" NOT NULL,
  "parent_id" uuid REFERENCES "profiles"("id") ON DELETE SET NULL,
  "home_region_cep" text,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "profiles_tenant_idx" ON "profiles" ("tenant_id");
CREATE INDEX IF NOT EXISTS "profiles_user_idx" ON "profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "profiles_parent_idx" ON "profiles" ("parent_id");
CREATE INDEX IF NOT EXISTS "profiles_role_idx" ON "profiles" ("tenant_id", "role");

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid REFERENCES "tenants"("id") ON DELETE CASCADE,
  "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "entity" text NOT NULL,
  "entity_id" text,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "ip" text,
  "user_agent" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "audit_logs_tenant_idx" ON "audit_logs" ("tenant_id", "created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs" ("entity", "entity_id");
