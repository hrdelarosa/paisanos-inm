'use client'

import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createOperativeAction,
  listOperativesAction,
  toggleOperativeStatusAction,
} from '../actions/operatives.actions'
import { CreateOperativeInput } from '../types/operatives.types'

export const OPERATIVES_QUERY_KEY = ['admin', 'operatives']

export function useOperatives() {
  const queryClient = useQueryClient()

  const operativesQuery = useQuery({
    queryKey: OPERATIVES_QUERY_KEY,
    queryFn: listOperativesAction,
  })

  const createOperative = useMutation({
    mutationFn: (input: CreateOperativeInput) =>
      createOperativeAction({ input }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: OPERATIVES_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Operativo creado correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const toggleOperativeStatus = useMutation({
    mutationFn: toggleOperativeStatusAction,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: OPERATIVES_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Estado del operativo actualizado')
    },
    onError: (error) => toast.error(error.message),
  })

  return { operativesQuery, createOperative, toggleOperativeStatus }
}
