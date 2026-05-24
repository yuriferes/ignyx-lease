import { Activity, Leaf, TrendingUp, Users } from 'lucide-react';
import { requireSession } from '@/lib/auth/session';
import { KPICard } from '@/components/shared/kpi-card';
import { PageHeader } from '@/components/shared/page-header';
import { ROLE_LABEL } from '@/lib/navigation/sidebar-items';

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await requireSession();
  const greeting = getGreeting();
  const firstName = session.fullName?.split(' ')[0] ?? '';

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title={`${greeting}${firstName ? `, ${firstName}` : ''}`}
        subtitle={`Visão geral da operação · perfil ${session.role ? ROLE_LABEL[session.role] : '—'}`}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <section
        aria-label="Indicadores principais"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <KPICard
          label="MRR"
          tone="green"
          icon={<TrendingUp className="h-5 w-5" />}
          value={
            <>
              R$ <span className="tnum">0,00</span>
            </>
          }
          deltaType="neutral"
          deltaLabel="0,0%"
          footnote="vs mês anterior"
        />
        <KPICard
          label="Pipeline ativo"
          tone="teal"
          icon={<Activity className="h-5 w-5" />}
          value={<span className="tnum">0</span>}
          deltaType="neutral"
          deltaLabel="0"
          footnote="deals em andamento"
        />
        <KPICard
          label="Saúde da rede"
          tone="blue"
          icon={<Users className="h-5 w-5" />}
          value={<span className="tnum">0</span>}
          deltaType="neutral"
          deltaLabel="0"
          footnote="franqueados ativos"
        />
      </section>

      <section
        aria-label="Sustentabilidade"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="rounded-2xl border border-[rgb(var(--ignyx-green)/0.3)] bg-gradient-to-br from-[rgb(var(--ignyx-green-light))] via-white to-white p-5 shadow-ignyx-sm lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ignyx-green text-white shadow-[0_8px_20px_rgb(var(--ignyx-green)/0.35)]">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ignyx-ink-3">
                Carbon — CO₂ evitado
              </p>
              <p className="mt-1 text-kpi-md text-ignyx-navy">
                <span className="tnum">0</span>{' '}
                <span className="text-lg font-medium text-text-secondary">kg</span>
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                Métrica calculada a partir do consumo evitado nos contratos ativos.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border-default bg-white p-5 shadow-ignyx-sm">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ignyx-ink-3">
            Próximos passos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-text-primary">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ignyx-green" />
              Cadastrar primeiros franqueados em <strong>/franchisees</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ignyx-teal" />
              Configurar funil de vendas
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ignyx-blue" />
              Mapear inventário inicial de Khronner
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function getGreeting(): string {
  const hour = Number(
    new Date().toLocaleString('pt-BR', { hour: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' }),
  );
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
