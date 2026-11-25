import { useId, useRef, useState } from "react"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import example from "./tune-book.abc?raw"

export function AbcSourceEditor({
  source,
  filename,
  messages: m,
  onEdit,
}: {
  source: string
  filename: string
  messages: Record<
    "source" | "placeholder" | "open" | "example" | "fileError",
    string
  >
  onEdit: (value: string, filename?: string) => void
}) {
  const id = useId()
  const editor = useRef<HTMLTextAreaElement>(null)
  const importer = useTextFileImport()
  const [fileError, setFileError] = useState(false)

  function edit(value: string, name?: string) {
    importer.cancel()
    setFileError(false)
    onEdit(value, name)
  }

  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-3">
        <Label htmlFor={`${id}-source`} className="text-base">
          {m.source}
        </Label>
        <div className="flex flex-wrap items-center gap-2 [&_button]:min-h-11 sm:[&_button]:min-h-8">
          <ToolOpenTextFile
            accept=".abc,.txt,text/plain"
            label={m.open}
            onFile={(file) =>
              void importer.read(
                file,
                (text) => edit(text, file.name),
                () => setFileError(true)
              )
            }
          />
          {!source.trim() && (
            <Button
              type="button"
              variant="outline"
              onClick={(event) => {
                edit(example)
                if (event.detail === 0)
                  editor.current?.focus({ preventScroll: true })
              }}
            >
              {m.example}
            </Button>
          )}
          {filename && (
            <bdi
              className="max-w-full min-w-0 truncate text-sm text-muted-foreground"
              title={filename}
            >
              {filename}
            </bdi>
          )}
        </div>
        <Textarea
          ref={editor}
          id={`${id}-source`}
          value={source}
          onChange={(event) => edit(event.currentTarget.value)}
          placeholder={m.placeholder}
          dir="ltr"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          wrap="off"
          className="![field-sizing:fixed] min-h-40 resize-y font-mono text-sm"
        />
        {fileError && (
          <p role="alert" className="text-sm text-destructive">
            {m.fileError}
          </p>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
