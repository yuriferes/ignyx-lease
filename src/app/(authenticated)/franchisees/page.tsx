import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { requireSession } from '@/lib/auth/session';
import { can } from '@/lib/auth/rbac';
import { listFranchisees } from '@/services/network/franchisee-service';
import { NewFranchiseeButton } from './franchisee-form';
import { FranchiseeRowActions } from './franchisee-row-actions';

interface PageProps {
  searchParams: Promise<{ status?: 'active' | 'inactive' | 'all' }>;
}

export default async function FranchiseesPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const session = await requireSession();
  if (!can(session.role, 'franchisee.read')) {
    redirect('/dashboard');
  }
  if (!session.tenantId) {
    redirect('/login');
  }

  const params = await searchParams;
  const filter: 'active' | 'inactive' | 'all' = params.status ?? 'active';

  const rows = await listFranchisees({
    tenantId: session.tenantId,
    status: filter === 'all' ? undefined : filter,
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-text-tertiary">
        <Link href="/dashboard" className="hover:text-text-primary">
          Dashboard
        </Link>
        <ChevronRight className="mx-1 h-3.5 w-3.5" />
        <span className="text-text-primary">Franqueados</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-primary">
            <Users className="h-6 w-6 text-ignyx-navy" />
            Franqueados
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gestão da rede — cadastro, status e dados de cada franqueado.
          </p>
        </div>
        {can(session.role, 'franchisee.create') ? <NewFranchiseeButton /> : null}
      </header>

      <div className="flex gap-1 rounded-lg bg-surface p-1 w-fit">
        {(['active', 'inactive', 'all'] as const).map((opt) => {
          const label = opt === 'active' ? 'Ativos' : opt === 'inactive' ? 'Inativos' : 'Todos';
          const active = filter === opt;
          return (
            <Link
              key={opt}
              href={`/franchisees?status=${opt}`}
              className={
                active
                  ? 'rounded-md bg-white px-3 py-1.5 text-xs font-medium text-ignyx-navy shadow-xs'
                  : 'rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary'
              }
            >
              {label}
            </Link>
          );
        })}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Região (CEP)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-text-secondary">
                Nenhum franqueado encontrado neste filtro.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.fullName}</TableCell>
                <TableCell className="text-text-secondary">{row.email}</TableCell>
                <TableCell className="text-text-secondary tnum">
                  {row.whatsappNumber ?? '—'}
                </TableCell>
                <TableCell className="text-text-secondary tnum">
                  {row.homeRegionCep ? formatCep(row.homeRegionCep) : '—'}
                </TableCell>
                <TableCell>
                  {row.status === 'active' ? (
                    <Badge variant="success">Ativo</Badge>
                  ) : (
                    <Badge variant="neutral">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {can(session.role, 'franchisee.inactivate') ? (
                    <FranchiseeRowActions
                      franchiseeId={row.id}
                      fullName={row.fullName}
                      status={row.status}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
