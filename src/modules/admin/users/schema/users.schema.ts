import z from 'zod'
import { USER_ROLES_KEYS } from '@/src/constants/dominio'

const createUserFormSchemaBase = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres' }),
  moduleId: z
    .string()
    .transform((value): string | undefined =>
      value === '' ? undefined : value,
    ),
  username: z
    .string()
    .min(1, { message: 'El nombre de usuario es requerido' })
    .max(40, {
      message: 'El nombre de usuario no puede tener más de 40 caracteres',
    }),
  role: z.enum(USER_ROLES_KEYS, { message: 'El rol es requerido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .max(50, { message: 'La contraseña no puede tener más de 50 caracteres' }),
})

export const createUserFormSchema = createUserFormSchemaBase
  .superRefine((data, ctx) => {
    if (data.role === 'capturista' && !data.moduleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['moduleId'],
        message: 'El módulo es requerido',
      })
    }
  })
  .transform((data) => ({
    ...data,
    moduleId: data.role === 'capturista' ? data.moduleId : undefined,
  }))

export type CreateUserFormInput = z.infer<typeof createUserFormSchema>
