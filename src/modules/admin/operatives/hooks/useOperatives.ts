'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createOperativeAction,
  CreateOperativeInput,
  listOperativesAction,
  toggleOperativeStatusAction,
} from '../actions/operatives.actions'

export const OPERATIVES_QUERY_KEY = ['admin', 'operatives']

export function useOperatives() {
  const queryClient = useQueryClient()

  const operativesQuery = useQuery({
    queryKey: OPERATIVES_QUERY_KEY,
    queryFn: listOperativesAction,
  })

  const createOperative = useMutation({
    mutationFn: (input: CreateOperativeInput) => createOperativeAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATIVES_QUERY_KEY })
      toast.success('Operativo creado correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const toggleOperativeStatus = useMutation({
    mutationFn: toggleOperativeStatusAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPERATIVES_QUERY_KEY })
      toast.success('Estado del operativo actualizado')
    },
    onError: (error) => toast.error(error.message),
  })

  return { operativesQuery, createOperative, toggleOperativeStatus }
}
