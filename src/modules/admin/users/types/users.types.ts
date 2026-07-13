export interface AdminUser {
  name: string
  email: string
  emailVerified: boolean
  image: null
  createdAt: Date
  updatedAt: Date
  username: string | null
  displayUsername: string | null
  role: string | null
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  id: string
  profileId: string | null
  module: string | null
  profileCreatedAt: Date | null
  profileUpdatedAt: Date | null
}
