'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardStatsAction } from '../actions/dashboard.actions'

export function useDashboardStats() {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStatsAction,
  })

  return { statsQuery }
}
