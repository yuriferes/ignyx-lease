'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createFranchiseeSchema } from '@/lib/validation/franchisee';
import { assertCan } from '@/lib/auth/rbac';
import { requireSession } from '@/lib/auth/session';
import {
  createFranchisee,
  inactivateFranchisee,
} from '@/services/network/franchisee-service';

export interface ActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function createFranchiseeAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  assertCan(session.role, 'franchisee.create');

  if (!session.tenantId) {
    return { ok: false, message: 'Sessão sem tenant.' };
  }

  const raw = {
    fullName: String(formData.get('fullName') ?? '').trim(),
    cpf: String(formData.get('cpf') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    whatsappNumber: String(formData.get('whatsappNumber') ?? '').trim(),
    homeRegionCep: String(formData.get('homeRegionCep') ?? '').trim(),
  };

  const parsed = createFranchiseeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenZodErrors(parsed.error),
      message: 'Revise os campos destacados.',
    };
  }

  const hdrs = await headers();
  try {
    await createFranchisee({
      input: parsed.data,
      tenantId: session.tenantId,
      actorUserId: session.userId,
      appUrl: APP_URL,
      ip: hdrs.get('x-forwarded-for'),
      userAgent: hdrs.get('user-agent'),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    return { ok: false, message };
  }

  revalidatePath('/franchisees');
  return { ok: true, message: 'Franqueado cadastrado. E-mail enviado.' };
}

export async function inactivateFranchiseeAction(
  franchiseeId: string,
): Promise<ActionState> {
  const session = await requireSession();
  assertCan(session.role, 'franchisee.inactivate');

  if (!session.tenantId) {
    return { ok: false, message: 'Sessão sem tenant.' };
  }

  const hdrs = await headers();
  try {
    await inactivateFranchisee({
      franchiseeId,
      tenantId: session.tenantId,
      actorUserId: session.userId,
      ip: hdrs.get('x-forwarded-for'),
      userAgent: hdrs.get('user-agent'),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    return { ok: false, message };
  }

  revalidatePath('/franchisees');
  return { ok: true, message: 'Franqueado inativado.' };
}

function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
