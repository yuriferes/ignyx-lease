import Image from 'next/image';
import Link from 'next/link';
import type { Role } from '@/db/schema/identity';
import { SidebarNav } from './sidebar-nav';

interface SidebarProps {
  role: Role | null;
}

export function Sidebar({ role }: SidebarProps): JSX.Element {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border-default bg-white lg:flex">
      <div className="flex h-16 items-center px-5 border-b border-border-default">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.svg" alt="iGNYX Lease" width={160} height={36} priority />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav role={role} />
      </div>
      <div className="border-t border-border-default p-4">
        <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
          Maff Franchising
        </p>
        <p className="mt-0.5 text-xs text-text-secondary">v0.1 · MVP</p>
      </div>
    </aside>
  );
}
