import { UnderConstruction } from '../../_placeholder/under-construction';

export default function FactoryOrdersPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Pedidos · Fábrica"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Fábrica', href: '/factory' },
        { label: 'Pedidos' },
      ]}
    />
  );
}
