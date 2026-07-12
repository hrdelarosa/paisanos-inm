export function getSelectableYears(): string[] {
  const currentYear = new Date().getFullYear()
  const startYear = 2020
  const endYear = currentYear + 8
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) =>
    (endYear - index).toString(),
  )

  return years
}
