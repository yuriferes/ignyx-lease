import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type KPITone = 'green' | 'teal' | 'blue' | 'navy' | 'gold';
export type DeltaType = 'up' | 'down' | 'neutral';

export interface KPICardProps {
  label: string;
  icon?: ReactNode;
  value: ReactNode;
  tone?: KPITone;
  deltaType?: DeltaType;
  deltaLabel?: string;
  footnote?: string;
  className?: string;
}

const TONE: Record<
  KPITone,
  { card: string; border: string; iconBg: string; iconShadow: string; upPill: string }
> = {
  green: {
    card: 'bg-gradient-to-br from-[rgb(var(--ignyx-green)/0.15)] via-white to-white',
    border: 'border-[rgb(var(--ignyx-green)/0.3)]',
    iconBg: 'bg-ignyx-green',
    iconShadow: 'shadow-[0_8px_20px_rgb(var(--ignyx-green)/0.4)]',
    upPill: 'bg-emerald-100 text-emerald-700',
  },
  teal: {
    card: 'bg-gradient-to-br from-[rgb(var(--ignyx-teal)/0.15)] via-white to-white',
    border: 'border-[rgb(var(--ignyx-teal)/0.3)]',
    iconBg: 'bg-ignyx-teal',
    iconShadow: 'shadow-[0_8px_20px_rgb(var(--ignyx-teal)/0.4)]',
    upPill: 'bg-teal-100 text-teal-700',
  },
  blue: {
    card: 'bg-gradient-to-br from-[rgb(var(--ignyx-blue)/0.15)] via-white to-white',
    border: 'border-[rgb(var(--ignyx-blue)/0.3)]',
    iconBg: 'bg-ignyx-blue',
    iconShadow: 'shadow-[0_8px_20px_rgb(var(--ignyx-blue)/0.4)]',
    upPill: 'bg-sky-100 text-sky-700',
  },
  navy: {
    card: 'bg-gradient-to-br from-[rgb(var(--ignyx-navy)/0.08)] via-white to-white',
    border: 'border-[rgb(var(--ignyx-navy)/0.2)]',
    iconBg: 'bg-ignyx-navy',
    iconShadow: 'shadow-[0_8px_20px_rgb(var(--ignyx-navy)/0.3)]',
    upPill: 'bg-emerald-100 text-emerald-700',
  },
  gold: {
    card: 'bg-gradient-to-br from-amber-50 via-white to-white',
    border: 'border-amber-300/60',
    iconBg: 'bg-ignyx-gold',
    iconShadow: 'shadow-[0_8px_20px_rgb(var(--ignyx-gold)/0.4)]',
    upPill: 'bg-amber-100 text-amber-800',
  },
};

export function KPICard({
  label,
  icon,
  value,
  tone = 'green',
  deltaType = 'neutral',
  deltaLabel,
  footnote,
  className,
}: KPICardProps): JSX.Element {
  const t = TONE[tone];
  const deltaPill =
    deltaType === 'up'
      ? t.upPill
      : deltaType === 'down'
        ? 'bg-red-100 text-red-700'
        : 'bg-surface text-text-secondary';
  const arrow = deltaType === 'up' ? '↗' : deltaType === 'down' ? '↘' : '·';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 shadow-ignyx-sm transition hover:shadow-ignyx-md hover:-translate-y-0.5',
        t.card,
        t.border,
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        {icon ? (
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white',
              t.iconBg,
              t.iconShadow,
            )}
          >
            {icon}
          </div>
        ) : (
          <span />
        )}
        {deltaLabel ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-xs font-bold',
              deltaPill,
            )}
          >
            {arrow} {deltaLabel}
          </span>
        ) : null}
      </div>

      <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-ignyx-ink-3">
        {label}
      </p>
      <p className="text-kpi-lg text-ignyx-navy">{value}</p>
      {footnote ? (
        <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-widest text-ignyx-ink-3">
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
