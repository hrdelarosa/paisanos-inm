'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  createAttentionReportAction,
  getAttentionReportAction,
  listAttentionReportsAction,
  markAttentionReportReviewedAction,
} from '../actions/attentions.actions'
import type { CreateAttentionReportActionInput } from '../schema/attentions.schema'

export const ATTENTION_REPORTS_QUERY_KEY = ['attentions', 'reports']

export function useAttentionReports() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const reportsQuery = useQuery({
    queryKey: ATTENTION_REPORTS_QUERY_KEY,
    queryFn: listAttentionReportsAction,
  })

  const createReport = useMutation({
    mutationFn: (input: CreateAttentionReportActionInput) =>
      createAttentionReportAction(input),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: ATTENTION_REPORTS_QUERY_KEY })
      toast.success('Reporte registrado correctamente')
      router.push(`/attentions/${result.id}`)
    },
    onError: (error) => toast.error(error.message),
  })

  const markReviewed = useMutation({
    mutationFn: markAttentionReportReviewedAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENTION_REPORTS_QUERY_KEY })
      toast.success('Reporte marcado como revisado')
    },
    onError: (error) => toast.error(error.message),
  })

  return { reportsQuery, createReport, markReviewed }
}

export function useAttentionReport(id: string) {
  const reportQuery = useQuery({
    queryKey: [...ATTENTION_REPORTS_QUERY_KEY, id],
    queryFn: () => getAttentionReportAction(id),
  })

  return { reportQuery }
}
