import { useEffect, useMemo, useRef, useState } from "react"
import { getSpokenLanguages } from "@workspace/local-speech"
import type { Segment } from "@workspace/local-speech/transcript"
import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import { Button } from "@workspace/ui/components/ui/button"
import { FileText, Sparkles } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { ExportActions, selectClass } from "./export-actions"
import { SubtitleEditor } from "./editor"
import {
  readSubtitles,
  subtitleFile,
  parseSrt,
  mergeOverlaps,
} from "./subtitles"
import { JobFeedback } from "./job-feedback"
import { useJob } from "./use-job"
import { VideoPicker } from "./video-picker"
import type { Controls, SubtitleRow, VideoFormat } from "./types"

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    const next = blob ? URL.createObjectURL(blob) : undefined
    setUrl(next)
    return () => {
      if (next) URL.revokeObjectURL(next)
    }
  }, [blob])
  return url
}

export default function Client({
  lang,
  messages: m,
}: {
  lang: string
  messages: Controls
}) {
  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<SubtitleRow[]>([])
  const [language, setLanguage] = useState("")
  const [format, setFormat] = useState<VideoFormat>("mp4")
  const [previewFailed, setPreviewFailed] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  const srtInput = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)
  const { status, notice, setNotice, run, cancel } = useJob()
  const busy = Boolean(status)
  const url = useObjectUrl(file)
  const { segments, invalid } = useMemo(() => readSubtitles(rows), [rows])
  const preview = useMemo(() => {
    const cues = segments.filter(({ start, end }) => start >= 0 && end > start)
    return cues.length
      ? new Blob([subtitleFile(cues, "vtt")], { type: "text/vtt" })
      : null
  }, [segments])
  const track = useObjectUrl(preview)
  const languages = useMemo(() => getSpokenLanguages(lang), [lang])
  const stem = file?.name.replace(/\.[^.]+$/, "") || "video"

  function newRow({ start, end, text }: Segment): SubtitleRow {
    return {
      id: nextId.current++,
      start: String(start / 1000),
      end: String(end / 1000),
      text,
    }
  }

  function selectVideo(video: File) {
    setFile(video)
    setPreviewFailed(false)
    setRows([])
    setNotice(null)
    setFormat(/\.(mkv|webm)$/i.test(video.name) ? "mkv" : "mp4")
  }

  async function generate(video: File) {
    await run(
      { label: "extracting" },
      "decodeError",
      async (signal, update) => {
        const { readVideoAudio } = await import("./media")
        const audio = await readVideoAudio(video, signal)
        signal.throwIfAborted()
        update({ label: "loadingModel" }, "recognitionError")
        const { recognize } = await import("./recognize")
        const cues = await recognize(
          audio,
          language,
          signal,
          ({ type, progress, backend }) => {
            update({
              label: type === "loading" ? "loadingModel" : "transcribing",
              progress,
              backend,
            })
          }
        )
        signal.throwIfAborted()
        if (cues.length) setRows(cues.map(newRow))
        else setNotice({ label: "noSpeech", error: true })
      }
    )
  }

  async function importSrt(subtitle: File) {
    await run({ label: "importSrt" }, "invalidSrt", async (signal) => {
      const cues = parseSrt(await subtitle.text())
      signal.throwIfAborted()
      if (!cues.length) throw new Error("Empty SRT")
      setRows(cues.map(newRow))
    })
  }

  function addSubtitle() {
    const latest = rows.reduce(
      (last, { end }) => Math.max(last, Number(end) * 1000),
      0
    )
    const start = Math.round(
      Math.max(latest, (player.current?.currentTime ?? 0) * 1000)
    )
    const row = newRow({ start, end: start + 2000, text: "" })
    setRows([...rows, row])
  }

  async function exportVideo(video: File) {
    await run({ label: "exporting" }, "exportError", async (signal) => {
      const { embedSubtitles } = await import("./media")
      const cues = format === "mp4" ? mergeOverlaps(segments) : segments
      const blob = await embedSubtitles(
        video,
        subtitleFile(cues, "srt"),
        format,
        signal
      )
      signal.throwIfAborted()
      downloadBlob(blob, `${stem}-subtitled.${format}`)
      setNotice({ label: "exportComplete", error: false })
    })
  }

  return (
    <ToolSurface className="space-y-5">
      <VideoPicker
        file={file}
        disabled={busy}
        onVideo={selectVideo}
        messages={m}
      />
      {file && (
        <>
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-3">
              <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl bg-black">
                {previewFailed ? (
                  <p className="max-w-sm p-5 text-center text-sm text-white">
                    {m.previewUnavailable}
                  </p>
                ) : (
                  /* oxlint-disable jsx-a11y/media-has-caption -- The caption track is generated or imported by the user. */
                  <video
                    src={url}
                    ref={player}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={m.videoPreview}
                    className="absolute inset-0 size-full object-contain"
                    onError={() => setPreviewFailed(true)}
                  >
                    {track && (
                      <track
                        kind="subtitles"
                        src={track}
                        label={m.subtitleEditor}
                        default
                      />
                    )}
                  </video>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {m.localProcessing}
              </p>
            </div>
            <div className="min-w-0 space-y-4">
              <div className="space-y-3 rounded-xl border bg-muted/25 p-3 sm:p-4">
                <label className="grid gap-1.5 text-sm font-medium">
                  {m.speechLanguage}
                  <select
                    className={selectClass}
                    value={language}
                    disabled={busy}
                    onChange={(event) => setLanguage(event.currentTarget.value)}
                  >
                    <option value="">{m.autoDetect}</option>
                    {languages.map(({ code, name }) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="h-auto min-h-9 whitespace-normal"
                    onClick={() => void generate(file)}
                    disabled={busy}
                  >
                    <Sparkles aria-hidden />
                    {m.generate}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => srtInput.current?.click()}
                    disabled={busy}
                  >
                    <FileText aria-hidden />
                    {m.importSrt}
                  </Button>
                  <input
                    ref={srtInput}
                    hidden
                    type="file"
                    disabled={busy}
                    accept=".srt,application/x-subrip"
                    aria-label={m.importSrt}
                    onChange={(event) => {
                      const subtitle = event.currentTarget.files?.[0]
                      if (subtitle) void importSrt(subtitle)
                      event.currentTarget.value = ""
                    }}
                  />
                </div>
              </div>
              <SubtitleEditor
                rows={rows}
                disabled={busy}
                canPreview={Boolean(url) && !previewFailed}
                onAdd={addSubtitle}
                onChange={(row) =>
                  setRows(rows.map((old) => (old.id === row.id ? row : old)))
                }
                onRemove={(id) => setRows(rows.filter((row) => row.id !== id))}
                onJump={(seconds) => {
                  if (!player.current || !Number.isFinite(seconds)) return
                  player.current.currentTime = seconds
                  void player.current.play().catch(() => {})
                }}
                messages={m}
              />
            </div>
          </div>
          <JobFeedback
            messages={m}
            lang={lang}
            status={status}
            notice={notice}
            invalid={invalid}
            cancel={cancel}
          />
          {segments.length > 0 && (
            <ExportActions
              messages={m}
              format={format}
              onFormat={setFormat}
              disabled={busy || invalid}
              onSrt={() =>
                downloadBlob(
                  new Blob([subtitleFile(segments, "srt")], {
                    type: "application/x-subrip;charset=utf-8",
                  }),
                  `${stem}.srt`
                )
              }
              onVideo={() => void exportVideo(file)}
            />
          )}
        </>
      )}
    </ToolSurface>
  )
}
