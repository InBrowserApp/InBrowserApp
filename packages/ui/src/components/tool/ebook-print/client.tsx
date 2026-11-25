import { useEffect, useId, useRef, useState } from "react"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import { EmptyDescription, EmptyMedia } from "../../ui/empty"
import { Label } from "../../ui/label"
import { Spinner } from "../../ui/spinner"
import { BookOpen, Folder, Printer } from "../../../icons"
import { cn } from "../../../lib/utils"
import { openingErrorCodes, type Messages } from "./messages"

const paperSizes = ["A4", "A5", "letter"] as const

const formats = {
  epub: { accept: ".epub,application/epub+zip", extension: /\.epub$/i },
  fb2: {
    accept: ".fb2,.fbz,.fb2.zip,application/x-fictionbook+xml",
    extension: /\.(?:fb2|fbz|fb2\.zip)$/i,
  },
  mobi: {
    accept: ".mobi,.azw,.prc,application/x-mobipocket-ebook",
    extension: /\.(?:mobi|azw|prc)$/i,
  },
} as const

export type BookPrintFormat = keyof typeof formats

type Result = { url: string; missing: boolean } | { error: string }

export default function Client({
  lang,
  format,
  messages: m,
}: {
  lang: string
  format: BookPrintFormat
  messages: Messages
}) {
  const { accept, extension } = formats[format]
  const picker = useRef<HTMLInputElement>(null)
  const chooseButton = useRef<HTMLButtonElement>(null)
  const preview = useRef<HTMLIFrameElement>(null)
  const sizeId = useId()
  const helpId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [dragging, setDragging] = useState(false)
  const [frameReady, setFrameReady] = useState(false)
  const [paperSize, setPaperSize] = useState<(typeof paperSizes)[number]>("A4")
  const [printFailed, setPrintFailed] = useState(false)
  const output = result && "url" in result ? result : null
  const error = result && "error" in result ? result.error : null

  useEffect(() => {
    if (!file) return
    if (!extension.test(file.name)) {
      setResult({ error: m.unsupported })
      return
    }
    const task = new AbortController()
    let url: string | undefined
    async function load(input: File) {
      try {
        const { prepareBook } = await import("./prepare-book")
        const book = await prepareBook(input, task.signal, m, lang)
        if (task.signal.aborted) return
        url = URL.createObjectURL(
          new Blob([book.html], { type: "text/html;charset=utf-8" })
        )
        setResult({ url, missing: book.missing })
      } catch (reason) {
        if (task.signal.aborted) return
        const code = reason instanceof Error ? reason.message : ""
        const key = openingErrorCodes.find((key) => key === code)
        const detail = key ? m[key] : undefined
        setResult({ error: detail ?? m.invalid })
      }
    }
    void load(file)
    return () => {
      task.abort()
      if (url) URL.revokeObjectURL(url)
    }
  }, [file, lang, m, extension])

  function selectFile(next: File | null) {
    setFile(next)
    setResult(null)
    setFrameReady(false)
    setPrintFailed(false)
  }

  function savePdf() {
    const frame = preview.current
    const page = frame?.contentDocument?.querySelector("#paper-size")
    const view = frame?.contentWindow
    if (!page || typeof view?.print !== "function") {
      setPrintFailed(true)
      return
    }
    page.textContent = `@page { size: ${paperSize}; }`
    view.print()
  }

  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card",
        !file && "border-dashed",
        dragging && "border-primary bg-accent/50"
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const next = event.dataTransfer.files[0]
        if (next) selectFile(next)
      }}
    >
      <input
        ref={picker}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const next = event.currentTarget.files?.[0]
          if (next) selectFile(next)
          event.currentTarget.value = ""
        }}
      />
      <div
        className={cn(
          "flex min-w-0 items-center gap-3",
          file
            ? "flex-wrap justify-between border-b px-4 py-3"
            : "min-h-64 flex-col justify-center p-6 text-center text-balance"
        )}
      >
        {file ? (
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <BookOpen
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <bdi className="truncate font-medium" title={file.name}>
              {file.name}
            </bdi>
          </span>
        ) : (
          <EmptyMedia variant="icon" className="size-11">
            <BookOpen className="size-5" aria-hidden="true" />
          </EmptyMedia>
        )}
        <Button
          ref={chooseButton}
          className="max-sm:min-h-11"
          variant={file ? "outline" : "default"}
          size={file ? "sm" : "default"}
          onClick={() => picker.current?.click()}
        >
          <Folder data-icon="inline-start" aria-hidden="true" />
          {file ? m.replace : m.open}
        </Button>
        {!file ? (
          <>
            <EmptyDescription>{m.drop}</EmptyDescription>
            <p className="text-xs text-muted-foreground">{m.privacy}</p>
          </>
        ) : null}
      </div>
      {file && !result ? (
        <div className="flex min-h-40 flex-wrap items-center justify-center gap-3 p-4">
          <p role="status" className="flex items-center gap-2 text-sm">
            <Spinner />
            {m.loading}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              selectFile(null)
              chooseButton.current?.focus()
            }}
          >
            {m.cancel}
          </Button>
        </div>
      ) : null}
      {error ? (
        <Alert variant="destructive" className="m-4 w-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {output ? (
        <>
          <div className="space-y-2 border-b p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={sizeId}>{m.pageSize}</Label>
                <select
                  id={sizeId}
                  value={paperSize}
                  onChange={(event) =>
                    setPaperSize(event.currentTarget.value as typeof paperSize)
                  }
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring max-sm:h-11"
                >
                  {paperSizes.map((size) => (
                    <option key={size} value={size}>
                      {size === "letter" ? m.letter : size}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={savePdf}
                className="max-sm:min-h-11"
                disabled={!frameReady}
                aria-describedby={helpId}
              >
                <Printer data-icon="inline-start" aria-hidden="true" />
                {m.save}
              </Button>
            </div>
            <p id={helpId} className="text-sm text-muted-foreground">
              {m.saveHelp}
            </p>
            {output.missing ? (
              <p role="status" className="text-sm text-muted-foreground">
                {m.missingResources}
              </p>
            ) : null}
            {printFailed ? (
              <Alert variant="destructive">
                <AlertDescription>{m.printUnavailable}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <iframe
            ref={preview}
            src={output.url}
            title={m.preview}
            sandbox="allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setFrameReady(true)}
            className="block h-[min(64dvh,36rem)] min-h-64 w-full bg-background"
          />
        </>
      ) : null}
    </section>
  )
}
