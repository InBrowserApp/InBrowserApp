import { useEffect, useId, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Label } from "@workspace/ui/components/ui/label"
import { Copy, Check } from "@workspace/ui/icons"
import type { Messages } from "./types"

export function Output({
  text,
  blob,
  filename,
  messages: m,
}: {
  text: string
  blob: Blob
  filename: string
  messages: Messages
}) {
  const id = useId()
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )
  useEffect(() => {
    if (copyState !== "copied") return
    const timer = window.setTimeout(() => setCopyState("idle"), 2000)
    return () => window.clearTimeout(timer)
  }, [copyState])
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
        <Label htmlFor={id}>{m.output}</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text)
                setCopyState("copied")
              } catch {
                setCopyState("failed")
              }
            }}
          >
            {copyState === "copied" ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {copyState === "copied" ? m.copied : m.copy}
          </Button>
          <DocumentDownload
            file={blob}
            filename={filename}
            label={m.download}
          />
        </div>
      </div>
      <p
        role="status"
        className={
          copyState === "failed"
            ? "px-3 py-2 text-sm text-destructive"
            : "sr-only"
        }
      >
        {copyState === "failed"
          ? m.copyFailed
          : copyState === "copied"
            ? m.copied
            : ""}
      </p>
      <Textarea
        id={id}
        value={text}
        readOnly
        dir="auto"
        spellCheck={false}
        className="min-h-48 flex-1 resize-none rounded-none border-0 p-4 font-mono text-sm focus-visible:ring-inset"
      />
    </div>
  )
}
