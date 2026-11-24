import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { GripVertical } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { message, type Messages } from "../messages"
import type { Sort } from "../core/table"
import { CellEditor } from "./cell"
import { ColumnMenu } from "./column-menu"

type Address = { row: number; column: number }
type Props = {
  dir: "ltr" | "rtl"
  rows: string[][]
  pageRows: number[]
  columns: { id: number; name: string }[]
  hasHeader: boolean
  offset: number
  sort: Sort | null
  changeSort: (sort: Sort | null) => void
  edit: (row: number, column: number, value: string) => void
  move: (from: number, to: number) => void
  number: Intl.NumberFormat
  messages: Messages
  emptyMessage: string
}

const columnDragType = "application/x-inbrowser-csv-column"

export function Grid({
  dir,
  rows,
  pageRows,
  columns,
  hasHeader,
  offset,
  sort,
  changeSort,
  edit,
  move,
  number,
  messages: m,
  emptyMessage,
}: Props) {
  const viewport = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState<Address | null>(null)
  const [active, setActive] = useState<Address | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const base = hasHeader ? 1 : 0
  const tabStop =
    active && pageRows.includes(active.row)
      ? active
      : { row: pageRows[0], column: columns[0]?.id }

  useEffect(() => {
    viewport.current?.scrollTo({ top: 0 })
  }, [offset, sort])

  function cellButton(row: number, column: number) {
    return viewport.current?.querySelector<HTMLButtonElement>(
      `button[data-row="${row}"][data-column="${column}"]`
    )
  }

  function navigate(
    event: KeyboardEvent<HTMLButtonElement>,
    rowIndex: number,
    position: number
  ) {
    const step = dir === "rtl" ? -1 : 1
    switch (event.key) {
      case "ArrowUp":
        rowIndex--
        break
      case "ArrowDown":
        rowIndex++
        break
      case "ArrowLeft":
        position -= step
        break
      case "ArrowRight":
        position += step
        break
      default:
        return
    }
    event.preventDefault()
    const row = pageRows[rowIndex]
    const column = columns[position]
    if (row !== undefined && column) cellButton(row, column.id)?.focus()
  }

  function renderEditor(row: number, column: number, label: string) {
    const header = hasHeader && row === 0
    return (
      <CellEditor
        value={rows[row]?.[column] ?? ""}
        label={label}
        finish={(value, restoreFocus) => {
          edit(row, column, value)
          setEditing(null)
          if (restoreFocus) {
            requestAnimationFrame(() => {
              const target = header
                ? viewport.current?.querySelector<HTMLButtonElement>(
                    `th[data-header="${column}"] [data-column-menu]`
                  )
                : cellButton(row, column)
              const fallback =
                viewport.current?.querySelector<HTMLButtonElement>(
                  'button[data-row][tabindex="0"]'
                )
              const focusTarget = target ?? fallback ?? viewport.current
              focusTarget?.focus()
            })
          }
        }}
      />
    )
  }

  return (
    <div
      ref={viewport}
      className="max-h-[25rem] scroll-ps-12 scroll-pt-10 overflow-auto"
      tabIndex={-1}
      role="region"
      aria-label={m.tableName}
    >
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-20 bg-muted text-foreground">
          <tr>
            <th
              aria-hidden="true"
              className="sticky start-0 z-10 w-12 min-w-12 border-e border-b bg-muted px-2 py-1 text-center text-xs text-muted-foreground"
            >
              #
            </th>
            {columns.map(({ id: column, name }, index) => {
              const direction =
                sort?.column === column ? sort.direction : undefined
              return (
                <th
                  key={column}
                  scope="col"
                  data-header={column}
                  aria-label={name}
                  aria-sort={direction}
                  className={cn(
                    "min-w-36 border-e border-b text-start last:border-e-0",
                    over === index && "bg-accent ring-2 ring-primary ring-inset"
                  )}
                  onDragOver={(event) => {
                    if (!event.dataTransfer.types.includes(columnDragType))
                      return
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "move"
                    setOver(index)
                  }}
                  onDrop={(event) => {
                    const source = event.dataTransfer.getData(columnDragType)
                    if (!source) return
                    event.preventDefault()
                    const from = columns.findIndex(
                      ({ id }) => id === Number(source)
                    )
                    if (from >= 0 && from !== index) move(from, index)
                    setOver(null)
                  }}
                >
                  {hasHeader &&
                  editing?.row === 0 &&
                  editing.column === column ? (
                    renderEditor(0, column, name)
                  ) : (
                    <div className="flex min-h-10 items-center px-1.5">
                      {columns.length > 1 && (
                        <span
                          draggable
                          data-column-grip
                          aria-hidden="true"
                          className="hidden size-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground pointer-fine:flex"
                          onDragStart={(event) => {
                            event.dataTransfer.setData(
                              columnDragType,
                              String(column)
                            )
                            event.dataTransfer.effectAllowed = "move"
                          }}
                          onDragEnd={() => setOver(null)}
                        >
                          <GripVertical className="size-4" />
                        </span>
                      )}
                      <ColumnMenu
                        name={name}
                        dir={dir}
                        direction={direction}
                        changeSort={(next) =>
                          changeSort(next ? { column, direction: next } : null)
                        }
                        rename={
                          hasHeader
                            ? () => setEditing({ row: 0, column })
                            : undefined
                        }
                        moveEarlier={
                          index > 0 ? () => move(index, index - 1) : undefined
                        }
                        moveLater={
                          index < columns.length - 1
                            ? () => move(index, index + 1)
                            : undefined
                        }
                        messages={m}
                      />
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {!pageRows.length && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {pageRows.map((row, rowIndex) => {
            const rowNumber = number.format(offset + rowIndex + base + 1)
            const record = rows[row]!
            return (
              <tr key={row} className="even:bg-muted/20">
                <th
                  scope="row"
                  className="sticky start-0 z-10 border-e border-b bg-muted px-2 text-center text-xs font-normal text-muted-foreground tabular-nums"
                >
                  {rowNumber}
                </th>
                {columns.map(({ id: column, name }, position) => {
                  const value = record[column] ?? ""
                  const label = message(m.cellName, {
                    row: rowNumber,
                    column: name,
                  })
                  return (
                    <td
                      key={column}
                      className="h-9 border-e border-b p-0 align-top last:border-e-0"
                    >
                      {editing?.row === row && editing.column === column ? (
                        renderEditor(row, column, label)
                      ) : (
                        <button
                          type="button"
                          data-row={row}
                          data-column={column}
                          aria-label={value ? `${label} — ${value}` : label}
                          tabIndex={
                            tabStop.row === row && tabStop.column === column
                              ? 0
                              : -1
                          }
                          onFocus={() => setActive({ row, column })}
                          onClick={() => setEditing({ row, column })}
                          onKeyDown={(event) =>
                            navigate(event, rowIndex, position)
                          }
                          className="block min-h-9 w-full cursor-text px-2.5 py-1.5 text-start hover:bg-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                        >
                          <span
                            dir="auto"
                            className="block max-w-72 truncate whitespace-pre"
                            title={value}
                          >
                            {value || "\u00a0"}
                          </span>
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
