import { UnderConstruction } from '../_placeholder/under-construction';

export default function CarbonPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Carbon"
      subtitle="CO₂ evitado e indicadores ESG"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Carbon' }]}
    />
  );
}
