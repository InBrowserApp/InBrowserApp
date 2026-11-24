import { useEffect, useId, useRef, useState } from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  BadgeCheck,
  Download,
  FileArchive,
  FileText,
  LoaderCircle,
  Lock,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { Profile } from "./engine/protocol"
import type { ConversionError, Progress } from "./convert"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
type ErrorKey = "oneFile" | ConversionError
type Job =
  | { status: "working"; progress: "opening" | Progress }
  | { status: "error"; key: ErrorKey }
  | { status: "ready"; url: string; filename: string }

const profiles = [
  { id: 2, label: "PDF/A-2b" },
  { id: 1, label: "PDF/A-1b" },
] as const

export default function PdfToPdfa({ messages: m }: { messages: Messages }) {
  const id = useId()
  const picker = useRef<HTMLInputElement>(null)
  const startButton = useRef<HTMLButtonElement>(null)
  const active = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<Profile>(2)
  const [dragging, setDragging] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const busy = job?.status === "working"
  const url = job?.status === "ready" ? job.url : null

  useEffect(() => () => active.current?.abort(), [])
  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url])

  function selectFile(files: FileList | null) {
    if (active.current || !files?.length) return
    if (files.length !== 1) {
      setJob({ status: "error", key: "oneFile" })
      return
    }
    const selected = files[0]!
    if (selected.type !== "application/pdf" && !/\.pdf$/i.test(selected.name)) {
      setJob({ status: "error", key: "invalid" })
      return
    }
    setFile(selected)
    setJob(null)
  }

  async function start() {
    if (!file || active.current) return
    const run = new AbortController()
    active.current = run
    setJob({ status: "working", progress: "opening" })
    try {
      const { convertPdf } = await import("./convert")
      const result = await convertPdf(file, {
        profile,
        signal: run.signal,
        onProgress(progress) {
          if (!run.signal.aborted) setJob({ status: "working", progress })
        },
      })
      if (run.signal.aborted) return
      setJob(
        result.status === "ready"
          ? {
              status: "ready",
              url: URL.createObjectURL(result.blob),
              filename: `${file.name.replace(/\.pdf$/i, "")}-pdfa-${profile}b.pdf`,
            }
          : { status: "error", key: result.status }
      )
    } catch {
      if (!run.signal.aborted) setJob({ status: "error", key: "failed" })
    } finally {
      if (active.current === run) active.current = null
    }
  }

  function cancel() {
    active.current?.abort()
    active.current = null
    setJob(null)
    startButton.current?.focus()
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          ref={picker}
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={(event) => {
            selectFile(event.currentTarget.files)
            event.currentTarget.value = ""
          }}
        />
        <button
          type="button"
          aria-disabled={busy || undefined}
          className={cn(
            "flex min-h-36 min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/35 p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:opacity-60",
            dragging && "border-primary bg-primary/5"
          )}
          onClick={() => {
            if (!active.current) picker.current?.click()
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!active.current) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            selectFile(event.dataTransfer.files)
          }}
        >
          <span className="rounded-xl border bg-background p-2.5 text-primary shadow-xs">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <span className="grid min-w-0 gap-1">
            <span className="font-medium wrap-anywhere" dir="auto">
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
          </span>
        </button>

        <Card>
          <CardContent className="grid gap-4">
            <fieldset
              disabled={busy}
              aria-describedby={`${id}-hint`}
              className="min-w-0"
            >
              <legend className="mb-2 font-medium">{m.standard}</legend>
              <div className="grid grid-cols-2 gap-2">
                {profiles.map(({ id: value, label }) => (
                  <label
                    key={value}
                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 has-checked:border-primary/65 has-checked:bg-primary/5 has-disabled:opacity-60"
                  >
                    <input
                      type="radio"
                      name={id}
                      className="size-4 shrink-0 accent-primary"
                      value={value}
                      checked={profile === value}
                      onChange={() => {
                        setProfile(value)
                        setJob(null)
                      }}
                    />
                    <span dir="ltr">{label}</span>
                  </label>
                ))}
              </div>
              <p id={`${id}-hint`} className="mt-2 text-muted-foreground">
                {m[profile === 2 ? "part2" : "part1"]}
              </p>
            </fieldset>
            <p id={`${id}-appearance`} className="text-muted-foreground">
              {m.appearance}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                ref={startButton}
                type="button"
                disabled={!file}
                aria-disabled={busy || undefined}
                aria-describedby={`${id}-appearance`}
                variant={job?.status === "ready" ? "outline" : "default"}
                className="h-auto min-h-10 max-w-full py-2 whitespace-normal aria-disabled:opacity-60"
                onClick={() => void start()}
              >
                <FileArchive aria-hidden="true" />
                {m.convert}
              </Button>
              {busy && (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10"
                  onClick={cancel}
                >
                  {m.cancel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div role="status" className={cn(!busy && !url && "sr-only")}>
        {busy && (
          <p className="flex items-center gap-2 text-sm">
            <LoaderCircle
              className="size-4 shrink-0 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {m[job.progress]}
          </p>
        )}
        {job?.status === "ready" && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
            <div className="flex min-w-0 items-center gap-3">
              <BadgeCheck
                className="size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">{m.ready}</p>
                <p
                  className="text-sm wrap-anywhere text-muted-foreground"
                  dir="auto"
                >
                  {job.filename}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-auto min-h-10 max-w-full py-2 whitespace-normal"
            >
              <a href={job.url} download={job.filename}>
                <Download aria-hidden="true" />
                {m.download}
              </a>
            </Button>
          </div>
        )}
      </div>
      {job?.status === "error" && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{m[job.key]}</AlertDescription>
        </Alert>
      )}
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="size-4 shrink-0" aria-hidden="true" />
        {m.privacy}
      </p>
    </div>
  )
}
