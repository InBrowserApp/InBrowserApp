export type Sort = { column: number; direction: "ascending" | "descending" }
export type Filter = { column: number | null; query: string }

export function columnLetter(column: number) {
  let letter = ""
  for (
    let position = column + 1;
    position > 0;
    position = Math.floor((position - 1) / 26)
  ) {
    letter = String.fromCharCode(65 + ((position - 1) % 26)) + letter
  }
  return letter
}

export function moveColumn(columns: number[], from: number, to: number) {
  const order = [...columns]
  const [column] = order.splice(from, 1)
  order.splice(to, 0, column!)
  return order
}

export function editCell(
  rows: string[][],
  row: number,
  column: number,
  value: string
) {
  const previous = rows[row]!
  if ((previous[column] ?? "") === value) return rows

  const record = [...previous]
  while (record.length < column) record.push("")
  record[column] = value
  const updated = [...rows]
  updated[row] = record
  return updated
}

export function sortRows(
  rows: string[][],
  firstRow: number,
  sort: Sort | null,
  locale: string
) {
  const indexes = Array.from(
    { length: rows.length - firstRow },
    (_, index) => index + firstRow
  )
  if (!sort) return indexes

  const { column, direction } = sort
  const values = rows.map((row) => (row[column] ?? "").trim())
  const populated = values.slice(firstRow).filter(Boolean)
  let compare: (a: string, b: string) => number
  if (populated.every((value) => /^[+-]?\d+$/.test(value))) {
    compare = (a, b) => Number(BigInt(a) - BigInt(b))
  } else if (
    populated.every(
      (value) =>
        /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value) &&
        Number.isFinite(Number(value))
    )
  ) {
    compare = (a, b) => Number(a) - Number(b)
  } else {
    compare = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })
      .compare
  }
  const sign = direction === "ascending" ? 1 : -1

  return indexes.sort((left, right) => {
    const a = values[left]
    const b = values[right]
    if (!a || !b) return Number(!a) - Number(!b)
    return sign * compare(a, b)
  })
}

export function filterRows(
  rows: string[][],
  indexes: number[],
  filter: Filter,
  locale: string
) {
  const query = filter.query.trim().toLocaleLowerCase(locale)
  if (!query) return indexes

  const { column } = filter
  const matches = (value: string) =>
    value.toLocaleLowerCase(locale).includes(query)
  return indexes.filter((index) =>
    column === null
      ? rows[index]!.some(matches)
      : matches(rows[index]![column] ?? "")
  )
}
