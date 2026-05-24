import { UnderConstruction } from '../_placeholder/under-construction';

export default function AnnouncementsPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Comunicados"
      subtitle="Mensagens da franqueadora para a rede"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Comunicados' }]}
    />
  );
}
