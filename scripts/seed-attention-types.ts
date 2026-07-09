import 'dotenv/config'

import { db } from '@/src/db'
import { attentionTypes } from '@/src/db/schema'
import { ATTENTION_TYPE_SEED } from '@/src/modules/domain/constants'
import { createId } from '@/src/lib/id'

async function main() {
  await db
    .insert(attentionTypes)
    .values(
      ATTENTION_TYPE_SEED.map((name, index) => ({
        id: createId(),
        code: index + 1,
        name,
        sortOrder: index + 1,
        requiresDescription: name === 'Otro',
      })),
    )
    .onConflictDoNothing()

  console.log('Conceptos de atención creados o ya existentes')
  process.exit(0)
}

main().catch((error) => {
  console.error('Error al crear los conceptos de atención:', error)
  process.exit(1)
})
