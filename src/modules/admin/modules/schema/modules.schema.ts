import z from 'zod'

export const createModuleFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  type: z.enum([
    'airport',
    'bus_station',
    'customs_stop',
    'road',
    'public_square',
    'other',
  ]),
  location: z.string().min(1, { message: 'La ubicación es requerida' }),
  municipality: z.string().min(1, { message: 'El municipio es requerido' }),
  state: z.string().min(1, { message: 'El estado es requerido' }),
})

export type CreateModuleFormInput = z.infer<typeof createModuleFormSchema>
