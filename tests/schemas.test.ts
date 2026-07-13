import test from 'node:test'
import assert from 'node:assert/strict'

import { createAttentionReportActionSchema } from '@/src/modules/attentions/schema/attentions.schema'
import { createUserFormSchema } from '@/src/modules/admin/users/schema/users.schema'
import { createAssignmentSchema } from '@/src/modules/admin/users/schema/assignments.schema'

test('attention report action schema rejects fractional quantities', () => {
  const result = createAttentionReportActionSchema.safeParse({
    operativeId: 'operative-id',
    moduleId: 'module-id',
    reportDate: '2026-07-13',
    items: [{ attentionTypeId: 'type-id', quantity: 1.5 }],
  })

  assert.equal(result.success, false)
})

test('user schema requires capturista module', () => {
  const result = createUserFormSchema.safeParse({
    name: 'Capturista Uno',
    username: 'capturista1',
    role: 'capturista',
    password: 'una-contrasena-segura',
    moduleId: '',
  })

  assert.equal(result.success, false)
})

test('assignment schema accepts valid date-only payload', () => {
  const result = createAssignmentSchema.safeParse({
    userId: 'user-id',
    moduleId: 'module-id',
    operativeId: 'operative-id',
    startDate: '2026-07-13',
  })

  assert.equal(result.success, true)
})
