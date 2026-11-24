import type { Spreadsheet } from "./core/table"
import type { Messages } from "./types"

export function Preview({
  table,
  messages: m,
  lang,
}: {
  table: Spreadsheet
  messages: Messages
  lang: string
}) {
  const rows = table.rows.slice(0, 10)
  const headings = table.headings.slice(0, 16)
  const formatter = new Intl.NumberFormat(lang)
  const counts = {
    rows: rows.length,
    totalRows: table.rows.length,
    columns: headings.length,
    totalColumns: table.headings.length,
  }
  const summary = m.previewCount.replace(
    /\{(rows|totalRows|columns|totalColumns)\}/g,
    (_, key: keyof typeof counts) => formatter.format(counts[key])
  )
  return (
    <div className="space-y-2">
      <div
        dir="ltr"
        role="region"
        aria-label={m.preview}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Make the scrollable preview keyboard-scrollable.
        tabIndex={0}
        className="max-h-72 overflow-auto rounded-md border"
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted">
            <tr>
              {headings.map((heading) => (
                <th
                  key={heading}
                  dir="auto"
                  scope="col"
                  className="max-w-48 border-s border-b px-3 py-2 text-left font-medium first:border-s-0"
                >
                  <span className="block truncate" title={heading}>
                    {heading}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b last:border-b-0 even:bg-muted/30"
              >
                {headings.map((heading, column) => {
                  const value = String(row[column] ?? "")
                  return (
                    <td
                      key={heading}
                      dir="auto"
                      className="max-w-48 border-s px-3 py-2 [text-align:match-parent] first:border-s-0"
                    >
                      <span
                        className="block truncate whitespace-pre"
                        title={value}
                      >
                        {value}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" className="text-xs text-muted-foreground">
        {summary}
      </p>
    </div>
  )
}
