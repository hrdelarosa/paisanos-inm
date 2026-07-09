'use server'

import { desc, eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { operatives } from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { OperativeSeason } from '@/src/modules/domain/constants'
import { requireSession } from '@/src/modules/domain/auth'

export interface CreateOperativeInput {
  name: string
  season: OperativeSeason
  year: number
  startDate: string
  endDate: string
}

export async function listOperativesAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(operatives).orderBy(desc(operatives.year))
}

export async function createOperativeAction(input: CreateOperativeInput) {
  await requireSession(['admin'])

  await db.insert(operatives).values({
    id: createId(),
    name: input.name,
    season: input.season,
    year: input.year,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
  })

  return { success: true }
}

export async function toggleOperativeStatusAction({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) {
  await requireSession(['admin'])

  await db.update(operatives).set({ isActive }).where(eq(operatives.id, id))

  return { success: true }
}
