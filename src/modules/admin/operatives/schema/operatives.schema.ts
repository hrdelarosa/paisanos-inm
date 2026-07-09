import z from 'zod'

export const createOperativeFormSchema = z
  .object({
    name: z.string().min(1, { message: 'El nombre es requerido' }),
    season: z.enum(['holy_week', 'summer', 'winter', 'permanent']),
    year: z.coerce
      .number()
      .int({ message: 'El año debe ser un número entero' })
      .min(2000, { message: 'El año no es válido' }),
    startDate: z.string().min(1, { message: 'La fecha de inicio es requerida' }),
    endDate: z.string().min(1, { message: 'La fecha de fin es requerida' }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'La fecha de fin debe ser posterior al inicio',
    path: ['endDate'],
  })

export type CreateOperativeFormInput = z.infer<
  typeof createOperativeFormSchema
>
