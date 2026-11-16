import { useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  FileText,
  LoaderCircle,
  Upload as UploadIcon,
  X,
} from "@workspace/ui/icons"
import type { Messages, Source } from "../types"

function Upload({
  messages: m,
  source,
  reading,
  disabled,
  onSelect,
  onClear,
}: Readonly<{
  messages: Messages
  source: Source | null
  reading: boolean
  disabled: boolean
  onSelect: (file: File | null) => void
  onClear: () => void
}>) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  return (
    <Card
      className="min-w-0"
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        if (!disabled) onSelect(event.dataTransfer.files[0] ?? null)
      }}
    >
      <CardHeader>
        <CardTitle>{m.uploadTitle}</CardTitle>
        <CardDescription>{m.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`flex flex-wrap items-center gap-4 rounded-lg border border-dashed p-5 ${dragging ? "border-primary bg-primary/5" : "bg-muted/20"}`}
        >
          {reading ? (
            <LoaderCircle
              aria-hidden="true"
              className="size-6 motion-safe:animate-spin"
            />
          ) : (
            <FileText
              aria-hidden="true"
              className="size-6 text-muted-foreground"
            />
          )}
          <div className="min-w-0 flex-1 basis-40" aria-live="polite">
            <p className="text-sm font-medium break-all">
              {reading ? m.readingLabel : source ? source.file.name : m.dropPdf}
            </p>
            {source ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {m.pagesLabel}: {source.pages.length} ·{" "}
                {(source.file.size / 1024).toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}{" "}
                KB
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-9 whitespace-normal"
              disabled={disabled}
              onClick={() => input.current?.click()}
            >
              <UploadIcon aria-hidden="true" />
              {source ? m.changeFile : m.choosePdf}
            </Button>
            {source || reading ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={m.removeFile}
                onClick={onClear}
              >
                <X aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </div>
        <input
          ref={input}
          id={id}
          className="hidden"
          name="watermark-pdf"
          aria-label={m.choosePdf}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            onSelect(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
        />
      </CardContent>
    </Card>
  )
}

export { Upload }
