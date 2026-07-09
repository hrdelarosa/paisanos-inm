'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createModuleAction,
  CreateModuleInput,
  listModulesAction,
  toggleModuleStatusAction,
} from '../actions/modules.actions'

export const MODULES_QUERY_KEY = ['admin', 'modules']

export function useModules() {
  const queryClient = useQueryClient()

  const modulesQuery = useQuery({
    queryKey: MODULES_QUERY_KEY,
    queryFn: listModulesAction,
  })

  const createModule = useMutation({
    mutationFn: (input: CreateModuleInput) => createModuleAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY })
      toast.success('Módulo creado correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const toggleModuleStatus = useMutation({
    mutationFn: toggleModuleStatusAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY })
      toast.success('Estado del módulo actualizado')
    },
    onError: (error) => toast.error(error.message),
  })

  return { modulesQuery, createModule, toggleModuleStatus }
}
