import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
})

export type LoginFormInput = z.infer<typeof loginFormSchema>
