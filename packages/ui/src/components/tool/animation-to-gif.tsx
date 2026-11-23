import { useEffect, useRef, useState } from "react"
import {
  convertAnimationToGif,
  type AnimationFormat,
  type ConversionReply,
} from "@workspace/raster-image/animation-to-gif"
import { Film, ImageUp } from "@workspace/ui/icons"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Preview } from "./animation-maker/preview"
import { cn } from "../../lib/utils"
import type { animationToGifMessages } from "../../lib/animation-to-gif-messages"

type Messages = ReturnType<typeof animationToGifMessages>

const formats = {
  apng: {
    accept: ".apng,.png,image/apng,image/png",
    extensions: ".apng, .png",
  },
  webp: { accept: ".webp,image/webp", extensions: ".webp" },
}

export function AnimationToGif({
  format,
  language,
  messages: m,
}: {
  format: AnimationFormat
  language: string
  messages: Messages
}) {
  const [file, setFile] = useState<File>()
  const [reply, setReply] = useState<ConversionReply>()
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const picker = useRef<HTMLInputElement>(null)
  const active = useRef<AbortController | null>(null)
  const { accept, extensions } = formats[format]

  useEffect(() => () => active.current?.abort(), [])

  function stopConversion() {
    active.current?.abort()
    active.current = null
    setBusy(false)
  }

  function select(next: File | undefined) {
    if (!next) return
    stopConversion()
    setFile(next)
    setReply(undefined)
  }

  async function convert() {
    if (!file || active.current) return
    const operation = new AbortController()
    active.current = operation
    setReply(undefined)
    setBusy(true)
    const result = await convertAnimationToGif(
      file,
      format,
      operation.signal
    ).catch(() => ({ error: "failed" }) as const)
    if (operation.signal.aborted) return
    active.current = null
    setBusy(false)
    setReply(result)
  }

  const gif = reply && "result" in reply ? reply.result : undefined
  const error = reply && "error" in reply ? reply.error : undefined

  return (
    <div className="grid min-w-0 gap-4">
      <div
        className={cn(
          "flex min-w-0 flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/25 px-4 py-8 text-center",
          dragOver && "border-primary bg-primary/5"
        )}
        onDragOver={(event) => {
          if (!event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          event.dataTransfer.dropEffect = "copy"
          setDragOver(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragOver(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          select(event.dataTransfer.files[0])
        }}
      >
        <input
          ref={picker}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => {
            select(event.currentTarget.files?.[0])
            event.currentTarget.value = ""
          }}
        />
        <ImageUp aria-hidden="true" className="size-8 text-muted-foreground" />
        {file && (
          <p className="max-w-full font-medium break-all">
            <bdi>{file.name}</bdi>
          </p>
        )}
        <Button
          type="button"
          variant={file ? "outline" : "default"}
          className="h-auto min-h-11 whitespace-normal sm:min-h-9"
          onClick={() => picker.current?.click()}
        >
          {file ? m.replace : m.choose}
        </Button>
        <p className="text-sm text-muted-foreground">
          {m.drop} <bdi>({extensions})</bdi>
          <br />
          {m.privacy}
        </p>
      </div>

      {file && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-auto min-h-11 whitespace-normal sm:min-h-9"
            disabled={busy}
            onClick={() => void convert()}
          >
            {busy ? (
              <Spinner data-icon="inline-start" aria-hidden="true" />
            ) : (
              <Film data-icon="inline-start" aria-hidden="true" />
            )}
            {busy ? m.creatingAnimation : m.createAnimation}
          </Button>
          {busy && (
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-11 whitespace-normal sm:min-h-9"
              onClick={stopConversion}
            >
              {m.cancel}
            </Button>
          )}
        </div>
      )}
      <p role="status" className="sr-only">
        {busy ? m.creatingAnimation : gif ? m.ready : ""}
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error === "invalid"
            ? format === "apng"
              ? m.invalidApng
              : m.invalidWebp
            : m[error]}
        </p>
      )}
      {gif && (
        <Preview
          result={gif}
          downloadName={`${file?.name.replace(/\.[^.]+$/, "") || format}.gif`}
          width={gif.width}
          height={gif.height}
          language={language}
          messages={m}
        />
      )}
    </div>
  )
}
