import Link from 'next/link'
import { notFound } from 'next/navigation'
import { desc, eq, sql } from 'drizzle-orm'

import DataTable from '@/src/components/DataTable'
import DetailField from '@/src/components/detail-field'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { USER_ROLES } from '@/src/constants/dominio'
import { db } from '@/src/db'
import {
  attentionReportItems,
  attentionReports,
  moduleAssignments,
  modules,
  operatives,
  user,
  userProfiles,
} from '@/src/db/schema'
import { formatDate, formatNumber } from '@/src/lib/format'
import {
  AssignmentCreateDialog,
  CloseAssignmentButton,
} from '@/src/modules/admin/users/components/AssignmentManager'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [selectedUser] = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      createdAt: user.createdAt,
      moduleName: modules.name,
    })
    .from(user)
    .leftJoin(userProfiles, eq(user.id, userProfiles.userId))
    .leftJoin(modules, eq(userProfiles.moduleId, modules.id))
    .where(eq(user.id, id))

  if (!selectedUser) notFound()

  const [
    [stats],
    captureHistory,
    assignments,
    recentReports,
    moduleOptions,
    operativeOptions,
  ] = await Promise.all([
    db
      .select({
        reportCount: sql<number>`count(distinct ${attentionReports.id})`,
        totalAttentions: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
        operativeCount: sql<number>`count(distinct ${attentionReports.operativeId})`,
        moduleCount: sql<number>`count(distinct ${attentionReports.moduleId})`,
      })
      .from(attentionReports)
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.userId, id)),
    db
      .select({
        operativeId: operatives.id,
        operativeName: operatives.name,
        moduleName: modules.name,
        reportCount: sql<number>`count(distinct ${attentionReports.id})`,
        total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
      })
      .from(attentionReports)
      .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
      .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.userId, id))
      .groupBy(operatives.id, modules.id)
      .orderBy(desc(sql`coalesce(sum(${attentionReportItems.quantity}), 0)`)),
    db
      .select({
        id: moduleAssignments.id,
        moduleName: modules.name,
        operativeName: operatives.name,
        startDate: moduleAssignments.startDate,
        endDate: moduleAssignments.endDate,
        isActive: moduleAssignments.isActive,
      })
      .from(moduleAssignments)
      .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
      .leftJoin(operatives, eq(moduleAssignments.operativeId, operatives.id))
      .where(eq(moduleAssignments.userId, id))
      .orderBy(desc(moduleAssignments.startDate)),
    db
      .select({
        id: attentionReports.id,
        reportDate: attentionReports.reportDate,
        moduleName: modules.name,
        operativeName: operatives.name,
        total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
      })
      .from(attentionReports)
      .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
      .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
      .leftJoin(
        attentionReportItems,
        eq(attentionReports.id, attentionReportItems.reportId),
      )
      .where(eq(attentionReports.userId, id))
      .groupBy(attentionReports.id)
      .orderBy(desc(attentionReports.reportDate))
      .limit(10),
    db
      .select({ id: modules.id, name: modules.name })
      .from(modules)
      .where(eq(modules.isActive, true)),
    db
      .select({ id: operatives.id, name: operatives.name })
      .from(operatives)
      .where(eq(operatives.isActive, true)),
  ])

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{selectedUser.name}</h1>
          <p className="text-sm text-muted-foreground">Detalle del usuario.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/admin/users" />}>
            Volver
          </Button>
          <AssignmentCreateDialog
            userId={selectedUser.id}
            modules={moduleOptions}
            operatives={operativeOptions}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-4">
            <DetailField label="Usuario">{selectedUser.username || '-'}</DetailField>
            <DetailField label="Rol">
              {selectedUser.role && selectedUser.role in USER_ROLES
                ? USER_ROLES[selectedUser.role as keyof typeof USER_ROLES]
                : '-'}
            </DetailField>
            <DetailField label="Módulo actual">
              {selectedUser.moduleName || 'Sin módulo asignado'}
            </DetailField>
            <DetailField label="Estado">
              <Badge variant={selectedUser.banned ? 'destructive' : 'default'}>
                {selectedUser.banned ? 'Bloqueado' : 'Activo'}
              </Badge>
            </DetailField>
            <DetailField label="Creado">{formatDate(selectedUser.createdAt)}</DetailField>
            {selectedUser.banReason && (
              <DetailField label="Motivo de bloqueo">
                {selectedUser.banReason}
              </DetailField>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actividad capturada</CardTitle>
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
        items={captureHistory}
        emptyMessage="No hay actividad capturada por este usuario"
        getRowKey={(row) => `${row.operativeId}-${row.moduleName}`}
        columns={[
          { key: 'operative', label: 'Operativo', render: (row) => row.operativeName },
          { key: 'module', label: 'Módulo', render: (row) => row.moduleName },
          { key: 'reports', label: 'Reportes', render: (row) => formatNumber(Number(row.reportCount)) },
          { key: 'total', label: 'Atenciones', render: (row) => formatNumber(Number(row.total)) },
        ]}
      />

      <DataTable
        items={assignments}
        emptyMessage="No hay asignaciones formales registradas"
        getRowKey={(assignment) => assignment.id}
        columns={[
          { key: 'module', label: 'Módulo', render: (assignment) => assignment.moduleName },
          { key: 'operative', label: 'Operativo', render: (assignment) => assignment.operativeName || '-' },
          { key: 'start', label: 'Inicio', render: (assignment) => formatDate(assignment.startDate) },
          { key: 'end', label: 'Fin', render: (assignment) => assignment.endDate ? formatDate(assignment.endDate) : 'Actual' },
          { key: 'status', label: 'Estado', render: (assignment) => assignment.isActive ? 'Activa' : 'Cerrada' },
        ]}
        actions={{
          render: (assignment) =>
            assignment.isActive ? (
              <CloseAssignmentButton assignmentId={assignment.id} />
            ) : null,
        }}
      />

      <DataTable
        items={recentReports}
        emptyMessage="No hay reportes recientes"
        getRowKey={(report) => report.id}
        columns={[
          { key: 'date', label: 'Fecha', render: (report) => formatDate(report.reportDate) },
          { key: 'operative', label: 'Operativo', render: (report) => report.operativeName },
          { key: 'module', label: 'Módulo', render: (report) => report.moduleName },
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
