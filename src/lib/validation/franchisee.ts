import { z } from 'zod';
import { cepSchema, cpfSchema, emailSchema, whatsappSchema } from './common';

/**
 * Schema de cadastro de franqueado.
 *
 * NOTA: `homeRegionCep` é OPCIONAL — decisão #1 da reunião de 21/04/2026
 * (campo era obrigatório indevidamente; corrigido para opcional).
 */
export const createFranchiseeSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: cpfSchema,
  email: emailSchema,
  whatsappNumber: whatsappSchema,
  homeRegionCep: cepSchema.optional().or(z.literal('').transform(() => undefined)),
});

export type CreateFranchiseeInput = z.infer<typeof createFranchiseeSchema>;
