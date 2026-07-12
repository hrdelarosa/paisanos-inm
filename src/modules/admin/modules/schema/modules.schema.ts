import z from 'zod'
import { MODULE_TYPES_KEYS } from '@/src/constants/dominio'

export const createModuleFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres' }),
  type: z.enum(MODULE_TYPES_KEYS, {
    message: 'El tipo de módulo es requerido',
  }),
  location: z
    .string()
    .min(1, { message: 'La ubicación es requerida' })
    .max(200, { message: 'La ubicación no puede tener más de 200 caracteres' }),
  municipality: z
    .string()
    .min(1, { message: 'El municipio es requerido' })
    .max(75, { message: 'El municipio no puede tener más de 75 caracteres' }),
  state: z
    .string()
    .min(1, { message: 'El estado es requerido' })
    .max(75, { message: 'El estado no puede tener más de 75 caracteres' }),
})

export type CreateModuleFormInput = z.infer<typeof createModuleFormSchema>
