'use client'

import { createContext } from 'react'
import { SessionContextType, User } from '../types/user.types'
import { authClient } from '@/src/lib/auth-client'

interface Props {
  user: User | null
  children: React.ReactNode
}

export const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
})

export function SessionProvider({ user, children }: Props) {
  const { data: session, isPending } = authClient.useSession()
  const userValue = isPending ? user : (session?.user ?? null)

  return (
    <SessionContext
      value={{ user: userValue, isLoading: isPending && user === null }}
    >
      {children}
    </SessionContext>
  )
}
