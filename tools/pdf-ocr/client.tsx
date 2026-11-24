import { useEffect, useRef, useState } from "react"

import { defaultLanguage } from "@workspace/ocr-models/languages"
import { OcrLanguagePicker } from "@workspace/ui/components/tool/ocr-language-picker"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  BadgeCheck,
  Download,
  FileText,
  ScanText,
  Lock,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { Progress, Result } from "./convert"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
type Props = { lang: string; messages: Messages }
type ErrorMessage = "invalidPdf" | "encryptedPdf" | "failed"
type DownloadResult = Exclude<Result, { status: "invalidPdf" | "encryptedPdf" }>

export default function PdfOcr({ lang, messages: m }: Props) {
  const picker = useRef<HTMLInputElement>(null)
  const startButton = useRef<HTMLButtonElement>(null)
  const active = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState(() => defaultLanguage(lang))
  const [includeEnglish, setIncludeEnglish] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<ErrorMessage | null>(null)
  const [result, setResult] = useState<DownloadResult | null>(null)
  const [downloadUrl, setDownloadUrl] = useState("")
  const busy = progress !== null
  const download = result?.status === "ready" ? result.blob : result && file
  const formatted = new Intl.NumberFormat(lang)
  const progressText =
    progress?.stage === "pageProgress"
      ? m.pageProgress
          .replace("{page}", formatted.format(progress.page))
          .replace("{total}", formatted.format(progress.total))
      : progress && m[progress.stage]

  useEffect(
    () => () => {
      const run = active.current
      active.current = null
      run?.abort()
    },
    []
  )
  useEffect(() => {
    if (!download) {
      setDownloadUrl("")
      return
    }
    const url = URL.createObjectURL(download)
    setDownloadUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [download])

  function clearResult() {
    setError(null)
    setResult(null)
  }

  function selectFile(files: FileList | null) {
    const nextFile = files?.[0]
    if (active.current || !nextFile) return
    if (
      files.length !== 1 ||
      !(nextFile.type === "application/pdf" || /\.pdf$/i.test(nextFile.name))
    ) {
      setError("invalidPdf")
      return
    }

    setFile(nextFile)
    clearResult()
  }

  async function start() {
    if (!file || active.current) return
    const run = new AbortController()
    active.current = run
    clearResult()
    setProgress({ stage: "opening" })

    try {
      const { convertPdf } = await import("./convert")
      const next = await convertPdf(file, {
        language,
        includeEnglish,
        signal: run.signal,
        onProgress: (value) => {
          if (active.current === run) setProgress(value)
        },
      })
      if (active.current !== run) return
      if (next.status === "invalidPdf" || next.status === "encryptedPdf") {
        setError(next.status)
      } else {
        setResult(next)
      }
    } catch {
      if (active.current === run) setError("failed")
    } finally {
      if (active.current === run) {
        active.current = null
        setProgress(null)
      }
    }
  }

  function cancel() {
    active.current?.abort()
    active.current = null
    setProgress(null)
    startButton.current?.focus()
  }

  return (
    <div className="grid gap-4">
      <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_minmax(17rem,0.75fr)]">
        <input
          ref={picker}
          type="file"
          accept="application/pdf,.pdf"
          aria-label={m.choosePdf}
          hidden
          disabled={busy}
          onChange={(event) => {
            selectFile(event.currentTarget.files)
            event.currentTarget.value = ""
          }}
        />
        <button
          type="button"
          disabled={busy}
          className={cn(
            "flex min-h-44 min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/35 p-5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring enabled:hover:border-primary/50 enabled:hover:bg-muted/60",
            dragging && "border-primary bg-primary/5"
          )}
          onClick={() => picker.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            if (!busy) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            selectFile(event.dataTransfer.files)
          }}
        >
          <span className="mb-1 rounded-xl border bg-background p-2.5 text-primary shadow-xs">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <span className="max-w-full font-medium wrap-anywhere" dir="auto">
            {file?.name ?? m.choosePdf}
          </span>
          <span
            className={cn(
              "text-sm text-muted-foreground",
              file && "underline underline-offset-4"
            )}
          >
            {file ? m.changePdf : m.dropHint}
          </span>
        </button>

        <Card>
          <CardContent className="flex h-full min-w-0 flex-col justify-center gap-4">
            <OcrLanguagePicker
              lang={lang}
              language={language}
              disabled={busy}
              messages={m}
              onChange={(value) => {
                setLanguage(value)
                clearResult()
              }}
            />
            {language !== "eng" && (
              <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 shrink-0 accent-primary"
                  disabled={busy}
                  checked={includeEnglish}
                  onChange={(event) => {
                    setIncludeEnglish(event.currentTarget.checked)
                    clearResult()
                  }}
                />
                {m.includeEnglish}
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="h-auto min-h-10 max-w-full py-2 whitespace-normal aria-disabled:opacity-50"
                ref={startButton}
                disabled={!file}
                aria-disabled={busy || undefined}
                onClick={() => void start()}
              >
                <ScanText aria-hidden="true" />
                {m.start}
              </Button>
              {busy && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancel}
                  className="min-h-10"
                >
                  {m.cancel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="size-4 shrink-0" aria-hidden="true" />
        {m.privacy}
      </p>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{m[error]}</AlertDescription>
        </Alert>
      )}

      <div role="status" className="sr-only">
        {progressText ?? (result && m[result.status])}
      </div>

      <div className="empty:hidden">
        {progress && (
          <div className="grid gap-2 rounded-xl border bg-muted/35 p-4">
            <p className="font-medium">{progressText}</p>
            <progress
              aria-label={progressText ?? undefined}
              className="h-2 w-full accent-primary"
              value={
                progress.stage === "pageProgress"
                  ? Math.min(
                      1,
                      (progress.page - 1 + progress.fraction) / progress.total
                    )
                  : undefined
              }
              max={1}
            />
          </div>
        )}

        {file && result && downloadUrl && (
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                {result.status === "ready" && (
                  <BadgeCheck
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
                <div className="space-y-1">
                  <p className="font-medium">{m[result.status]}</p>
                  {result.status === "ready" && (
                    <p className="text-sm text-muted-foreground">
                      {m.readyHint} {result.skippedPages && m.skippedHint}
                    </p>
                  )}
                </div>
              </div>
              <Button
                asChild
                className="h-auto min-h-10 max-w-full py-2 whitespace-normal"
              >
                <a
                  href={downloadUrl}
                  download={
                    result.status === "ready"
                      ? `${file.name.replace(/\.pdf$/i, "")}-searchable.pdf`
                      : file.name
                  }
                >
                  <Download aria-hidden="true" />
                  {result.status === "ready" ? m.download : m.downloadOriginal}
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
