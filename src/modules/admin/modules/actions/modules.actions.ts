'use server'

import { asc, eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { modules } from '@/src/db/schema'
import { createId } from '@/src/lib/id'
import { ModuleType } from '@/src/modules/domain/constants'
import { requireSession } from '@/src/modules/domain/auth'

export interface CreateModuleInput {
  name: string
  type: ModuleType
  location: string
  municipality: string
  state: string
}

export async function listModulesAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(modules).orderBy(asc(modules.name))
}

export async function createModuleAction(input: CreateModuleInput) {
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
