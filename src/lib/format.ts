export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString('es-MX', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('es-MX').format(value)
}
