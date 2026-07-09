export const USER_ROLES = {
  Admin: 'admin',
  User: 'user',
} as const

export type UserRole = keyof typeof USER_ROLES

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
