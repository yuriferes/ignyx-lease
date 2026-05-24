import { UnderConstruction } from '../../_placeholder/under-construction';

export default function FactoryLogisticsPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Logística · Fábrica"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Fábrica', href: '/factory' },
        { label: 'Logística' },
      ]}
    />
  );
}
