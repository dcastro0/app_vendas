import z from 'zod';

const schemaVenda = z.object({
  createdAt: z.string(),
  value: z.number(),
  total_pago: z.number(),
  troco: z.number(),
  payMethod: z.string(),
  id_usuario: z.number(),
  id: z.number(),
});

export type Vendas = z.infer<typeof schemaVenda>;
