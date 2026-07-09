import z from 'zod'

export const createAttentionReportFormSchema = z.object({
  operativeId: z.string().min(1, { message: 'El operativo es requerido' }),
  moduleId: z.string().min(1, { message: 'El módulo es requerido' }),
  reportDate: z.string().min(1, { message: 'La fecha es requerida' }),
  notes: z.string().optional(),
  items: z.record(
    z.string(),
    z.object({
      quantity: z.coerce.number().min(0).default(0),
      description: z.string().optional(),
    }),
  ),
})

export type CreateAttentionReportFormInput = z.infer<
  typeof createAttentionReportFormSchema
>
