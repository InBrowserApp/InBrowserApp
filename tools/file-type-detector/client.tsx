import { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Binary, Upload, X } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { Results } from "./components/results"
import { HexPreview } from "./components/hex-preview"
import type { Inspection, Messages } from "./types"

export default function FileTypeDetectorClient({
  language,
  messages: m,
}: {
  language: string
  messages: Messages
}) {
  const input = useRef<HTMLInputElement>(null)
  const run = useRef(0)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(
    () => () => {
      run.current += 1
    },
    []
  )

  async function selectFile(selected: File) {
    const current = ++run.current
    setFile(selected)
    setResult(null)
    setError(false)
    setLoading(true)
    setDragging(false)
    try {
      const { inspectFile } = await import("./core/inspect")
      const inspected = await inspectFile(selected)
      if (current === run.current) setResult(inspected)
    } catch {
      if (current === run.current) setError(true)
    } finally {
      if (current === run.current) setLoading(false)
    }
  }

  function clear() {
    run.current += 1
    setFile(null)
    setResult(null)
    setLoading(false)
    setError(false)
  }

  function example() {
    const bytes = Uint8Array.from(
      atob(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aOZkAAAAASUVORK5CYII="
      ),
      (char) => char.charCodeAt(0)
    )
    void selectFile(new File([bytes], "sample.jpg", { type: "image/jpeg" }))
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <input
        ref={input}
        type="file"
        name="file"
        aria-label={m.inputTitle}
        className="sr-only"
        onChange={(event) => {
          const selected = event.target.files?.[0]
          if (selected) void selectFile(selected)
          event.target.value = ""
        }}
      />
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
        <ToolPanelCard className="min-w-0">
          <CardHeader>
            <CardTitle>{m.inputTitle}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent className="gap-4">
            <button
              type="button"
              className={cn(
                "flex min-h-52 w-full cursor-pointer touch-manipulation flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 px-5 py-8 text-center transition-colors hover:border-foreground/30 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                dragging && "border-foreground/40 bg-muted/60"
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
                const dropped = event.dataTransfer.files[0]
                if (dropped) void selectFile(dropped)
              }}
            >
              <Upload
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
              <span className="text-sm font-medium text-pretty">
                {m.dropLabel}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {m.inputHint}
              </span>
            </button>
            {file ? (
              <div className="space-y-3 rounded-lg border p-3">
                <p className="text-sm font-medium break-all" dir="auto">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.fileSize}:{" "}
                  {new Intl.NumberFormat(language).format(file.size)} B
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => input.current?.click()}
                  >
                    {m.change}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clear}>
                    <X aria-hidden="true" />
                    {m.clear}
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="space-y-1">
              <Button variant="outline" size="sm" onClick={example}>
                <Binary aria-hidden="true" />
                {m.example}
              </Button>
              <p className="text-xs text-muted-foreground">{m.exampleHint}</p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {m.privacy}
            </p>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{m.readError}</AlertDescription>
              </Alert>
            ) : null}
          </ToolPanelCardContent>
        </ToolPanelCard>
        <Results result={result} loading={loading} messages={m} />
      </div>
      {result ? <HexPreview result={result} messages={m} /> : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {m.limitations}
      </p>
    </div>
  )
}
