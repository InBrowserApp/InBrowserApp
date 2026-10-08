import { useEffect, useRef } from "react"
import { TabsList, TabsTrigger } from "@workspace/ui/components/ui/tabs"
import type { Messages, ReaderState } from "../types"

export function Worksheets({
  state,
  messages: m,
}: {
  state: ReaderState
  messages: Messages
}) {
  const rail = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rail.current!
    const current = root.querySelector('[data-state="active"]')
    if (!current) return
    const outer = root.getBoundingClientRect(),
      inner = current.getBoundingClientRect()
    root.scrollBy({
      left:
        inner.left < outer.left
          ? inner.left - outer.left
          : inner.right > outer.right
            ? inner.right - outer.right
            : 0,
    })
  }, [state.sheet])
  return (
    <div
      ref={rail}
      className="hidden shrink-0 overflow-x-auto border-t p-1 sm:block"
    >
      <TabsList
        aria-label={m.sheets}
        variant="line"
        className="min-w-full justify-start"
      >
        {state.sheets.map((sheet, i) => (
          <TabsTrigger
            key={i}
            value={String(i)}
            className="max-w-60 shrink-0"
            title={sheet.name}
          >
            <span dir="auto" className="truncate">
              {sheet.name}
              {sheet.hidden ? ` (${m.hidden})` : ""}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
