import type { Role } from '@/db/schema/identity';

/**
 * Matriz de permissões — referência: arquitetura v1, seção 3.
 *
 * Cada action é uma string `<entity>.<verb>` e cada role tem o conjunto de
 * actions que pode executar. Use `can(role, action)` no server (route handler,
 * server action) e `canRole(role, action)` em componentes pra esconder UI.
 *
 * IMPORTANTE: RBAC visual NÃO substitui RLS no banco. Toda escrita sensível
 * deve ser revalidada server-side e protegida pela policy do Postgres.
 */
export type Action =
  // Identity
  | 'user.read'
  | 'user.invite'
  | 'user.deactivate'
  // Network — franqueados
  | 'franchisee.read'
  | 'franchisee.create'
  | 'franchisee.update'
  | 'franchisee.inactivate'
  // Network — representantes / técnicos (escopo do franqueado)
  | 'representative.read'
  | 'representative.manage'
  | 'technician.read'
  | 'technician.manage'
  // Sales
  | 'pipeline.read'
  | 'pipeline.manage'
  // Contracts
  | 'contract.read'
  | 'contract.manage'
  // Operations
  | 'installation.read'
  | 'installation.execute'
  // Billing
  | 'billing.read'
  | 'billing.manage'
  // Factory
  | 'factory.read'
  | 'factory.manage'
  // Customer self-service
  | 'self.contract.read'
  | 'self.billing.read';

const MATRIX: Record<Role, ReadonlySet<Action>> = {
  franqueador: new Set<Action>([
    'user.read',
    'user.invite',
    'user.deactivate',
    'franchisee.read',
    'franchisee.create',
    'franchisee.update',
    'franchisee.inactivate',
    'representative.read',
    'representative.manage',
    'technician.read',
    'technician.manage',
    'pipeline.read',
    'pipeline.manage',
    'contract.read',
    'contract.manage',
    'installation.read',
    'installation.execute',
    'billing.read',
    'billing.manage',
    'factory.read',
    'factory.manage',
  ]),
  franqueado: new Set<Action>([
    'representative.read',
    'representative.manage',
    'technician.read',
    'technician.manage',
    'pipeline.read',
    'pipeline.manage',
    'contract.read',
    'installation.read',
    'billing.read',
  ]),
  representante: new Set<Action>(['pipeline.read', 'pipeline.manage']),
  tecnico_instalador: new Set<Action>(['installation.read', 'installation.execute']),
  fabrica: new Set<Action>(['factory.read', 'factory.manage']),
  cliente: new Set<Action>(['self.contract.read', 'self.billing.read']),
};

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false;
  return MATRIX[role].has(action);
}

/**
 * Versão para hide-on-UI. Idêntica a `can`, mas nomeada pra deixar claro
 * no client que é só presentation — a autorização real é no server.
 */
export const canRole = can;

/**
 * Helper: lança erro se a role não tiver permissão. Usar no início de
 * server actions / route handlers privilegiados.
 */
export function assertCan(role: Role | null | undefined, action: Action): void {
  if (!can(role, action)) {
    throw new Error(`Acesso negado: role "${role ?? 'anon'}" não pode "${action}".`);
  }
}
