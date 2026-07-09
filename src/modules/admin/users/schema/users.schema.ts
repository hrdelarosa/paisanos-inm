import z from 'zod'
import { USER_ROLES } from '@/src/modules/domain/constants'

export const createUserFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres' }),
  username: z
    .string()
    .min(1, { message: 'El nombre de usuario es requerido' })
    .max(40, {
      message: 'El nombre de usuario no puede tener más de 40 caracteres',
    }),
  role: z.enum(Object.values(USER_ROLES), { message: 'El rol es requerido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .max(50, { message: 'La contraseña no puede tener más de 50 caracteres' }),
})

export type CreateUserFormInput = z.infer<typeof createUserFormSchema>
