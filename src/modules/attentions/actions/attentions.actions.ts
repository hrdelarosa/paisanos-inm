'use server'

import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/src/db'
import {
  attentionReportItems,
  attentionReports,
  attentionTypes,
  modules,
  operatives,
  user,
} from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { requireSession } from '@/src/utils/auth'

export interface CreateAttentionReportInput {
  operativeId: string
  moduleId: string
  reportDate: string
  notes?: string
  items: Array<{
    attentionTypeId: string
    quantity: number
    description?: string
  }>
}

export async function listAttentionReportsAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db
    .select({
      id: attentionReports.id,
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
    .groupBy(attentionReports.id)
    .orderBy(desc(attentionReports.reportDate))
}

export async function getAttentionReportAction(id: string) {
  await requireSession(['admin', 'enlace', 'capturista'])

  const [report] = await db
    .select({
      id: attentionReports.id,
      reportDate: attentionReports.reportDate,
      status: attentionReports.status,
      notes: attentionReports.notes,
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

  return { report, items }
}

export async function createAttentionReportAction(
  input: CreateAttentionReportInput,
) {
  const session = await requireSession(['admin', 'enlace', 'capturista'])
  const reportId = createId()
  const items = input.items.filter((item) => item.quantity > 0)

  if (items.length === 0) {
    return { success: false, error: 'Captura al menos una atención' }
  }

  await db.insert(attentionReports).values({
    id: reportId,
    operativeId: input.operativeId,
    moduleId: input.moduleId,
    userId: session.user.id,
    reportDate: new Date(input.reportDate),
    notes: input.notes,
    status: 'submitted',
  })

  await db.insert(attentionReportItems).values(
    items.map((item) => ({
      id: createId(),
      reportId,
      attentionTypeId: item.attentionTypeId,
      quantity: item.quantity,
      description: item.description,
    })),
  )

  return { success: true, id: reportId }
}

export async function markAttentionReportReviewedAction(id: string) {
  await requireSession(['admin', 'enlace'])

  await db
    .update(attentionReports)
    .set({ status: 'reviewed' })
    .where(and(eq(attentionReports.id, id)))

  return { success: true }
}
