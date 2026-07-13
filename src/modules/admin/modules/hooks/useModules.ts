'use client'

import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  modulesAction,
  createModuleAction,
  toggleModuleStatusAction,
  moduleAction,
} from '../actions/modules.actions'
import { CreateModuleInput } from '../types/modules.types'

export const MODULES_QUERY_KEY = ['admin', 'modules']

export function useModules(id?: string) {
  const queryClient = useQueryClient()

  const modulesQuery = useQuery({
    queryKey: MODULES_QUERY_KEY,
    queryFn: modulesAction,
  })

  const moduleQuery = useQuery({
    queryKey: [...MODULES_QUERY_KEY, 'module', id],
    queryFn: () => moduleAction({ id: id! }),
    enabled: Boolean(id),
  })

  const createModule = useMutation({
    mutationFn: (input: CreateModuleInput) => createModuleAction({ input }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Módulo creado correctamente')
    },
    onError: (error) => toast.error(error.message),
  })

  const toggleModuleStatus = useMutation({
    mutationFn: toggleModuleStatusAction,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Estado del módulo actualizado')
    },
    onError: (error) => toast.error(error.message),
  })

  return { modulesQuery, moduleQuery, createModule, toggleModuleStatus }
}
