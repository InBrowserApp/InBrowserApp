import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Play, Plus, Trash2 } from "@workspace/ui/icons"
import type { Controls, SubtitleRow } from "./types"

export function SubtitleEditor({
  rows,
  onAdd,
  onChange,
  onRemove,
  onJump,
  canPreview,
  disabled,
  messages: m,
}: {
  rows: SubtitleRow[]
  onAdd: () => void
  onChange: (row: SubtitleRow) => void
  onRemove: (id: number) => void
  onJump: (seconds: number) => void
  canPreview: boolean
  disabled: boolean
  messages: Controls
}) {
  return (
    <section className="min-w-0 space-y-3" aria-label={m.subtitleEditor}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{m.subtitleEditor}</h2>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          disabled={disabled}
        >
          <Plus aria-hidden />
          {m.addSubtitle}
        </Button>
      </header>
      {rows.length > 0 && (
        <div className="grid max-h-132 gap-2 overflow-y-auto rounded-xl border bg-muted/25 p-2">
          {rows.map((row, index) => (
            <fieldset
              key={row.id}
              aria-label={`${m.subtitleEditor} ${index + 1}`}
              disabled={disabled}
              className="min-w-0 space-y-2 rounded-lg border bg-background p-3"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-1.5 sm:gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={m.jumpToSubtitle}
                  aria-label={m.jumpToSubtitle}
                  disabled={
                    !canPreview || row.start === "" || Number(row.start) < 0
                  }
                  onClick={() => onJump(Number(row.start))}
                >
                  <Play aria-hidden />
                </Button>
                <label className="grid min-w-0 gap-1 text-xs text-muted-foreground">
                  {m.startTime}
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    dir="ltr"
                    value={row.start}
                    onChange={(event) =>
                      onChange({ ...row, start: event.currentTarget.value })
                    }
                  />
                </label>
                <label className="grid min-w-0 gap-1 text-xs text-muted-foreground">
                  {m.endTime}
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    dir="ltr"
                    value={row.end}
                    onChange={(event) =>
                      onChange({ ...row, end: event.currentTarget.value })
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={m.removeSubtitle}
                  aria-label={m.removeSubtitle}
                  onClick={() => onRemove(row.id)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
              <Textarea
                aria-label={m.subtitleText}
                placeholder={m.subtitleText}
                dir="auto"
                rows={2}
                value={row.text}
                onChange={(event) =>
                  onChange({ ...row, text: event.currentTarget.value })
                }
              />
            </fieldset>
          ))}
        </div>
      )}
    </section>
  )
}
