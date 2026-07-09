'use server'

import { count, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/src/db'
import {
  attentionReportItems,
  attentionReports,
  modules,
  operatives,
} from '@/src/db/schema'
import { requireSession } from '@/src/modules/domain/auth'

export async function getDashboardStatsAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  const [totalAttentions] = await db
    .select({ total: sql<number>`coalesce(sum(${attentionReportItems.quantity}), 0)` })
    .from(attentionReportItems)

  const [activeModules] = await db
    .select({ total: count() })
    .from(modules)
    .where(eq(modules.isActive, true))

  const [activeOperatives] = await db
    .select({ total: count() })
    .from(operatives)
    .where(eq(operatives.isActive, true))

  const [todayReports] = await db
    .select({ total: count() })
    .from(attentionReports)
    .where(
      sql`date(${attentionReports.reportDate} / 1000, 'unixepoch') = date('now')`,
    )

  const latestReports = await db
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
    .groupBy(attentionReports.id)
    .orderBy(desc(attentionReports.createdAt))
    .limit(5)

  return {
    totalAttentions: Number(totalAttentions.total ?? 0),
    activeModules: activeModules.total,
    activeOperatives: activeOperatives.total,
    todayReports: todayReports.total,
    latestReports,
  }
}
