import { UnderConstruction } from '../_placeholder/under-construction';

export default function PipelinePage(): JSX.Element {
  return (
    <UnderConstruction
      title="Funil de Vendas"
      subtitle="Leads, propostas e conversão"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Funil de Vendas' }]}
    />
  );
}
