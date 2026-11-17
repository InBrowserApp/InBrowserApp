import { useId, useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Upload } from "@workspace/ui/icons"
import type { AudioEditorMessages } from "../types"

export function UploadCard({
  messages: m,
  disabled,
  onFiles,
}: {
  messages: AudioEditorMessages
  disabled: boolean
  onFiles: (files: File[]) => void
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  return (
    <Card
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
      }}
      onDrop={(event) => {
        event.preventDefault()
        if (!disabled) onFiles(Array.from(event.dataTransfer.files))
      }}
    >
      <CardHeader>
        <CardTitle>{m.addTitle}</CardTitle>
        <CardDescription>{m.addDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed bg-muted/30 p-5">
          <Button
            type="button"
            disabled={disabled}
            onClick={() => input.current?.click()}
          >
            <Upload data-icon="inline-start" aria-hidden="true" />
            {m.addButton}
          </Button>
          <p className="min-w-0 flex-1 basis-48 text-sm text-muted-foreground">
            {m.formatsNote}
          </p>
        </div>
        <label className="sr-only" htmlFor={id}>
          {m.addButton}
        </label>
        <input
          ref={input}
          id={id}
          tabIndex={-1}
          type="file"
          multiple
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.webm,.aac,.opus"
          name="audio-files"
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            onFiles(Array.from(event.target.files ?? []))
            event.target.value = ""
          }}
        />
        <p className="text-sm text-muted-foreground">{m.privacyNote}</p>
      </CardContent>
    </Card>
  )
}
