'use client'

import { useQuery } from '@tanstack/react-query'
import { listAttentionTypesAction } from '../actions/attention-types.actions'

export const ATTENTION_TYPES_QUERY_KEY = ['admin', 'attention-types']

export function useAttentionTypes() {
  const attentionTypesQuery = useQuery({
    queryKey: ATTENTION_TYPES_QUERY_KEY,
    queryFn: listAttentionTypesAction,
  })

  return { attentionTypesQuery }
}
