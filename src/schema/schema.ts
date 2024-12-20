import { z } from "zod";

const PayMethodSchema = z.enum(["Cartão de Crédito", "Dinheiro", "Pix", "Cartão de Débito"]);
export type PayMethodType = z.infer<typeof PayMethodSchema>;

const PaymentSchema = z.object({
  id: z.number().optional(),
  value: z
    .string()
    .min(1, "O valor é obrigatório")
    .regex(/^R\$\d{1,3}(\.\d{3})*(,\d{2})$/, "Valor inválido")
    .refine(
      (val) => !/^R\$0{1,3}(\.0{3})*(,00)$/.test(val),
      "Valor não pode ser R$0,00",
    ),
  payMethod: PayMethodSchema,
  createdAt: z.string().optional(),
  id_usuario: z.number().optional(),
  sync: z.number().optional(),
  total_pago: z.number().optional(),
  troco: z.number().optional(),
});
export type PaymentFormData = z.infer<typeof PaymentSchema>;

export { PaymentSchema, PayMethodSchema };
