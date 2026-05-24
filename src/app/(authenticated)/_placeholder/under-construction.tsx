import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import type { BreadcrumbItem } from '@/components/shared/page-header';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function UnderConstruction({ title, subtitle, breadcrumbs }: Props): JSX.Element {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />

      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-white p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-subtle">
          <Construction className="h-7 w-7 text-ignyx-navy" />
        </div>
        <p className="mt-4 text-base font-medium text-text-primary">Em construção</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Este módulo entra na próxima fase do roadmap. Volte em breve.
        </p>
      </div>
    </div>
  );
}
