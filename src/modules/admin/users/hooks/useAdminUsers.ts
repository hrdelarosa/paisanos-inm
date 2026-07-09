'use client'

import { User } from '@/src/modules/login/types/user.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateUserFormInput } from '../schema/users.schema'
import {
  banUserAction,
  createUserAction,
  removeUserAction,
  unbanUserAction,
  usersActios,
} from '../../actions/admin.actions'
import { toast } from 'sonner'

const USERS_QUERY_KEY = ['admin', 'users']

export function useAdminUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const result = await usersActios()
      return result.users as User[]
    },
  })

  const createUserMutation = useMutation({
    mutationFn: (input: CreateUserFormInput) => createUserAction({ input }),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
      }
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      toast.success('Usuario creado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const toggleBanUserMutation = useMutation({
    mutationFn: async (user: User) =>
      user.banned
        ? unbanUserAction({ userId: user.id })
        : banUserAction({ userId: user.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      toast.success('Estado del usuario actualizado correctamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => removeUserAction({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
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
