-- =============================================================================
-- 0001_rls — Row Level Security helpers + policies multi-tenant
-- =============================================================================
-- Estratégia: o tenant_id é injetado no JWT do usuário via
-- app_metadata.tenant_id (Supabase Auth hook). A função current_tenant_id()
-- lê do JWT (auth.jwt()) e retorna o uuid; cada tabela sensível usa essa
-- função na policy USING / WITH CHECK.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    coalesce(
      current_setting('request.jwt.claim.tenant_id', true),
      (auth.jwt() -> 'app_metadata' ->> 'tenant_id')
    ),
    ''
  )::uuid;
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    coalesce(
      current_setting('request.jwt.claim.role_app', true),
      (auth.jwt() -> 'app_metadata' ->> 'role')
    ),
    ''
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT public.current_user_role() = 'franqueador';
$$;

-- ---------------------------------------------------------------------------
-- ENABLE RLS
-- ---------------------------------------------------------------------------

ALTER TABLE "tenants"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs"  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- tenants — só o próprio tenant é visível; service_role bypassa.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "tenants_self_select" ON "tenants";
CREATE POLICY "tenants_self_select" ON "tenants"
  FOR SELECT
  USING ("id" = public.current_tenant_id());

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "users_tenant_select" ON "users";
CREATE POLICY "users_tenant_select" ON "users"
  FOR SELECT
  USING ("tenant_id" = public.current_tenant_id());

DROP POLICY IF EXISTS "users_tenant_modify" ON "users";
CREATE POLICY "users_tenant_modify" ON "users"
  FOR ALL
  USING ("tenant_id" = public.current_tenant_id() AND public.is_superadmin())
  WITH CHECK ("tenant_id" = public.current_tenant_id() AND public.is_superadmin());

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "profiles_tenant_select" ON "profiles";
CREATE POLICY "profiles_tenant_select" ON "profiles"
  FOR SELECT
  USING ("tenant_id" = public.current_tenant_id());

DROP POLICY IF EXISTS "profiles_tenant_modify" ON "profiles";
CREATE POLICY "profiles_tenant_modify" ON "profiles"
  FOR ALL
  USING ("tenant_id" = public.current_tenant_id() AND public.is_superadmin())
  WITH CHECK ("tenant_id" = public.current_tenant_id() AND public.is_superadmin());

-- ---------------------------------------------------------------------------
-- audit_logs — leitura só do próprio tenant; insert via service_role.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "audit_logs_tenant_select" ON "audit_logs";
CREATE POLICY "audit_logs_tenant_select" ON "audit_logs"
  FOR SELECT
  USING ("tenant_id" = public.current_tenant_id());
