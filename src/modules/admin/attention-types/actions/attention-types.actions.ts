'use server'

import { asc } from 'drizzle-orm'
import { db } from '@/src/db'
import { attentionTypes } from '@/src/db/schema'
import { requireSession } from '@/src/modules/domain/auth'

export async function listAttentionTypesAction() {
  await requireSession(['admin', 'enlace', 'capturista'])

  return db.select().from(attentionTypes).orderBy(asc(attentionTypes.sortOrder))
}
