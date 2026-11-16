import { useId, useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { ImageUp, X } from "@workspace/ui/icons"
import { ACCEPT } from "../core/files"
import type { Messages } from "../types"

export function Upload({
  messages: m,
  files,
  selected,
  onSelect,
  onAdd,
  onRemove,
  onClear,
}: {
  messages: Messages
  files: readonly File[]
  selected: File | null
  onSelect: (file: File) => void
  onAdd: (files: File[]) => void
  onRemove: (file: File) => void
  onClear: () => void
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="min-w-0 break-words">
          {m.uploadTitle}
          {files.length ? ` (${files.length})` : ""}
        </CardTitle>
        <CardDescription>{m.uploadDescription}</CardDescription>
        {files.length ? (
          <CardAction>
            <Button variant="ghost" size="sm" onClick={onClear}>
              {m.clearAll}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 border-dashed py-6"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = "copy"
          }}
          onDrop={(e) => {
            e.preventDefault()
            onAdd(Array.from(e.dataTransfer.files))
          }}
        >
          <ImageUp aria-hidden="true" />
          {m.chooseImages}
        </Button>
        <input
          ref={input}
          id={id}
          className="sr-only"
          aria-label={m.chooseImages}
          type="file"
          name="source-images"
          accept={ACCEPT}
          multiple
          onChange={(e) => {
            onAdd(Array.from(e.target.files!))
            e.target.value = ""
          }}
        />
        <p className="text-xs text-pretty text-muted-foreground">
          {m.uploadHint}
        </p>
        {files.length ? (
          <ul className="grid max-h-48 gap-1 overflow-y-auto sm:grid-cols-2">
            {files.map((file, index) => (
              <li className="flex min-w-0 items-center gap-1" key={index}>
                <Button
                  className="min-w-0 flex-1 justify-start"
                  variant={file === selected ? "secondary" : "ghost"}
                  aria-pressed={file === selected}
                  onClick={() => onSelect(file)}
                >
                  <span className="truncate">{file.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={m.removeImage.replace("{name}", file.name)}
                  onClick={() => onRemove(file)}
                >
                  <X aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}
