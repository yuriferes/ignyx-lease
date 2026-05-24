import { requireSession } from '@/lib/auth/session';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-ignyx-bg">
      <Sidebar role={session.role} />

      <div className="lg:pl-64">
        <Topbar role={session.role} fullName={session.fullName} email={session.email} />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
