import { ImageIcon, X } from "@workspace/ui/icons"
import { Button } from "@workspace/ui/components/ui/button"
import type { FileResult } from "./core/conversion"
import type { Messages } from "./messages"

export type Entry = { id: number; file: File; result?: FileResult }

export function ImageQueue({
  id,
  entries,
  busy,
  messages: m,
  onRemove,
  onClear,
}: {
  id: string
  entries: readonly Entry[]
  busy: boolean
  messages: Messages
  onRemove: (id: number) => void
  onClear: () => void
}) {
  return (
    <section aria-labelledby={id}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 id={id} className="text-sm font-medium">
          {m.files}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={busy}
          onClick={onClear}
        >
          {m.clear}
        </Button>
      </div>
      <ul className="max-h-60 divide-y overflow-y-auto rounded-lg border">
        {entries.map(({ id, file, result }) => (
          <li key={id} className="flex items-center gap-3 px-3 py-1.5">
            <ImageIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <div className="min-w-0 flex-1">
              <p dir="auto" title={file.name} className="truncate text-sm">
                {file.name}
              </p>
              {result?.failure && (
                <p className="text-xs text-destructive">{m[result.failure]}</p>
              )}
            </div>
            <Button
              aria-label={m.remove.replace("{name}", () => file.name)}
              size="icon-sm"
              variant="ghost"
              type="button"
              disabled={busy}
              onClick={() => onRemove(id)}
            >
              <X />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
