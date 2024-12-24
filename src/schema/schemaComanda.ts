import { z } from 'zod';

const ItemComandaSchema = z.object({
  id: z.number().int().optional(),
  value: z.number().positive(),
  id_comanda: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const ComandaSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  id_usuario: z.number().int().positive(),
  active: z.number().int().default(1).refine(val => val === 0 || val === 1),
  createdAt: z.string().refine(val => !isNaN(Date.parse(val))),
  items_comanda: z.array(ItemComandaSchema).optional(),
  value: z.number().int().optional(),
});

export type ComandaType = z.infer<typeof ComandaSchema>;

export { ComandaSchema, ItemComandaSchema };
