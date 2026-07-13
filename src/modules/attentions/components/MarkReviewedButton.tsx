'use client'

import { Button } from '@/src/components/ui/button'
import { useAttentionReports } from '../hooks/useAttentionReports'

export default function MarkReviewedButton({ reportId }: { reportId: string }) {
  const { markReviewed } = useAttentionReports()

  return (
    <Button
      type="button"
      disabled={markReviewed.isPending}
      onClick={() => markReviewed.mutate(reportId)}
    >
      {markReviewed.isPending ? 'Marcando...' : 'Marcar como revisado'}
    </Button>
  )
}
