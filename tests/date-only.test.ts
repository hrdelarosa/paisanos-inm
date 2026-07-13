import test from 'node:test'
import assert from 'node:assert/strict'

import { parseDateOnly, toDateOnlyInputValue } from '@/src/lib/dateOnly'
import { formatDate } from '@/src/lib/format'

test('parseDateOnly creates UTC calendar date', () => {
  const date = parseDateOnly('2026-07-13')

  assert.ok(date)
  assert.equal(date.toISOString(), '2026-07-13T00:00:00.000Z')
})

test('formatDate preserves date-only day with UTC timezone', () => {
  const date = parseDateOnly('2026-07-13')

  assert.ok(date)
  assert.match(formatDate(date), /13/)
})

test('toDateOnlyInputValue formats local date for inputs', () => {
  const value = toDateOnlyInputValue(new Date(2026, 6, 13))

  assert.equal(value, '2026-07-13')
})
