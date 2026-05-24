import { UnderConstruction } from '../../_placeholder/under-construction';

export default function MyContractPage(): JSX.Element {
  return (
    <UnderConstruction
      title="Meu Contrato"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Contrato' }]}
    />
  );
}
