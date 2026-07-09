'use client'

import Link from 'next/link'
import DataTable from '@/src/components/DataTable'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { formatDate, formatNumber } from '@/src/lib/format'
import { useDashboardStats } from '@/src/modules/dashboard/hooks/useDashboardStats'

export default function Home() {
  const { statsQuery } = useDashboardStats()
  const stats = statsQuery.data

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Panel principal</h1>
          <p className="text-sm text-muted-foreground">
            Resumen general del registro de atenciones del programa.
          </p>
        </div>
        <Button size="lg" render={<Link href="/attentions/new" />}>
          Capturar reporte
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Atenciones" value={formatNumber(stats?.totalAttentions || 0)} />
        <StatCard title="Módulos activos" value={formatNumber(stats?.activeModules || 0)} />
        <StatCard title="Operativos activos" value={formatNumber(stats?.activeOperatives || 0)} />
        <StatCard title="Reportes hoy" value={formatNumber(stats?.todayReports || 0)} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Últimos reportes</h2>
        <DataTable
          items={stats?.latestReports || []}
          isLoading={statsQuery.isLoading}
          emptyMessage="Todavía no hay reportes capturados"
          getRowKey={(report) => report.id}
          columns={[
            { key: 'reportDate', label: 'Fecha', render: (report) => formatDate(report.reportDate) },
            { key: 'operativeName', label: 'Operativo', render: (report) => report.operativeName },
            { key: 'moduleName', label: 'Módulo', render: (report) => report.moduleName },
            { key: 'total', label: 'Total', render: (report) => formatNumber(Number(report.total)) },
          ]}
          actions={{ render: (report) => <Button variant="outline" render={<Link href={`/attentions/${report.id}`} />}>Ver</Button> }}
        />
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
