'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  fullName: string | null;
  email: string;
  roleLabel: string;
}

export function UserMenu({ fullName, email, roleLabel }: UserMenuProps): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const initials = (fullName ?? email)
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    startTransition(() => {
      router.replace('/login');
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-left transition-colors hover:bg-surface"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-subtle text-xs font-semibold text-ignyx-navy">
          {initials || <User className="h-4 w-4" />}
        </span>
        <span className="hidden text-right md:block">
          <span className="block text-sm font-medium leading-tight text-text-primary">
            {fullName ?? email}
          </span>
          <span className="block text-[11px] text-text-tertiary">{roleLabel}</span>
        </span>
      </button>

      <div
        className={cn(
          'absolute right-0 top-full z-40 mt-2 w-56 origin-top-right rounded-xl border border-border-default bg-white p-1 shadow-ignyx-md transition',
          open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95',
        )}
      >
        <div className="border-b border-border-default px-3 py-2.5">
          <p className="truncate text-sm font-medium text-text-primary">{fullName ?? email}</p>
          <p className="truncate text-xs text-text-tertiary">{email}</p>
        </div>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLogout}
          disabled={pending}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary transition-colors hover:bg-surface disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 text-text-tertiary" />
          {pending ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </div>
  );
}
