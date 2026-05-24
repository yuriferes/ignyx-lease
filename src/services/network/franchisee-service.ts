import 'server-only';
import { randomBytes } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { users, profiles, type Role } from '@/db/schema/identity';
import { franchisees, type Franchisee } from '@/db/schema/network';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { recordAudit } from '@/services/identity/audit';
import { sendEmail } from '@/services/identity/email-sender';
import { renderWelcomeFranchisee } from '@/services/identity/emails/render';
import type { CreateFranchiseeInput } from '@/lib/validation/franchisee';

export interface FranchiseeListItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  whatsappNumber: string | null;
  homeRegionCep: string | null;
  status: 'active' | 'inactive';
  commissionPct: string;
  activatedAt: Date;
  deactivatedAt: Date | null;
}

export async function listFranchisees(args: {
  tenantId: string;
  status?: 'active' | 'inactive';
}): Promise<FranchiseeListItem[]> {
  const rows = await db
    .select({
      id: franchisees.id,
      userId: franchisees.userId,
      fullName: users.fullName,
      email: users.email,
      whatsappNumber: users.whatsappNumber,
      homeRegionCep: franchisees.homeRegionCep,
      status: franchisees.status,
      commissionPct: franchisees.commissionPct,
      activatedAt: franchisees.activatedAt,
      deactivatedAt: franchisees.deactivatedAt,
    })
    .from(franchisees)
    .innerJoin(users, eq(users.id, franchisees.userId))
    .where(
      args.status
        ? and(eq(franchisees.tenantId, args.tenantId), eq(franchisees.status, args.status))
        : eq(franchisees.tenantId, args.tenantId),
    )
    .orderBy(desc(franchisees.createdAt));

  return rows;
}

function generateTempPassword(): string {
  // 18 bytes -> 24 chars base64; basta como senha temporária do auth.
  return randomBytes(18).toString('base64url');
}

export interface CreateFranchiseeResult {
  franchisee: Franchisee;
  userId: string;
  email: string;
}

export async function createFranchisee(args: {
  input: CreateFranchiseeInput;
  tenantId: string;
  actorUserId: string;
  appUrl: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<CreateFranchiseeResult> {
  const { input, tenantId, actorUserId, appUrl } = args;

  const admin = createSupabaseAdminClient();
  const tempPassword = generateTempPassword();

  // 1. Cria usuário no Supabase Auth com claims já injetados no JWT.
  const role: Role = 'franqueado';
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true,
    app_metadata: { tenant_id: tenantId, role },
    user_metadata: { full_name: input.fullName },
  });
  if (createErr || !created.user) {
    throw new Error(`Falha ao criar conta de acesso: ${createErr?.message ?? 'desconhecida'}`);
  }
  const userId = created.user.id;

  try {
    // 2. Espelho em users.
    await db.insert(users).values({
      id: userId,
      tenantId,
      email: input.email,
      fullName: input.fullName,
      cpf: input.cpf,
      whatsappNumber: input.whatsappNumber,
      status: 'active',
    });

    // 3. profile franqueado.
    await db.insert(profiles).values({
      tenantId,
      userId,
      role,
      homeRegionCep: input.homeRegionCep,
    });

    // 4. franchisee.
    const [row] = await db
      .insert(franchisees)
      .values({
        tenantId,
        userId,
        homeRegionCep: input.homeRegionCep,
      })
      .returning();

    if (!row) throw new Error('Falha ao persistir franqueado.');

    // 5. Gera link de reset/definição de senha.
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: input.email,
      options: { redirectTo: `${appUrl}/reset-password` },
    });
    const resetUrl =
      !linkErr && link?.properties?.action_link
        ? link.properties.action_link
        : `${appUrl}/reset-password`;

    // 6. Envia e-mail de boas-vindas (best-effort — não desfaz se falhar).
    try {
      await sendEmail({
        to: input.email,
        subject: 'Bem-vindo(a) à iGNYX Lease — defina sua senha',
        html: renderWelcomeFranchisee({
          fullName: input.fullName,
          resetUrl,
          brandLogoUrl: `${appUrl}/logo.svg`,
        }),
      });
    } catch (err) {
      console.error('[franchisee.create] e-mail falhou:', err);
    }

    // 7. Auditoria.
    await recordAudit({
      tenantId,
      userId: actorUserId,
      action: 'franchisee.created',
      entity: 'franchisee',
      entityId: row.id,
      payload: { email: input.email, fullName: input.fullName },
      ip: args.ip,
      userAgent: args.userAgent,
    });

    return { franchisee: row, userId, email: input.email };
  } catch (err) {
    // Rollback do Auth caso a persistência tenha falhado.
    try {
      await admin.auth.admin.deleteUser(userId);
    } catch (rollbackErr) {
      console.error('[franchisee.create] rollback do auth falhou:', rollbackErr);
    }
    throw err;
  }
}

export async function inactivateFranchisee(args: {
  franchiseeId: string;
  tenantId: string;
  actorUserId: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<Franchisee> {
  const [updated] = await db
    .update(franchisees)
    .set({
      status: 'inactive',
      deactivatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(franchisees.id, args.franchiseeId), eq(franchisees.tenantId, args.tenantId)))
    .returning();

  if (!updated) {
    throw new Error('Franqueado não encontrado.');
  }

  // Inativa também o user de acesso, preservando histórico.
  await db
    .update(users)
    .set({ status: 'inactive', updatedAt: new Date() })
    .where(eq(users.id, updated.userId));

  await recordAudit({
    tenantId: args.tenantId,
    userId: args.actorUserId,
    action: 'franchisee.inactivated',
    entity: 'franchisee',
    entityId: updated.id,
    payload: { userId: updated.userId },
    ip: args.ip,
    userAgent: args.userAgent,
  });

  return updated;
}
