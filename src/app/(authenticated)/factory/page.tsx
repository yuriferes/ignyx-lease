import { UnderConstruction } from '../_placeholder/under-construction';

export default function FactoryPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Fábrica"
      subtitle="Pedidos, estoque e logística MAF Energy"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Fábrica' }]}
    />
  );
}
