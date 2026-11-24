import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import type { KeyboardEvent, Ref } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { ascii, hex } from "./core/bytes"
import type { Messages } from "./types"

const narrowGrid = "(max-width: 50rem)"
function subscribe(onChange: () => void) {
  const query = window.matchMedia(narrowGrid)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

type ByteGridProps = {
  bytes: Uint8Array
  start: number
  size: number
  selection: { offset: number; focus: boolean }
  edits: ReadonlyMap<number, number>
  messages: Messages
  onSelect: (offset: number) => void
  onMove: (offset: number) => void
  onOverwrite: (offset: number, original: number, value: number) => void
}

export function ByteGrid({
  bytes,
  start,
  size,
  selection,
  edits,
  messages,
  onSelect,
  onMove,
  onOverwrite,
}: ByteGridProps) {
  const active = useRef<HTMLInputElement>(null)
  const { offset } = selection
  const columns = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(narrowGrid).matches,
    () => false
  )
    ? 8
    : 16
  const width = hex(size - 1, 8).length

  useLayoutEffect(() => {
    if (selection.focus) active.current?.focus()
  }, [selection])

  function navigate(event: KeyboardEvent<HTMLInputElement>, position: number) {
    const targets: Record<string, number> = {
      ArrowLeft: position - 1,
      ArrowRight: position + 1,
      ArrowUp: position - columns,
      ArrowDown: position + columns,
      Home: position - (position % columns),
      End: Math.min(size - 1, position + columns - 1 - (position % columns)),
    }
    const next = targets[event.key]
    if (
      next === undefined ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return
    event.preventDefault()
    if (next >= 0 && next < size && next !== position) onMove(next)
  }

  return (
    <div
      dir="ltr"
      className="max-h-96 scroll-pt-10 overflow-auto rounded-lg border"
    >
      <table className="w-full border-separate border-spacing-0 text-left font-mono text-xs tabular-nums sm:text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-xs text-muted-foreground">
          <tr>
            <th
              scope="col"
              className="border-b px-1.5 py-2.5 font-medium sm:px-3"
              dir="auto"
            >
              {messages.offset}
            </th>
            <th
              colSpan={columns}
              className="border-b px-1 py-2.5 font-medium"
              dir="auto"
            >
              {messages.hex}
            </th>
            <th
              scope="col"
              className="border-b border-l px-1.5 py-2.5 font-medium sm:px-3"
            >
              {messages.ascii}
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(
            { length: Math.ceil(bytes.length / columns) },
            (_, row) => {
              const first = row * columns
              const values = Array.from(bytes.subarray(first, first + columns))
              return (
                <tr key={start + first} className="even:bg-muted/40">
                  <th
                    scope="row"
                    className="px-1.5 font-normal whitespace-nowrap text-muted-foreground sm:px-3"
                  >
                    {hex(start + first, width)}
                  </th>
                  {values.map((original, column) => {
                    const position = start + first + column
                    return (
                      <td key={position} className="py-px sm:px-px">
                        <ByteInput
                          inputRef={position === offset ? active : undefined}
                          selected={position === offset}
                          edited={edits.has(position)}
                          value={hex(edits.get(position) ?? original)}
                          label={messages.byteValue.replace(
                            "{offset}",
                            `0x${hex(position, width)}`
                          )}
                          onFocus={() => onSelect(position)}
                          onKeyDown={(event) => navigate(event, position)}
                          onOverwrite={(value) =>
                            onOverwrite(position, original, value)
                          }
                        />
                      </td>
                    )
                  })}
                  {values.length < columns && (
                    <td colSpan={columns - values.length} />
                  )}
                  <td className="border-l px-1.5 whitespace-pre sm:px-3">
                    {values.map((original, column) => {
                      const position = start + first + column
                      return (
                        <span
                          key={position}
                          className={cn(
                            "rounded-xs",
                            edits.has(position) && "font-bold text-primary",
                            position === offset && "bg-primary/15 text-primary"
                          )}
                        >
                          {ascii(edits.get(position) ?? original)}
                        </span>
                      )
                    })}
                  </td>
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}

function ByteInput({
  inputRef,
  selected,
  edited,
  value,
  label,
  onFocus,
  onKeyDown,
  onOverwrite,
}: {
  inputRef?: Ref<HTMLInputElement>
  selected: boolean
  edited: boolean
  value: string
  label: string
  onFocus: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onOverwrite: (value: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <input
      ref={inputRef}
      type="text"
      name="byte"
      tabIndex={selected ? 0 : -1}
      aria-label={label}
      autoComplete="off"
      autoCapitalize="characters"
      spellCheck={false}
      maxLength={2}
      value={draft ?? value}
      onFocus={(event) => {
        onFocus()
        event.currentTarget.select()
      }}
      onClick={(event) => {
        if (draft === null) event.currentTarget.select()
      }}
      onBlur={() => setDraft(null)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setDraft(null)
          event.currentTarget.select()
        } else {
          onKeyDown(event)
        }
      }}
      onChange={(event) => {
        const next = event.currentTarget.value.toUpperCase()
        if (!/^[0-9A-F]{0,2}$/.test(next)) return
        if (next.length === 2) {
          setDraft(null)
          onOverwrite(Number.parseInt(next, 16))
          event.currentTarget.select()
        } else {
          setDraft(next)
        }
      }}
      className={cn(
        "block h-7 w-full min-w-5 rounded-sm bg-transparent text-center outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:h-7 sm:min-w-7",
        edited &&
          "font-bold text-primary underline decoration-dotted underline-offset-4",
        selected && "bg-primary/15 text-primary"
      )}
    />
  )
}
