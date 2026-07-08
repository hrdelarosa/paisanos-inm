'use client'

import { useContext } from 'react'
import { SessionContext } from '../context/session-context'

export function useSession() {
  const { user, isLoading } = useContext(SessionContext)

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}
