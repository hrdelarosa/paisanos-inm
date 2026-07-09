'use client'

import { useParams } from 'next/navigation'
import DataTable from '@/src/components/DataTable'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { formatDate, formatNumber } from '@/src/lib/format'
import { REPORT_STATUSES } from '@/src/modules/domain/constants'
import { useAttentionReport } from '@/src/modules/attentions/hooks/useAttentionReports'

export default function AttentionReportDetail() {
  const params = useParams<{ id: string }>()
  const { reportQuery } = useAttentionReport(params.id)
  const data = reportQuery.data
  const total = data?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  if (reportQuery.isLoading) return <div className="p-4 border rounded animate-pulse bg-white h-40" />
  if (!data) return <p className="text-muted-foreground">No se encontró el reporte.</p>

  return <div className="grid gap-4">
    <div>
      <h1 className="text-2xl font-bold">Detalle del reporte</h1>
      <p className="text-sm text-muted-foreground">Revisión de conceptos capturados.</p>
    </div>
    <Card>
      <CardHeader><CardTitle>Datos generales</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-4">
        <div><p className="text-muted-foreground text-sm">Fecha</p><p className="font-medium">{formatDate(data.report.reportDate)}</p></div>
        <div><p className="text-muted-foreground text-sm">Operativo</p><p className="font-medium">{data.report.operativeName}</p></div>
        <div><p className="text-muted-foreground text-sm">Módulo</p><p className="font-medium">{data.report.moduleName}</p></div>
        <div><p className="text-muted-foreground text-sm">Total</p><p className="font-medium">{formatNumber(total)}</p></div>
        <div><p className="text-muted-foreground text-sm">Capturó</p><p className="font-medium">{data.report.userName}</p></div>
        <div><p className="text-muted-foreground text-sm">Estado</p><Badge>{REPORT_STATUSES[data.report.status]}</Badge></div>
      </CardContent>
    </Card>
    <DataTable
      items={data.items}
      getRowKey={(item) => item.id}
      columns={[
        { key: 'code', label: 'Código', render: (item) => item.code },
        { key: 'name', label: 'Concepto', render: (item) => item.name },
        { key: 'quantity', label: 'Cantidad', render: (item) => formatNumber(item.quantity) },
        { key: 'description', label: 'Descripción', render: (item) => item.description || '-' },
      ]}
    />
    {data.report.notes && <Card><CardHeader><CardTitle>Notas</CardTitle></CardHeader><CardContent>{data.report.notes}</CardContent></Card>}
  </div>
}
