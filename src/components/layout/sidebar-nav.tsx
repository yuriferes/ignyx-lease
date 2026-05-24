'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavItems } from '@/lib/navigation/sidebar-items';
import type { Role } from '@/db/schema/identity';

interface SidebarNavProps {
  role: Role | null;
  onNavigate?: () => void;
}

export function SidebarNav({ role, onNavigate }: SidebarNavProps): JSX.Element {
  const pathname = usePathname();
  const items = getNavItems(role);

  return (
    <nav className="flex flex-col gap-0.5 px-2 py-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-apple',
              active
                ? 'bg-brand-navy-subtle text-ignyx-navy'
                : 'text-text-secondary hover:bg-surface hover:text-text-primary',
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                active ? 'text-ignyx-navy' : 'text-text-tertiary group-hover:text-text-primary',
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
