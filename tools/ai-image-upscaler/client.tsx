import { useCallback, useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  Download,
  ImageUp,
  LoaderCircle,
  Lock,
  Sparkles,
  TriangleAlert,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type EnglishMessages from "./messages/en.json"
import { Preview } from "./preview"
import { useUpscaler } from "./use-upscaler"

export default function Upscaler({
  messages,
  lang,
}: {
  messages: typeof EnglishMessages
  lang: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const transferFocus = useRef(false)
  const [dragging, setDragging] = useState(false)
  // The primary action changes as a file is selected and a result becomes ready.
  const primaryAction = useCallback((element: HTMLElement | null) => {
    if (!element) return
    if (transferFocus.current) {
      transferFocus.current = false
      element.focus()
    }
    return () => {
      transferFocus.current = document.activeElement === element
    }
  }, [])
  const {
    source,
    result,
    scale,
    progress,
    error,
    setScale,
    chooseFile,
    upscale,
    cancel,
  } = useUpscaler()
  const running = progress !== undefined
  const number = new Intl.NumberFormat(lang)
  const size = (width: number, height: number) =>
    `${number.format(width)} × ${number.format(height)}`

  return (
    <Card
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        const next = event.relatedTarget
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file) void chooseFile(file)
      }}
      className={cn(dragging && "ring-2 ring-primary")}
    >
      <CardContent>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ""
            if (file) void chooseFile(file)
          }}
        />
        {source ? (
          <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_minmax(13rem,17rem)] md:gap-6">
            <Preview
              key={source.url}
              width={source.width}
              height={source.height}
              original={source.url}
              upscaled={result?.url}
              originalLabel={messages.original}
              upscaledLabel={messages.upscaled}
              comparisonLabel={messages.comparison}
            />
            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <p
                  dir="auto"
                  title={source.file.name}
                  className="truncate text-sm font-medium"
                >
                  {source.file.name}
                </p>
                <p
                  dir="ltr"
                  className="mt-1 text-start text-xs text-muted-foreground tabular-nums rtl:text-right"
                >
                  {size(source.width, source.height)}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="-mx-2 mt-1"
                  onClick={() => input.current?.click()}
                >
                  <ImageUp data-icon="inline-start" aria-hidden="true" />
                  {messages.changeImage}
                </Button>
              </div>
              <fieldset disabled={running} className="space-y-2">
                <legend className="text-sm font-medium">
                  {messages.scale}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {([2, 4] as const).map((factor) => (
                    <label
                      key={factor}
                      className="flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:ring-2 has-focus-visible:ring-ring has-disabled:cursor-default has-disabled:opacity-60"
                    >
                      <input
                        type="radio"
                        name="upscale-factor"
                        value={factor}
                        checked={scale === factor}
                        onChange={() => setScale(factor)}
                        className="sr-only"
                      />
                      <span dir="ltr">{factor}×</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                <span className="text-muted-foreground">
                  {messages.outputSize}
                </span>
                <strong dir="ltr" className="font-medium tabular-nums">
                  {size(source.width * scale, source.height * scale)}
                </strong>
              </div>
              <div className="grid">
                {result ? (
                  <Button asChild>
                    <a
                      ref={primaryAction}
                      href={result.url}
                      download={`${source.file.name.replace(/\.[^.]+$/, "")}-${scale}x.png`}
                    >
                      <Download data-icon="inline-start" aria-hidden="true" />
                      {messages.download}
                    </a>
                  </Button>
                ) : (
                  <Button
                    ref={primaryAction}
                    onClick={running ? cancel : upscale}
                    variant={running ? "outline" : "default"}
                  >
                    {!running && (
                      <Sparkles data-icon="inline-start" aria-hidden="true" />
                    )}
                    {running ? messages.cancel : messages.upscale}
                  </Button>
                )}
                <div role="status" className="text-sm text-muted-foreground">
                  {result && (
                    <span className="sr-only">{messages.upscaled}</span>
                  )}
                  {running && (
                    <p className="mt-2 flex items-center gap-2">
                      {progress === "loading" && (
                        <LoaderCircle
                          aria-hidden="true"
                          className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
                        />
                      )}
                      {progress === "loading"
                        ? messages.loading
                        : messages.processing}
                    </p>
                  )}
                </div>
                {typeof progress === "number" && (
                  <progress
                    max={1}
                    value={progress}
                    aria-label={messages.processing}
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <button
            ref={primaryAction}
            type="button"
            onClick={() => input.current?.click()}
            className={cn(
              "flex min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center transition-colors outline-none hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring",
              dragging && "border-primary bg-primary/10"
            )}
          >
            <span className="mb-1 flex size-11 items-center justify-center rounded-xl border bg-background">
              <ImageUp aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-semibold">
              {messages.chooseImage}
            </span>
            <span className="text-sm text-muted-foreground">
              {messages.dropHint}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {messages.formats}
            </span>
          </button>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4 text-start">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>{messages[error]}</AlertDescription>
          </Alert>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Lock aria-hidden="true" className="size-3.5 shrink-0" />
          {messages.privacy}
        </p>
      </CardContent>
    </Card>
  )
}
