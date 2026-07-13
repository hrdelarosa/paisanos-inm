'use server'

import { desc, eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { operatives } from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { requireSession } from '@/src/utils/auth'
import { parseDateOnly } from '@/src/lib/dateOnly'
import { createOperativeFormSchema } from '../schema/operatives.schema'

export async function listOperativesAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(operatives).orderBy(desc(operatives.year))
}

export async function createOperativeAction({
  input,
}: {
  input: unknown
}) {
  await requireSession(['admin'])
  const parsed = createOperativeFormSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const startDate = parseDateOnly(parsed.data.startDate)
  const endDate = parseDateOnly(parsed.data.endDate)

  if (!startDate || !endDate) {
    return { success: false, error: 'Las fechas no son válidas' }
  }

  await db.insert(operatives).values({
    id: createId(),
    name: parsed.data.name,
    season: parsed.data.season,
    year: parsed.data.year,
    startDate,
    endDate,
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

  if (!id) return { success: false, error: 'El operativo no es válido' }

  await db.update(operatives).set({ isActive }).where(eq(operatives.id, id))

  return { success: true }
}
