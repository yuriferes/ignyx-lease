import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Role } from '@/db/schema/identity';

export interface AuthSession {
  userId: string;
  email: string;
  tenantId: string | null;
  role: Role | null;
  fullName: string | null;
}

/**
 * Lê a sessão atual e enriquece com claims customizados (tenant_id, role).
 * Cacheado por request — chamar várias vezes não duplica a chamada ao
 * Supabase dentro da mesma render.
 */
export const getSession = cache(async (): Promise<AuthSession | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const appMetadata = (user.app_metadata ?? {}) as {
    tenant_id?: string;
    role?: Role;
  };
  const userMetadata = (user.user_metadata ?? {}) as { full_name?: string };

  return {
    userId: user.id,
    email: user.email ?? '',
    tenantId: appMetadata.tenant_id ?? null,
    role: appMetadata.role ?? null,
    fullName: userMetadata.full_name ?? null,
  };
});

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return session;
}
