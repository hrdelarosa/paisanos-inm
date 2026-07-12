import z from 'zod'
import { OPERATIVE_SEASON_KEYS } from '@/src/constants/dominio'

export const createOperativeFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'El nombre es requerido' })
      .max(100, { message: 'El nombre no puede tener más de 100 caracteres' }),
    season: z.enum(OPERATIVE_SEASON_KEYS, {
      message: 'La temporada es requerida',
    }),
    year: z.coerce
      .number()
      .int({ message: 'El año debe ser un número entero' })
      .min(2020, { message: 'El año no es válido' }),
    startDate: z
      .string()
      .min(1, { message: 'La fecha de inicio es requerida' }),
    endDate: z.string().min(1, { message: 'La fecha de fin es requerida' }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'La fecha de fin debe ser posterior al inicio',
    path: ['endDate'],
  })

export type CreateOperativeFormInput = z.infer<typeof createOperativeFormSchema>
