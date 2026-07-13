import Link from 'next/link'
import { notFound } from 'next/navigation'
import { count, desc, eq, sql } from 'drizzle-orm'

import DataTable from '@/src/components/DataTable'
import DetailField from '@/src/components/detail-field'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { db } from '@/src/db'
import { attentionReportItems, attentionReports, attentionTypes, modules, operatives } from '@/src/db/schema'
import { formatDate, formatNumber } from '@/src/lib/format'

export default async function AttentionConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [type] = await db
    .select()
    .from(attentionTypes)
    .where(eq(attentionTypes.id, id))

  if (!type) notFound()

  const [[stats], operativeTotals, recentReports] = await Promise.all([
    db
      .select({
        reportCount: count(attentionReports.id),
        totalAttentions: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
        moduleCount: sql<number>`count(distinct ${attentionReports.moduleId})`,
        operativeCount: sql<number>`count(distinct ${attentionReports.operativeId})`,
      })
      .from(attentionReportItems)
      .innerJoin(attentionReports, eq(attentionReportItems.reportId, attentionReports.id))
      .where(eq(attentionReportItems.attentionTypeId, id)),
    db
      .select({
        id: operatives.id,
        name: operatives.name,
        year: operatives.year,
        total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
      })
      .from(attentionReportItems)
      .innerJoin(attentionReports, eq(attentionReportItems.reportId, attentionReports.id))
      .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
      .where(eq(attentionReportItems.attentionTypeId, id))
      .groupBy(operatives.id)
      .orderBy(desc(sql`coalesce(sum(${attentionReportItems.quantity}), 0)`)),
    db
      .select({
        id: attentionReports.id,
        reportDate: attentionReports.reportDate,
        moduleName: modules.name,
        operativeName: operatives.name,
        quantity: attentionReportItems.quantity,
      })
      .from(attentionReportItems)
      .innerJoin(attentionReports, eq(attentionReportItems.reportId, attentionReports.id))
      .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
      .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
      .where(eq(attentionReportItems.attentionTypeId, id))
      .orderBy(desc(attentionReports.reportDate))
      .limit(10),
  ])

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{type.name}</h1>
          <p className="text-sm text-muted-foreground">Detalle del concepto de atención.</p>
        </div>
        <Button variant="outline" render={<Link href="/admin/attention-concepts" />}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Código">{type.code}</DetailField>
            <DetailField label="Orden">{type.sortOrder}</DetailField>
            <DetailField label="Requiere descripción">
              {type.requiresDescription ? 'Sí' : 'No'}
            </DetailField>
            <DetailField label="Estado">
              <Badge variant={type.isActive ? 'default' : 'secondary'}>
                {type.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Reportes">{formatNumber(stats.reportCount)}</DetailField>
            <DetailField label="Atenciones">
              {formatNumber(Number(stats.totalAttentions))}
            </DetailField>
            <DetailField label="Operativos">
              {formatNumber(Number(stats.operativeCount))}
            </DetailField>
            <DetailField label="Módulos">{formatNumber(Number(stats.moduleCount))}</DetailField>
          </dl>
        </CardContent>
      </Card>

      <DataTable
        items={operativeTotals}
        emptyMessage="Este concepto no tiene actividad por operativo"
        getRowKey={(row) => row.id}
        columns={[
          { key: 'operative', label: 'Operativo', render: (row) => row.name },
          { key: 'year', label: 'Año', render: (row) => row.year },
          { key: 'total', label: 'Atenciones', render: (row) => formatNumber(Number(row.total)) },
        ]}
      />

      <DataTable
        items={recentReports}
        emptyMessage="No hay reportes recientes con este concepto"
        getRowKey={(report) => report.id}
        columns={[
          { key: 'date', label: 'Fecha', render: (report) => formatDate(report.reportDate) },
          { key: 'operative', label: 'Operativo', render: (report) => report.operativeName },
          { key: 'module', label: 'Módulo', render: (report) => report.moduleName },
          { key: 'quantity', label: 'Cantidad', render: (report) => formatNumber(report.quantity) },
        ]}
        actions={{
          render: (report) => (
            <Button variant="outline" render={<Link href={`/attentions/${report.id}`} />}>
              Ver
            </Button>
          ),
        }}
      />
    </div>
  )
}
