import { Folder, Rss } from "@workspace/ui/icons"
import { isFeed, outlineName, outlineRows } from "./xml"
import type { Messages } from "./types"

export function OutlineList({
  rows,
  selected,
  onSelect,
  messages: m,
}: {
  rows: ReturnType<typeof outlineRows>
  selected: Element | null
  onSelect: (node: Element, keyboard: boolean) => void
  messages: Messages
}) {
  return (
    <ul aria-label={m.outline} className="max-h-[28rem] flex-1 overflow-auto">
      {rows.map(({ node, depth }, index) => {
        const Icon = isFeed(node) ? Rss : Folder
        const name = outlineName(node) || m.unnamed
        return (
          <li className="border-b last:border-b-0" key={index}>
            <button
              type="button"
              aria-current={selected === node || undefined}
              className="flex w-full min-w-0 items-center gap-2 border-s-2 border-transparent py-2.5 pe-3 text-start hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=true]:border-s-primary aria-[current=true]:bg-muted"
              style={{ paddingInlineStart: 12 + Math.min(depth, 5) * 16 }}
              onClick={(event) => onSelect(node, event.detail === 0)}
            >
              <Icon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span
                dir="auto"
                className="truncate text-sm font-medium"
                title={name}
              >
                {name}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
