import Link from 'next/link'
import { notFound } from 'next/navigation'
import { desc, eq, sql } from 'drizzle-orm'

import DataTable from '@/src/components/DataTable'
import DetailField from '@/src/components/detail-field'
import StatusBadge from '@/src/components/status-badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { OPERATIVE_SEASONS } from '@/src/constants/dominio'
import { db } from '@/src/db'
import { attentionReportItems, attentionReports, modules, operatives } from '@/src/db/schema'
import { formatDate, formatNumber } from '@/src/lib/format'

export default async function OperativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [operative] = await db
    .select()
    .from(operatives)
    .where(eq(operatives.id, id))

  if (!operative) notFound()

  const [[stats], moduleTotals] = await Promise.all([
    db
      .select({
        reportCount: sql<number>`count(distinct ${attentionReports.id})`,
        totalAttentions: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
        moduleCount: sql<number>`count(distinct ${attentionReports.moduleId})`,
        reporterCount: sql<number>`count(distinct ${attentionReports.userId})`,
      })
      .from(attentionReports)
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.operativeId, id)),
    db
      .select({
        id: modules.id,
        name: modules.name,
        municipality: modules.municipality,
        reportCount: sql<number>`count(distinct ${attentionReports.id})`,
        total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
      })
      .from(attentionReports)
      .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.operativeId, id))
      .groupBy(modules.id)
      .orderBy(desc(sql`coalesce(sum(${attentionReportItems.quantity}), 0)`)),
  ])

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{operative.name}</h1>
          <p className="text-sm text-muted-foreground">Detalle del operativo.</p>
        </div>
        <Button variant="outline" render={<Link href="/admin/operatives" />}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Temporada">{OPERATIVE_SEASONS[operative.season]}</DetailField>
            <DetailField label="Año">{operative.year}</DetailField>
            <DetailField label="Inicio">{formatDate(operative.startDate)}</DetailField>
            <DetailField label="Fin">{formatDate(operative.endDate)}</DetailField>
            <DetailField label="Estatus">
              <StatusBadge isActive={operative.isActive} />
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Reportes">{formatNumber(stats.reportCount)}</DetailField>
            <DetailField label="Atenciones">
              {formatNumber(Number(stats.totalAttentions))}
            </DetailField>
            <DetailField label="Módulos">{formatNumber(Number(stats.moduleCount))}</DetailField>
            <DetailField label="Capturistas">
              {formatNumber(Number(stats.reporterCount))}
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <DataTable
        items={moduleTotals}
        emptyMessage="No hay módulos con reportes en este operativo"
        getRowKey={(module) => module.id}
        columns={[
          { key: 'module', label: 'Módulo', render: (module) => module.name },
          { key: 'municipality', label: 'Municipio', render: (module) => module.municipality },
          { key: 'reports', label: 'Reportes', render: (module) => formatNumber(Number(module.reportCount)) },
          { key: 'total', label: 'Atenciones', render: (module) => formatNumber(Number(module.total)) },
        ]}
        actions={{
          render: (module) => (
            <Button variant="outline" render={<Link href={`/admin/modules/${module.id}`} />}>
              Ver
            </Button>
          ),
        }}
      />
    </div>
  )
}
