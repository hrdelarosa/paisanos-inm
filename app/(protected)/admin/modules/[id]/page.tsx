import Link from 'next/link'
import { notFound } from 'next/navigation'
import { desc, eq, sql } from 'drizzle-orm'

import DataTable from '@/src/components/DataTable'
import DetailField from '@/src/components/detail-field'
import StatusBadge from '@/src/components/status-badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { MODULE_TYPES } from '@/src/constants/dominio'
import { db } from '@/src/db'
import {
  attentionReportItems,
  attentionReports,
  modules,
  operatives,
  user,
} from '@/src/db/schema'
import { formatDate, formatNumber } from '@/src/lib/format'

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [module] = await db.select().from(modules).where(eq(modules.id, id))

  if (!module) notFound()

  const [[stats], recentReports] = await Promise.all([
    db
      .select({
        reportCount: sql<number>`count(distinct ${attentionReports.id})`,
        totalAttentions: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
        operativeCount: sql<number>`count(distinct ${attentionReports.operativeId})`,
        reporterCount: sql<number>`count(distinct ${attentionReports.userId})`,
      })
      .from(attentionReports)
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.moduleId, id)),
    db
      .select({
        id: attentionReports.id,
        reportDate: attentionReports.reportDate,
        operativeName: operatives.name,
        userName: user.name,
        total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
      })
      .from(attentionReports)
      .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
      .innerJoin(user, eq(attentionReports.userId, user.id))
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.moduleId, id))
      .groupBy(attentionReports.id)
      .orderBy(desc(attentionReports.reportDate))
      .limit(10),
  ])

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{module.name}</h1>
          <p className="text-sm text-muted-foreground">Detalle del módulo.</p>
        </div>
        <Button variant="outline" render={<Link href="/admin/modules" />}>
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-3">
            <DetailField label="Tipo">{MODULE_TYPES[module.type]}</DetailField>
            <DetailField label="Ubicación">{module.location}</DetailField>
            <DetailField label="Municipio">{module.municipality}</DetailField>
            <DetailField label="Estado">{module.state}</DetailField>
            <DetailField label="Estatus">
              <StatusBadge isActive={module.isActive} />
            </DetailField>
            <DetailField label="Creado">{formatDate(module.createdAt)}</DetailField>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen operativo</CardTitle>
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
            <DetailField label="Capturistas">
              {formatNumber(Number(stats.reporterCount))}
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <DataTable
        items={recentReports}
        emptyMessage="No hay reportes registrados en este módulo"
        getRowKey={(report) => report.id}
        columns={[
          { key: 'date', label: 'Fecha', render: (report) => formatDate(report.reportDate) },
          { key: 'operative', label: 'Operativo', render: (report) => report.operativeName },
          { key: 'user', label: 'Capturó', render: (report) => report.userName },
          { key: 'total', label: 'Total', render: (report) => formatNumber(Number(report.total)) },
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
