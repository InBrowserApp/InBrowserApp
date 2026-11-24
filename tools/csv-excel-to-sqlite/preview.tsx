import { Input } from "@workspace/ui/components/ui/input"
import { columnNames } from "./names"
import type { Converter } from "./use-converter"
import type { Messages } from "./types"

export function TablePreview({
  table,
  messages: m,
  disabled,
  update,
}: {
  table: Converter["tables"][number]
  messages: Messages
  disabled: boolean
  update: Converter["update"]
}) {
  const { rows, width } = table.preview
  const headers = columnNames(rows, width, table.header).slice(0, 12)
  const start = table.header ? 1 : 0
  const data = rows.slice(start, start + 6)

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <label className="w-full space-y-1.5 text-sm font-medium sm:max-w-56">
          <span>{m.tableName}</span>
          <Input
            dir="auto"
            value={table.name}
            disabled={disabled}
            onChange={(event) =>
              update(table.key, { name: event.currentTarget.value })
            }
            onBlur={() => {
              if (table.name !== table.outputName)
                update(table.key, { name: table.outputName })
            }}
          />
        </label>
        <label className="flex min-h-9 items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 shrink-0 accent-primary"
            checked={table.header}
            disabled={disabled}
            onChange={(event) =>
              update(table.key, { header: event.currentTarget.checked })
            }
          />
          {m.header}
        </label>
      </div>
      <h3 className="text-sm font-medium" id="sqlite-table-preview">
        {m.preview}
      </h3>
      <div
        className="max-w-full overflow-x-auto rounded-md border"
        role="region"
        aria-labelledby="sqlite-table-preview"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The preview needs keyboard scrolling.
        tabIndex={0}
      >
        <table className="w-full text-start text-sm">
          <thead className="bg-muted/65">
            <tr>
              {headers.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="max-w-48 truncate border-b p-2.5 text-start font-medium"
                  title={column}
                >
                  <bdi>{column}</bdi>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-muted/25">
                {headers.map((column, index) => (
                  <td
                    key={column}
                    className="max-w-48 truncate p-2.5"
                    title={String(row[index] ?? "")}
                  >
                    <bdi>{row[index] ?? "—"}</bdi>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">{m.noRows}</p>
        ) : null}
      </div>
    </div>
  )
}
