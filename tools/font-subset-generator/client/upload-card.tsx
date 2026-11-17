import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CaseSensitive, Upload, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import type { Messages } from "../types"

export function UploadCard({
  file,
  messages,
  onFile,
  formatBytes,
}: {
  file: File | null
  messages: Messages
  onFile: (file: File | null) => void
  formatBytes: (bytes: number) => string
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  return (
    <ToolPanelCard>
      <CardHeader>
        <CardTitle>{messages.uploadTitle}</CardTitle>
        <CardDescription>{messages.uploadDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <button
          type="button"
          aria-label={file ? messages.replaceFile : messages.chooseFile}
          className={cn(
            "flex min-h-24 w-full min-w-0 flex-1 items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-4 text-start transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:min-h-40 lg:flex-col lg:p-5 lg:text-center",
            dragging && "border-primary bg-primary/5"
          )}
          onClick={() => input.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const next = event.dataTransfer.files[0]
            if (next) onFile(next)
          }}
        >
          {file ? (
            <CaseSensitive
              aria-hidden="true"
              className="size-8 text-muted-foreground"
            />
          ) : (
            <Upload
              aria-hidden="true"
              className="size-7 text-muted-foreground"
            />
          )}
          <span className="flex min-w-0 flex-col gap-2">
            <span className="max-w-full font-medium break-all">
              {file ? <bdi>{file.name}</bdi> : messages.dropTitle}
            </span>
            <span className="text-sm text-muted-foreground">
              {file ? formatBytes(file.size) : messages.formats}
            </span>
          </span>
        </button>
        <input
          ref={input}
          id={id}
          name="font-file"
          type="file"
          accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
          className="hidden"
          aria-label={messages.chooseFile}
          onChange={(event) => {
            const next = event.target.files?.[0]
            if (next) onFile(next)
            event.target.value = ""
          }}
        />
        {file ? (
          <Button
            className="self-end"
            variant="ghost"
            size="sm"
            onClick={() => onFile(null)}
          >
            <X aria-hidden="true" />
            {messages.removeFile}
          </Button>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
