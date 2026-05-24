import { UnderConstruction } from '../_placeholder/under-construction';

export default function AcademyPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Academy"
      subtitle="Trilhas de aprendizagem para a rede"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Academy' }]}
    />
  );
}
