-- =============================================================================
-- 0002_network — franchisees + RLS
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE "franchisee_status" AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "franchisees" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE RESTRICT,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "home_region_cep" text,
  "commission_pct" numeric(5,4) DEFAULT '0.0900' NOT NULL,
  "status" "franchisee_status" DEFAULT 'active' NOT NULL,
  "activated_at" timestamptz DEFAULT now() NOT NULL,
  "deactivated_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "franchisees_tenant_idx" ON "franchisees" ("tenant_id");
CREATE UNIQUE INDEX IF NOT EXISTS "franchisees_user_uq" ON "franchisees" ("user_id");
CREATE INDEX IF NOT EXISTS "franchisees_status_idx" ON "franchisees" ("tenant_id", "status");

ALTER TABLE "franchisees" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "franchisees_tenant_select" ON "franchisees";
CREATE POLICY "franchisees_tenant_select" ON "franchisees"
  FOR SELECT
  USING ("tenant_id" = public.current_tenant_id());

DROP POLICY IF EXISTS "franchisees_tenant_modify" ON "franchisees";
CREATE POLICY "franchisees_tenant_modify" ON "franchisees"
  FOR ALL
  USING ("tenant_id" = public.current_tenant_id() AND public.is_superadmin())
  WITH CHECK ("tenant_id" = public.current_tenant_id() AND public.is_superadmin());
