import { auth } from '@/src/lib/auth'

export type AdminUser = Awaited<
  ReturnType<typeof auth.api.listUsers>
>['users'][number]

export interface CreateUserResult {
  success: boolean
  error?: string
}

export interface ActionResponse<T = null> {
  success: boolean
  message?: string
  error?: string
  data?: T
}
