/**
 * Seed inicial — cria tenant Maff e o superadmin (franqueador).
 *
 *  - Cria/aproveita o tenant "maff" via Drizzle.
 *  - Cria o usuário no Supabase Auth via service_role.
 *  - Injeta app_metadata.tenant_id e app_metadata.role pra alimentar o JWT.
 *  - Espelha em users + profiles (role=franqueador).
 *
 * Idempotente: rodar mais de uma vez não duplica nem quebra.
 *
 * Uso:
 *   npm run db:seed
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { tenants, users, profiles } from '../src/db/schema/identity';

const TENANT_SLUG = 'maff';
const TENANT_NAME = 'Maff Franchising';

const SUPERADMIN_EMAIL = process.env.SEED_SUPERADMIN_EMAIL ?? 'yuri@maff.com.br';
const SUPERADMIN_PASSWORD = process.env.SEED_SUPERADMIN_PASSWORD ?? 'change-me-on-first-login';
const SUPERADMIN_NAME = process.env.SEED_SUPERADMIN_NAME ?? 'Yuri Feres';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }

  console.log('▶ Seed iGNYX Lease iniciando...');

  // 1. Tenant
  let tenant = (await db.select().from(tenants).where(eq(tenants.slug, TENANT_SLUG)))[0];
  if (!tenant) {
    [tenant] = await db
      .insert(tenants)
      .values({ name: TENANT_NAME, slug: TENANT_SLUG })
      .returning();
    console.log(`✓ Tenant criado: ${tenant!.name} (${tenant!.id})`);
  } else {
    console.log(`= Tenant existente: ${tenant.name} (${tenant.id})`);
  }

  // 2. Supabase Auth (admin)
  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (listErr) throw listErr;

  const existing = list.users.find((u) => u.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase());

  let userId: string;
  if (existing) {
    userId = existing.id;
    // Garante claims certos.
    await admin.auth.admin.updateUserById(userId, {
      app_metadata: { ...existing.app_metadata, tenant_id: tenant!.id, role: 'franqueador' },
      user_metadata: { ...existing.user_metadata, full_name: SUPERADMIN_NAME },
    });
    console.log(`= Auth user existente: ${SUPERADMIN_EMAIL} (${userId})`);
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: SUPERADMIN_EMAIL,
      password: SUPERADMIN_PASSWORD,
      email_confirm: true,
      app_metadata: { tenant_id: tenant!.id, role: 'franqueador' },
      user_metadata: { full_name: SUPERADMIN_NAME },
    });
    if (createErr || !created.user) throw createErr ?? new Error('Falha ao criar superadmin.');
    userId = created.user.id;
    console.log(`✓ Auth user criado: ${SUPERADMIN_EMAIL} (${userId})`);
  }

  // 3. users (espelho no schema próprio)
  const existingUser = (await db.select().from(users).where(eq(users.id, userId)))[0];
  if (!existingUser) {
    await db.insert(users).values({
      id: userId,
      tenantId: tenant!.id,
      email: SUPERADMIN_EMAIL,
      fullName: SUPERADMIN_NAME,
      status: 'active',
    });
    console.log('✓ Linha em users criada.');
  } else {
    console.log('= users já registrado.');
  }

  // 4. profile franqueador
  const existingProfile = (
    await db.select().from(profiles).where(eq(profiles.userId, userId))
  )[0];
  if (!existingProfile) {
    await db.insert(profiles).values({
      tenantId: tenant!.id,
      userId,
      role: 'franqueador',
    });
    console.log('✓ Profile franqueador criado.');
  } else {
    console.log('= Profile já existente.');
  }

  console.log('✅ Seed concluído.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed falhou:', err);
  process.exit(1);
});
