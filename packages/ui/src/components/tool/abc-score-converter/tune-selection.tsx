import { Button } from "@workspace/ui/components/ui/button"
import type { BookTune } from "./use-abc"

export function TuneSelection({
  book,
  selected,
  allSelected,
  messages: m,
  language,
  onToggle,
  onToggleAll,
}: {
  book: BookTune[]
  selected?: Set<string>
  allSelected: boolean
  messages: Record<
    "tunes" | "clearSelection" | "selectAll" | "untitled",
    string
  >
  language: string
  onToggle: (key: string, checked: boolean) => void
  onToggleAll: () => void
}) {
  const numeric = new Intl.NumberFormat(language)
  return (
    <fieldset className="grid min-w-0 gap-1.5">
      <legend className="text-sm font-medium">{m.tunes}</legend>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-11 justify-self-start sm:min-h-8"
        onClick={onToggleAll}
      >
        {allSelected ? m.clearSelection : m.selectAll}
      </Button>
      <div className="max-h-56 overflow-y-auto rounded-md border">
        {book.map(({ key, tune }, index) => (
          <label
            key={key}
            className="flex min-h-11 cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm hover:bg-muted/50"
          >
            <input
              type="checkbox"
              className="size-4 shrink-0 accent-primary"
              checked={!selected || selected.has(key)}
              onChange={(event) => onToggle(key, event.currentTarget.checked)}
            />
            <bdi className="min-w-0 wrap-anywhere">
              {tune.title ||
                m.untitled.replace("{number}", numeric.format(index + 1))}
            </bdi>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
