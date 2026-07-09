'use server'

import { headers } from 'next/headers'
import { auth } from '@/src/lib/auth'
import { UserRole } from './constants'

export async function requireSession(roles?: UserRole[]) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) throw new Error('No autorizado')

  if (roles?.length && !roles.includes(session.user.role as UserRole)) {
    throw new Error('No autorizado')
  }

  return session
}
