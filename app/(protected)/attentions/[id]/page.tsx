import { notFound } from 'next/navigation'

import DataTable from '@/src/components/DataTable'
import DetailField from '@/src/components/detail-field'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { REPORT_STATUSES } from '@/src/constants/dominio'
import { formatDate, formatNumber } from '@/src/lib/format'
import { getAttentionReportAction } from '@/src/modules/attentions/actions/attentions.actions'
import MarkReviewedButton from '@/src/modules/attentions/components/MarkReviewedButton'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function AttentionReportDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [data, session] = await Promise.all([
    getAttentionReportAction(id),
    auth.api.getSession({ headers: await headers() }),
  ])

  if (!data) notFound()

  const total = data.items.reduce((sum, item) => sum + item.quantity, 0)
  const canReview =
    data.report.status !== 'reviewed' &&
    (session?.user.role === 'admin' || session?.user.role === 'enlace')

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detalle del reporte</h1>
          <p className="text-sm text-muted-foreground">
            Revisión de conceptos capturados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/attentions" />}>
            Volver
          </Button>
          {canReview && <MarkReviewedButton reportId={data.report.id} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Fecha">
              {formatDate(data.report.reportDate)}
            </DetailField>
            <DetailField label="Operativo">
              {data.report.operativeName}
            </DetailField>
            <DetailField label="Módulo">{data.report.moduleName}</DetailField>
            <DetailField label="Total">{formatNumber(total)}</DetailField>
            <DetailField label="Capturó">{data.report.userName}</DetailField>
            <DetailField label="Estado">
              <Badge>{REPORT_STATUSES[data.report.status]}</Badge>
            </DetailField>
            {data.report.reviewedAt && (
              <DetailField label="Revisado el">
                {formatDate(data.report.reviewedAt)}
              </DetailField>
            )}
            {data.report.reviewedByName && (
              <DetailField label="Revisó">
                {data.report.reviewedByName}
              </DetailField>
            )}
          </dl>
        </CardContent>
      </Card>

      <DataTable
        items={data.items}
        getRowKey={(item) => item.id}
        columns={[
          { key: 'code', label: 'Código', render: (item) => item.code },
          { key: 'name', label: 'Concepto', render: (item) => item.name },
          {
            key: 'quantity',
            label: 'Cantidad',
            render: (item) => formatNumber(item.quantity),
          },
          {
            key: 'description',
            label: 'Descripción',
            render: (item) => item.description || '-',
          },
        ]}
      />

      {data.report.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>{data.report.notes}</CardContent>
        </Card>
      )}
    </div>
  )
}
