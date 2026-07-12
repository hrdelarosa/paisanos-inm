'use client'

import { Button } from '@/src/components/ui/button'
import DataTable from '@/src/components/DataTable'
import { Badge } from '@/src/components/ui/badge'
import { formatDate, formatNumber } from '@/src/lib/format'
import { REPORT_STATUSES } from '@/src/constants/dominio'
import { useAttentionReports } from '@/src/modules/attentions/hooks/useAttentionReports'
import { ClipboardPlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function Attentions() {
  const { reportsQuery } = useAttentionReports()
  const reports = reportsQuery.data || []

  return (
    <div>
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Atenciones</h1>
          <p className="text-sm text-muted-foreground">
            Listado de atenciones registradas en el sistema
          </p>
        </div>

        <Link href="/attentions/new">
          <Button size="lg">
            <ClipboardPlusIcon />
            Crear atención
          </Button>
        </Link>
      </div>

      <DataTable
        items={reports}
        isLoading={reportsQuery.isLoading}
        emptyMessage="No hay reportes de atención registrados"
        getRowKey={(report) => report.id}
        columns={[
          {
            key: 'reportDate',
            label: 'Fecha',
            render: (report) => formatDate(report.reportDate),
          },
          {
            key: 'operativeName',
            label: 'Operativo',
            render: (report) => report.operativeName,
          },
          {
            key: 'moduleName',
            label: 'Módulo',
            render: (report) => report.moduleName,
          },
          {
            key: 'userName',
            label: 'Capturó',
            render: (report) => report.userName,
          },
          {
            key: 'total',
            label: 'Total',
            render: (report) => formatNumber(Number(report.total)),
          },
          {
            key: 'status',
            label: 'Estado',
            render: (report) => <Badge>{REPORT_STATUSES[report.status]}</Badge>,
          },
        ]}
        actions={{
          render: (report) => (
            <Button
              variant="outline"
              render={<Link href={`/attentions/${report.id}`} />}
            >
              Ver
            </Button>
          ),
        }}
      />
    </div>
  )
}
