import { UnderConstruction } from '../_placeholder/under-construction';

export default function SettingsPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Configurações"
      subtitle="Preferências da plataforma e do tenant"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Configurações' }]}
    />
  );
}
