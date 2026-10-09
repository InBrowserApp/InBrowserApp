import { Button } from "@workspace/ui/components/ui/button"
import type { ContentsItem } from "@workspace/ui/lib/book-reader"

function flatten(items: ContentsItem[]) {
  const result: { item: ContentsItem; depth: number }[] = []
  const pending = items.map((item) => ({ item, depth: 0 })).reverse()
  while (pending.length) {
    const current = pending.pop()!
    result.push(current)
    for (const item of [...(current.item.subitems ?? [])].reverse())
      pending.push({ item, depth: current.depth + 1 })
  }
  return result
}

export function Contents({
  items,
  label,
  onSelect,
}: {
  items: ContentsItem[]
  label: string
  onSelect: (href: string) => void
}) {
  return (
    <nav
      aria-label={label}
      className="h-full overflow-auto border-e bg-background p-2"
    >
      <ul className="flex flex-col gap-1">
        {flatten(items).map(({ item, depth }, index) => (
          <li
            key={index}
            className="[contain-intrinsic-size:auto_44px] [content-visibility:auto]"
            style={{ paddingInlineStart: Math.min(depth, 8) * 12 }}
          >
            <Button
              variant="ghost"
              className="h-auto min-h-10 w-full justify-start py-2 text-start whitespace-normal"
              onClick={() => onSelect(item.href)}
            >
              <span dir="auto">{item.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
