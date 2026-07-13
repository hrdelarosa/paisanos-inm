'use server'

import { and, desc, eq, or, sql } from 'drizzle-orm'
import { db } from '@/src/db'
import {
  attentionReportItems,
  attentionReports,
  attentionTypes,
  modules,
  operatives,
  user,
  userProfiles,
} from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { requireSession } from '@/src/utils/auth'
import { parseDateOnly } from '@/src/lib/dateOnly'
import { createAttentionReportActionSchema } from '../schema/attentions.schema'

export async function listAttentionReportsAction() {
  const session = await requireSession(['admin', 'enlace', 'capturista'])
  const role = session.user.role

  const [profile] =
    role === 'capturista'
      ? await db
          .select({ moduleId: userProfiles.moduleId })
          .from(userProfiles)
          .where(eq(userProfiles.userId, session.user.id))
          .limit(1)
      : []

  const scopedWhere =
    role === 'capturista'
      ? or(
          eq(attentionReports.userId, session.user.id),
          profile?.moduleId
            ? eq(attentionReports.moduleId, profile.moduleId)
            : eq(attentionReports.userId, session.user.id),
        )
      : undefined

  return db
    .select({
      id: attentionReports.id,
      moduleId: attentionReports.moduleId,
      userId: attentionReports.userId,
      reportDate: attentionReports.reportDate,
      status: attentionReports.status,
      operativeName: operatives.name,
      moduleName: modules.name,
      userName: user.name,
      total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)`,
    })
    .from(attentionReports)
    .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
    .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
    .innerJoin(user, eq(attentionReports.userId, user.id))
    .leftJoin(
      attentionReportItems,
      eq(attentionReports.id, attentionReportItems.reportId),
    )
    .where(scopedWhere)
    .groupBy(attentionReports.id)
    .orderBy(desc(attentionReports.reportDate))
}

export async function getAttentionReportAction(id: string) {
  const session = await requireSession(['admin', 'enlace', 'capturista'])

  const [report] = await db
    .select({
      id: attentionReports.id,
      moduleId: attentionReports.moduleId,
      userId: attentionReports.userId,
      reportDate: attentionReports.reportDate,
      status: attentionReports.status,
      notes: attentionReports.notes,
      reviewedAt: attentionReports.reviewedAt,
      reviewedBy: attentionReports.reviewedBy,
      operativeName: operatives.name,
      moduleName: modules.name,
      userName: user.name,
    })
    .from(attentionReports)
    .innerJoin(operatives, eq(attentionReports.operativeId, operatives.id))
    .innerJoin(modules, eq(attentionReports.moduleId, modules.id))
    .innerJoin(user, eq(attentionReports.userId, user.id))
    .where(eq(attentionReports.id, id))

  if (!report) return null

  if (session.user.role === 'capturista') {
    const [profile] = await db
      .select({ moduleId: userProfiles.moduleId })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1)

    if (report.userId !== session.user.id && profile?.moduleId !== report.moduleId) {
      throw new Error('No autorizado')
    }
  }

  const items = await db
    .select({
      id: attentionReportItems.id,
      quantity: attentionReportItems.quantity,
      description: attentionReportItems.description,
      code: attentionTypes.code,
      name: attentionTypes.name,
    })
    .from(attentionReportItems)
    .innerJoin(
      attentionTypes,
      eq(attentionReportItems.attentionTypeId, attentionTypes.id),
    )
    .where(eq(attentionReportItems.reportId, id))
    .orderBy(attentionTypes.sortOrder)

  const [reviewer] = report.reviewedBy
    ? await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, report.reviewedBy))
        .limit(1)
    : []

  return { report: { ...report, reviewedByName: reviewer?.name ?? null }, items }
}

export async function createAttentionReportAction(input: unknown) {
  const session = await requireSession(['admin', 'enlace', 'capturista'])
  const parsed = createAttentionReportActionSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data
  const reportDate = parseDateOnly(data.reportDate)

  if (!reportDate) return { success: false, error: 'La fecha no es válida' }

  const reportId = createId()
  const items = data.items.filter((item) => item.quantity > 0)

  if (items.length === 0) {
    return { success: false, error: 'Captura al menos una atención' }
  }

  const [operative] = await db
    .select()
    .from(operatives)
    .where(and(eq(operatives.id, data.operativeId), eq(operatives.isActive, true)))
    .limit(1)

  if (!operative) return { success: false, error: 'El operativo no está activo' }

  if (reportDate < operative.startDate || reportDate > operative.endDate) {
    return {
      success: false,
      error: 'La fecha del reporte debe estar dentro del periodo del operativo',
    }
  }

  const [module] = await db
    .select({ id: modules.id })
    .from(modules)
    .where(and(eq(modules.id, data.moduleId), eq(modules.isActive, true)))
    .limit(1)

  if (!module) return { success: false, error: 'El módulo no está activo' }

  if (session.user.role === 'capturista') {
    const [profile] = await db
      .select({ moduleId: userProfiles.moduleId })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1)

    if (!profile?.moduleId || profile.moduleId !== data.moduleId) {
      return { success: false, error: 'No puedes capturar en este módulo' }
    }
  }

  const submittedTypeIds = new Set(items.map((item) => item.attentionTypeId))
  const activeTypes = await db
    .select({
      id: attentionTypes.id,
      requiresDescription: attentionTypes.requiresDescription,
    })
    .from(attentionTypes)
    .where(eq(attentionTypes.isActive, true))

  const activeTypeMap = new Map(activeTypes.map((type) => [type.id, type]))

  for (const attentionTypeId of submittedTypeIds) {
    if (!activeTypeMap.has(attentionTypeId)) {
      return { success: false, error: 'El reporte contiene conceptos inactivos o inexistentes' }
    }
  }

  for (const item of items) {
    const type = activeTypeMap.get(item.attentionTypeId)

    if (type?.requiresDescription && !item.description?.trim()) {
      return { success: false, error: 'Hay conceptos que requieren descripción' }
    }
  }

  await db.transaction(async (tx) => {
    await tx.insert(attentionReports).values({
      id: reportId,
      operativeId: data.operativeId,
      moduleId: data.moduleId,
      userId: session.user.id,
      reportDate,
      notes: data.notes,
      status: 'submitted',
    })

    await tx.insert(attentionReportItems).values(
      items.map((item) => ({
        id: createId(),
        reportId,
        attentionTypeId: item.attentionTypeId,
        quantity: item.quantity,
        description: item.description,
      })),
    )
  })

  return { success: true, id: reportId }
}

export async function markAttentionReportReviewedAction(id: string) {
  const session = await requireSession(['admin', 'enlace'])

  await db
    .update(attentionReports)
    .set({ status: 'reviewed', reviewedBy: session.user.id, reviewedAt: new Date() })
    .where(and(eq(attentionReports.id, id)))

  return { success: true }
}
