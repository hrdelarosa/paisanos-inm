'use server'

import { asc, eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { modules } from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { requireSession } from '@/src/utils/auth'
import { CreateModuleInput } from '../types/modules.types'

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
  input: CreateModuleInput
}) {
  await requireSession(['admin'])

  await db.insert(modules).values({ id: createId(), ...input })

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

  await db.update(modules).set({ isActive }).where(eq(modules.id, id))

  return { success: true }
}
