import { Bell, Search } from 'lucide-react';
import type { Role } from '@/db/schema/identity';
import { ROLE_LABEL } from '@/lib/navigation/sidebar-items';
import { MobileSidebar } from './mobile-sidebar';
import { UserMenu } from './user-menu';

interface TopbarProps {
  role: Role | null;
  fullName: string | null;
  email: string;
}

export function Topbar({ role, fullName, email }: TopbarProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border-default bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <MobileSidebar role={role} />

      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="search"
          placeholder="Buscar franqueados, contratos, leads..."
          className="h-10 w-full rounded-lg border border-border-default bg-surface pl-9 pr-12 text-sm text-text-primary placeholder:text-text-disabled transition-colors duration-150 ease-apple focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border-default bg-white px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary md:inline-block">
          ⌘K
        </kbd>
      </div>

      <button
        type="button"
        aria-label="Notificações"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ignyx-green ring-2 ring-white" />
      </button>

      <UserMenu
        fullName={fullName}
        email={email}
        roleLabel={role ? ROLE_LABEL[role] : '—'}
      />
    </header>
  );
}
