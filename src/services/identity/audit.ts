import 'server-only';
import { db } from '@/db';
import { auditLogs } from '@/db/schema/identity';

export interface AuditEvent {
  tenantId: string | null;
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string;
  payload?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Registra um evento na trilha de auditoria. Falhas são logadas mas não
 * lançam — auditoria não deve quebrar fluxo de negócio.
 */
export async function recordAudit(event: AuditEvent): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      tenantId: event.tenantId,
      userId: event.userId,
      action: event.action,
      entity: event.entity,
      entityId: event.entityId,
      payload: event.payload ?? {},
      ip: event.ip ?? null,
      userAgent: event.userAgent ?? null,
    });
  } catch (err) {
    console.error('[audit] falha ao gravar log', event.action, err);
  }
}
