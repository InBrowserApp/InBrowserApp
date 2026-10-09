import { Button } from "@workspace/ui/components/ui/button"
import type { MarkdownPreviewerMessages, TocItem } from "../types"

export function ReaderOutline({
  id,
  messages: m,
  items,
  onSelect,
  onClose,
}: {
  id: string
  messages: MarkdownPreviewerMessages
  items: readonly TocItem[]
  onSelect: (id: string) => void
  onClose: () => void
}) {
  return (
    <nav
      id={id}
      aria-label={m.outlineTitle}
      className="w-full shrink-0 overflow-auto border-e p-2 sm:w-52"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault()
          event.stopPropagation()
          onClose()
        }
      }}
    >
      {items.length ? (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingInlineStart: (item.level - 1) * 10 }}
            >
              <Button
                variant="ghost"
                className="h-auto min-h-10 w-full justify-start py-2 text-start whitespace-normal"
                onClick={() => onSelect(item.id)}
              >
                <span dir="auto" className="min-w-0 [overflow-wrap:anywhere]">
                  {item.text}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-2 text-sm text-muted-foreground">
          {m.outlineEmptyDescription}
        </p>
      )}
    </nav>
  )
}
