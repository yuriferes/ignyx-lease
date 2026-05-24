'use client';

import { useActionState, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFranchiseeAction, type ActionState } from './actions';

const INITIAL: ActionState = { ok: false };

export function NewFranchiseeButton(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createFranchiseeAction, INITIAL);

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
    }
  }, [state.ok, state.message]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo franqueado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo franqueado</DialogTitle>
          <DialogDescription>
            Cadastre um novo franqueado. Ele receberá um e-mail para definir a senha.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nome completo *</Label>
            <Input id="fullName" name="fullName" required autoComplete="name" />
            {state.fieldErrors?.fullName ? (
              <p className="text-xs text-error">{state.fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                name="cpf"
                required
                inputMode="numeric"
                placeholder="000.000.000-00"
              />
              {state.fieldErrors?.cpf ? (
                <p className="text-xs text-error">{state.fieldErrors.cpf}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsappNumber">WhatsApp *</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                required
                inputMode="tel"
                placeholder="+55 11 9 9999-9999"
              />
              {state.fieldErrors?.whatsappNumber ? (
                <p className="text-xs text-error">{state.fieldErrors.whatsappNumber}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="franqueado@empresa.com.br"
            />
            {state.fieldErrors?.email ? (
              <p className="text-xs text-error">{state.fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="homeRegionCep">CEP da região (opcional)</Label>
            <Input
              id="homeRegionCep"
              name="homeRegionCep"
              inputMode="numeric"
              placeholder="00000-000"
              maxLength={9}
            />
            <p className="text-xs text-text-tertiary">
              Pode ser preenchido depois — não bloqueia o cadastro.
            </p>
            {state.fieldErrors?.homeRegionCep ? (
              <p className="text-xs text-error">{state.fieldErrors.homeRegionCep}</p>
            ) : null}
          </div>

          {state.message && !state.ok ? (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error">
              {state.message}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
