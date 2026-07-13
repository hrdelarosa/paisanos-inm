import { z } from 'zod'

export const createAssignmentSchema = z.object({
  userId: z.string().min(1),
  moduleId: z.string().min(1, { message: 'El módulo es requerido' }),
  operativeId: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha no es válida' }),
})

export const closeAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha no es válida' }),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
export type CloseAssignmentInput = z.infer<typeof closeAssignmentSchema>
