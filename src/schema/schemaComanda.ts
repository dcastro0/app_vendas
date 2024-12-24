import { z } from 'zod';

const ItemComandaSchema = z.object({
  id: z.number().int().optional(),
  value: z
    .string()
    .min(1, "O valor é obrigatório")
    .regex(/^R\$\d{1,3}(\.\d{3})*(,\d{2})$/, "Valor inválido")
    .refine(
      (val) => !/^R\$0{1,3}(\.0{3})*(,00)$/.test(val),
      "Valor não pode ser R$0,00",
    ),
  id_comanda: z.number().int().positive(),
  quantity: z.string().min(1, "A quantidade é obrigatória").regex(/^\d+$/, "Quantidade inválida"),
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
export type ItemComandaType = z.infer<typeof ItemComandaSchema>;

export { ComandaSchema, ItemComandaSchema };
