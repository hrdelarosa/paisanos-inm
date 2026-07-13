import z from 'zod'

export const createAttentionReportFormSchema = z.object({
  operativeId: z.string().min(1, { message: 'El operativo es requerido' }),
  moduleId: z.string().min(1, { message: 'El módulo es requerido' }),
  reportDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha no es válida' }),
  notes: z.string().max(1000).optional(),
  items: z.record(
    z.string(),
    z.object({
      quantity: z.coerce
        .number()
        .int({ message: 'La cantidad debe ser un número entero' })
        .min(0, { message: 'La cantidad no puede ser negativa' })
        .max(100000, { message: 'La cantidad es demasiado alta' })
        .default(0),
      description: z.string().max(500).optional(),
    }),
  ),
})

export const createAttentionReportActionSchema = z.object({
  operativeId: z.string().min(1),
  moduleId: z.string().min(1),
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional(),
  items: z.array(
    z.object({
      attentionTypeId: z.string().min(1),
      quantity: z.coerce.number().int().min(0).max(100000),
      description: z.string().max(500).optional(),
    }),
  ),
})

export type CreateAttentionReportFormInput = z.infer<
  typeof createAttentionReportFormSchema
>

export type CreateAttentionReportActionInput = z.infer<
  typeof createAttentionReportActionSchema
>
