import { requireSession } from '@/lib/auth/session';

// Layout transitório — apenas garante autenticação até o Commit 4
// trazer Sidebar + Topbar. Componentes filhos podem renderizar seu próprio
// chrome.
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  await requireSession();
  return <>{children}</>;
}
