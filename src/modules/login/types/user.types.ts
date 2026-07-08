import { auth } from '@/src/lib/auth'

export type User = typeof auth.$Infer.Session.user
export interface SessionContextType {
  user: User | null
  isLoading: boolean
}
