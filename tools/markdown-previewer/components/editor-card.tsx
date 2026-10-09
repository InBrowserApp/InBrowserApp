import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import type { MarkdownPreviewerMessages } from "../types"

export function EditorCard({
  messages: m,
  markdown,
  onMarkdownChange,
  onLoadSample,
  onClear,
}: {
  messages: MarkdownPreviewerMessages
  markdown: string
  onMarkdownChange: (value: string) => void
  onLoadSample: () => void
  onClear: () => void
}) {
  const id = useId()
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-3">
      <Field className="min-h-0 flex-1">
        <FieldLabel htmlFor={id}>{m.editorTitle}</FieldLabel>
        <Textarea
          id={id}
          name="markdown-source"
          aria-label={m.sourceLabel}
          autoComplete="off"
          spellCheck={false}
          value={markdown}
          placeholder={m.sourcePlaceholder}
          className="![field-sizing:fixed] min-h-0 flex-1 resize-none font-mono text-sm"
          onChange={(event) => onMarkdownChange(event.target.value)}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onLoadSample}>
          {m.loadSampleLabel}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {m.clearLabel}
        </Button>
      </div>
    </div>
  )
}
