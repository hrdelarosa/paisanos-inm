export { USER_ROLES } from '@/src/modules/domain/constants'

export type { UserRole } from '@/src/modules/domain/constants'

export interface User {
  name: string
  email: string
  emailVerified: boolean
  image: null
  createdAt: Date
  updatedAt: Date
  username: string
  displayUsername: string
  role: string
  banned: boolean
  banReason: null
  banExpires: null
  id: string
}
