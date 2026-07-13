'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateUserFormInput } from '../schema/users.schema'
import { AdminUser } from '../types/users.types'
import {
  banUserAction,
  createUserAction,
  removeUserAction,
  unbanUserAction,
  usersActios,
} from '../actions/users.actions'
import { toast } from 'sonner'

const USERS_QUERY_KEY = ['admin', 'users']

export function useAdminUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const result = await usersActios()
      return result.users as AdminUser[]
    },
  })

  const createUserMutation = useMutation({
    mutationFn: (input: CreateUserFormInput) => createUserAction({ input }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Usuario creado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const toggleBanUserMutation = useMutation({
    mutationFn: async (user: AdminUser) =>
      user.banned
        ? unbanUserAction({ userId: user.id })
        : banUserAction({ userId: user.id }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Estado del usuario actualizado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => removeUserAction({ userId }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Usuario eliminado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    usersQuery,
    createUser: createUserMutation,
    toggleBanUser: toggleBanUserMutation,
    removeUser: removeUserMutation,
  }
}
