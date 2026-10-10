/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable cell window needs keyboard access. */
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { cellPosition } from "./core/navigation"
import type { Cell, Loaded, Messages, Preview } from "./types"

type Props = {
  info: Loaded
  preview?: Preview
  requestPreview: (sheet: number, row: number, column: number) => void
  messages: Messages
}
export function Worksheet({
  info,
  preview: incomingPreview,
  requestPreview,
  messages: m,
}: Props) {
  const id = useId()
  const root = useRef<HTMLElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(root.current!.closest("dialog"))
  }, [])
  const [sheetIndex, setSheetIndex] = useState(0)
  const [address, setAddress] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [cell, setCell] = useState<Cell | null>(null)
  const sheet = info.sheets[sheetIndex]!
  const preview =
    incomingPreview?.sheet === sheetIndex ? incomingPreview : undefined
  useEffect(() => {
    setCell(null)
    setAddress("")
    setInvalid(false)
    requestPreview(sheetIndex, sheet.start.r, sheet.start.c)
  }, [sheetIndex, sheet, requestPreview])
  const move = (row: number, column: number) => {
    setCell(null)
    setInvalid(false)
    requestPreview(sheetIndex, row, column)
  }
  return (
    <section ref={root} className="min-w-0 space-y-4" aria-label={m.preview}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor={`${id}-sheet`}>{m.sheet}</Label>
          <Select
            value={String(sheetIndex)}
            onValueChange={(value) => setSheetIndex(Number(value))}
          >
            <SelectTrigger id={`${id}-sheet`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent container={portal}>
              <SelectGroup>
                {info.sheets.map((item, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {m.range}: <bdi>{sheet.range ?? "—"}</bdi>
        </p>
      </div>
      {sheet.hidden ? (
        <p className="text-sm text-muted-foreground">
          {sheet.hidden === 2 ? m.veryHidden : m.hidden}
        </p>
      ) : null}
      {!sheet.range ? (
        <p role="status" className="py-8 text-center text-muted-foreground">
          {m.empty}
        </p>
      ) : (
        <>
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const position = cellPosition(address, sheet)
              if (!position) {
                setInvalid(true)
                return
              }
              move(position.row, position.column)
            }}
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={`${id}-address`}>{m.goTo}</Label>
              <Input
                id={`${id}-address`}
                value={address}
                placeholder={preview?.range.split(":")[0] ?? "A1"}
                dir="ltr"
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? `${id}-invalid` : undefined}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">
              {m.go}
            </Button>
          </form>
          {invalid ? (
            <p
              id={`${id}-invalid`}
              role="alert"
              className="text-sm text-destructive"
            >
              {m.invalidAddress}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{m.previewNote}</p>
          {preview ? (
            <>
              <p role="status" className="text-sm">
                {m.window.replace("{range}", preview.range)}
              </p>
              <div
                className="max-h-96 overflow-auto rounded-md border"
                tabIndex={0}
                role="region"
                aria-label={m.preview}
                dir="ltr"
              >
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-muted">
                    <tr>
                      <th className="border-e p-2" aria-label={m.address} />
                      {preview.columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="min-w-28 border-e p-2"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row) => (
                      <tr key={row.number}>
                        <th
                          scope="row"
                          className="sticky start-0 bg-muted p-2 font-normal text-muted-foreground"
                        >
                          {row.number}
                        </th>
                        {row.cells.map((item) => (
                          <td
                            key={item.address}
                            className="border-e border-t p-0"
                          >
                            <button
                              type="button"
                              className="block min-h-10 w-full max-w-64 truncate px-3 py-2 text-start hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                              aria-label={`${item.address}: ${item.missingCache ? m.noCache : item.text || m.blank}`}
                              aria-pressed={cell?.address === item.address}
                              title={item.missingCache ? m.noCache : item.text}
                              onClick={() => setCell(item)}
                            >
                              <bdi>
                                {item.missingCache
                                  ? m.noCache
                                  : item.text || "\u00a0"}
                              </bdi>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal"
                  disabled={preview.row <= sheet.start.r}
                  onClick={() => move(preview.row - 20, preview.column)}
                >
                  {m.previousRows}
                </Button>
                <Button
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal"
                  disabled={preview.row + 20 > sheet.end.r}
                  onClick={() => move(preview.row + 20, preview.column)}
                >
                  {m.nextRows}
                </Button>
                <Button
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal"
                  disabled={preview.column <= sheet.start.c}
                  onClick={() => move(preview.row, preview.column - 8)}
                >
                  {m.previousColumns}
                </Button>
                <Button
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal"
                  disabled={preview.column + 8 > sheet.end.c}
                  onClick={() => move(preview.row, preview.column + 8)}
                >
                  {m.nextColumns}
                </Button>
              </div>
            </>
          ) : (
            <p role="status" aria-busy="true">
              {m.preview}…
            </p>
          )}
        </>
      )}
      {cell ? (
        <section
          className="space-y-2 rounded-md bg-muted/50 p-3"
          aria-label={m.details}
        >
          <h3 className="font-medium">
            {m.details}: <bdi>{cell.address}</bdi>
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
            <dt>{m.value}</dt>
            <dd className="wrap-anywhere whitespace-pre-wrap" dir="auto">
              {cell.missingCache ? m.noCache : cell.text || m.blank}
            </dd>
            <dt>{m.storedValue}</dt>
            <dd className="wrap-anywhere whitespace-pre-wrap" dir="auto">
              {cell.missingCache ? m.noCache : cell.raw || m.blank}
            </dd>
            {cell.formula ? (
              <>
                <dt>{m.formula}</dt>
                <dd className="wrap-anywhere" dir="ltr">
                  ={cell.formula}
                </dd>
              </>
            ) : null}
            {cell.format ? (
              <>
                <dt>{m.numberFormat}</dt>
                <dd className="wrap-anywhere" dir="ltr">
                  {cell.format}
                </dd>
              </>
            ) : null}
          </dl>
        </section>
      ) : null}
    </section>
  )
}
