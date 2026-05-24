import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: PageHeaderProps): JSX.Element {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center text-xs text-text-tertiary"
          >
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center">
                {b.href ? (
                  <Link href={b.href} className="transition-colors hover:text-text-primary">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-text-primary">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 ? (
                  <ChevronRight className="mx-1 h-3.5 w-3.5" />
                ) : null}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-text-secondary">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
