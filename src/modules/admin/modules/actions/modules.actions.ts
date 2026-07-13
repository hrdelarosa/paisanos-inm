'use server'

import { asc, eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { modules } from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { requireSession } from '@/src/utils/auth'
import { createModuleFormSchema } from '../schema/modules.schema'

export async function modulesAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(modules).orderBy(asc(modules.name))
}

export async function moduleAction({ id }: { id: string }) {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(modules).where(eq(modules.id, id)).get()
}

export async function createModuleAction({
  input,
}: {
  input: unknown
}) {
  await requireSession(['admin'])
  const parsed = createModuleFormSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await db.insert(modules).values({ id: createId(), ...parsed.data })

  return { success: true }
}

export async function toggleModuleStatusAction({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) {
  await requireSession(['admin'])

  if (!id) return { success: false, error: 'El módulo no es válido' }

  await db.update(modules).set({ isActive }).where(eq(modules.id, id))

  return { success: true }
}
