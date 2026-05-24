import { z } from 'zod';

/**
 * Validação de CPF (algoritmo oficial). Aceita só dígitos (11 chars) ou
 * formato 000.000.000-00 — normaliza pra dígitos antes de validar.
 */
export function isValidCPF(input: string): boolean {
  const cpf = input.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDV = (base: string, len: number): number => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) {
      sum += Number(base[i]) * (len + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const dv1 = calcDV(cpf, 9);
  if (dv1 !== Number(cpf[9])) return false;
  const dv2 = calcDV(cpf, 10);
  return dv2 === Number(cpf[10]);
}

export const cpfSchema = z
  .string()
  .min(11)
  .max(14)
  .refine(isValidCPF, { message: 'CPF inválido' })
  .transform((v) => v.replace(/\D/g, ''));

/** WhatsApp BR — aceita +55XXXXXXXXXXX (E.164) ou só dígitos. */
export const whatsappSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 13 && v.startsWith('55'), {
    message: 'WhatsApp deve estar no formato +55DDDXXXXXXXX',
  })
  .transform((v) => `+${v}`);

export const cepSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 8, { message: 'CEP deve ter 8 dígitos' });

export const emailSchema = z.string().email('E-mail inválido').toLowerCase();
