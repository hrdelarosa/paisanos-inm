'use server'

import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { db } from '@/src/db'
import { moduleAssignments, modules, operatives } from '@/src/db/schema'
import { auth } from '@/src/lib/auth'
import { parseDateOnly } from '@/src/lib/dateOnly'
import { createId } from '@/src/lib/id'
import {
  closeAssignmentSchema,
  createAssignmentSchema,
} from '../schema/assignments.schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('No autorizado')
  }

  return session
}

export async function createAssignmentAction(input: unknown) {
  await requireAdmin()
  const parsed = createAssignmentSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const startDate = parseDateOnly(parsed.data.startDate)

  if (!startDate) return { success: false, error: 'La fecha no es válida' }

  const [module] = await db
    .select({ id: modules.id })
    .from(modules)
    .where(and(eq(modules.id, parsed.data.moduleId), eq(modules.isActive, true)))
    .limit(1)

  if (!module) return { success: false, error: 'El módulo no está activo' }

  if (parsed.data.operativeId) {
    const [operative] = await db
      .select({ id: operatives.id, startDate: operatives.startDate, endDate: operatives.endDate })
      .from(operatives)
      .where(and(eq(operatives.id, parsed.data.operativeId), eq(operatives.isActive, true)))
      .limit(1)

    if (!operative) return { success: false, error: 'El operativo no está activo' }

    if (startDate < operative.startDate || startDate > operative.endDate) {
      return { success: false, error: 'La asignación debe iniciar dentro del operativo' }
    }
  }

  const [activeAssignment] = await db
    .select({ id: moduleAssignments.id })
    .from(moduleAssignments)
    .where(
      and(
        eq(moduleAssignments.userId, parsed.data.userId),
        eq(moduleAssignments.moduleId, parsed.data.moduleId),
        eq(moduleAssignments.isActive, true),
      ),
    )
    .limit(1)

  if (activeAssignment) {
    return { success: false, error: 'El usuario ya tiene una asignación activa en este módulo' }
  }

  await db.insert(moduleAssignments).values({
    id: createId(),
    userId: parsed.data.userId,
    moduleId: parsed.data.moduleId,
    operativeId: parsed.data.operativeId || null,
    startDate,
    isActive: true,
  })

  return { success: true }
}

export async function closeAssignmentAction(input: unknown) {
  await requireAdmin()
  const parsed = closeAssignmentSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' }
  }

  const endDate = parseDateOnly(parsed.data.endDate)

  if (!endDate) return { success: false, error: 'La fecha no es válida' }

  const [assignment] = await db
    .select({ startDate: moduleAssignments.startDate })
    .from(moduleAssignments)
    .where(eq(moduleAssignments.id, parsed.data.assignmentId))
    .limit(1)

  if (!assignment) return { success: false, error: 'La asignación no existe' }

  if (endDate < assignment.startDate) {
    return { success: false, error: 'La fecha final no puede ser anterior al inicio' }
  }

  await db
    .update(moduleAssignments)
    .set({ endDate, isActive: false })
    .where(eq(moduleAssignments.id, parsed.data.assignmentId))

  return { success: true }
}
