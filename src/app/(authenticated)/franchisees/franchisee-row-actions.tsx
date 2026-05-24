'use client';

import { useState, useTransition } from 'react';
import { MoreVertical, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { inactivateFranchiseeAction } from './actions';

interface Props {
  franchiseeId: string;
  fullName: string;
  status: 'active' | 'inactive';
}

export function FranchiseeRowActions({ franchiseeId, fullName, status }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await inactivateFranchiseeAction(franchiseeId);
      if (!res.ok) {
        setError(res.message ?? 'Falha ao inativar.');
        return;
      }
      setOpen(false);
    });
  }

  if (status === 'inactive') {
    return <span className="text-xs text-text-tertiary">—</span>;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Ações"
        onClick={() => setOpen(true)}
        title="Inativar"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inativar franqueado</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja inativar <strong>{fullName}</strong>? Ele perderá acesso
              à plataforma, mas o histórico permanece preservado.
            </DialogDescription>
          </DialogHeader>

          {error ? (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error">{error}</div>
          ) : null}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
              {pending ? 'Inativando...' : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Inativar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
