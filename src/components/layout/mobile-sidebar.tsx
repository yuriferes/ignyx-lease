'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Role } from '@/db/schema/identity';
import { SidebarNav } from './sidebar-nav';

interface MobileSidebarProps {
  role: Role | null;
}

export function MobileSidebar({ role }: MobileSidebarProps): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menu" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex h-16 items-center px-5 border-b border-border-default">
          <Image src="/logo.svg" alt="iGNYX Lease" width={150} height={32} priority />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav role={role} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
