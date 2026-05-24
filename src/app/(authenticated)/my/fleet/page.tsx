import { UnderConstruction } from '../../_placeholder/under-construction';

export default function MyFleetPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Minha Frota"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Frota' }]}
    />
  );
}
