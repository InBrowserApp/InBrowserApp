import { useEffect, useId, useRef, useState } from "react"
import { scoreFilename } from "@workspace/score-export/pages"
import { ScoreDownloadMenu } from "@workspace/ui/components/tool/score-download-menu"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { prepareAbc } from "./core/source"
import example from "./fixtures/morning-path.abc?raw"

import { abcLayout } from "./render-options"
import type english from "./messages/en.json"

type Preview =
  | { type: "empty" | "loading" | "invalid" }
  | { type: "noNotes"; warnings: string[] }
  | { type: "ready"; warnings: string[]; source: string; title?: string }

function warningText(warning: string) {
  return warning
    .replace(/<span[^>]*>|<\/span>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
}

export default function AbcNotationPreviewer({
  messages: m,
  language = "en",
}: {
  messages: typeof english
  language?: string
}) {
  const field = useId()
  const previewLabel = useId()
  const score = useRef<HTMLDivElement>(null)
  const [source, setSource] = useState("")
  const [importedName, setImportedName] = useState("")
  const [width, setWidth] = useState(600)
  const [preview, setPreview] = useState<Preview>({ type: "empty" })
  const [fileError, setFileError] = useState(false)
  const importer = useTextFileImport()

  function edit(value: string, filename?: string) {
    importer.cancel()
    setFileError(false)
    setSource(value)
    if (filename !== undefined || !value.trim()) setImportedName(filename ?? "")
  }

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry!.contentRect.width))
    )
    observer.observe(score.current!)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const host = score.current!
    if (!source.trim()) {
      host.replaceChildren()
      setPreview({ type: "empty" })
      return
    }

    let cancelled = false
    setPreview((previous) =>
      previous.type === "empty" ? { type: "loading" } : previous
    )

    async function draw() {
      try {
        const { renderAbc, TuneBook } = await import("abcjs")
        if (cancelled) return
        host.replaceChildren()
        const warnings: string[] = []
        const book = new TuneBook(prepareAbc(source))
        const options = {
          ...abcLayout(Math.max(220, width - 20)),
          responsive: "resize" as const,
          paddingright: 8,
          paddingleft: 8,
        }
        for (const tune of book.tunes) {
          const target = document.createElement("div")
          host.append(target)
          const [result] = renderAbc(target, tune.abc, options)
          if (result?.warnings) {
            const tuneLabel = book.tunes.length > 1 ? `X:${tune.id} · ` : ""
            warnings.push(
              ...result.warnings.map(
                (warning) => tuneLabel + warningText(warning)
              )
            )
          }
          if (!result?.lines.some((line) => line.staff?.length)) target.remove()
        }
        setPreview(
          host.childElementCount
            ? {
                type: "ready",
                source,
                title:
                  book.tunes.length === 1 ? book.tunes[0]?.title : undefined,
                warnings,
              }
            : { type: "noNotes", warnings }
        )
      } catch {
        if (!cancelled) {
          host.replaceChildren()
          setPreview({ type: "invalid" })
        }
      }
    }

    const timer = window.setTimeout(() => void draw(), 160)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [source, width])

  const ready = preview.type === "ready" && preview.source === source
  const name = importedName || (ready ? preview.title : "") || "score"

  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
      <ToolPanelCard className="min-w-0">
        <ToolPanelCardContent className="gap-3">
          <Label htmlFor={field} className="text-base">
            {m.source}
          </Label>
          <div className="flex flex-wrap gap-2 [&_button]:min-h-11 sm:[&_button]:min-h-8">
            <ToolOpenTextFile
              accept=".abc,.txt,text/plain"
              label={m.open}
              onFile={(file) =>
                void importer.read(
                  file,
                  (value) =>
                    edit(value, file.name.replace(/\.(?:abc|txt)$/i, "")),
                  () => setFileError(true)
                )
              }
            />
            {!source.trim() && (
              <Button
                type="button"
                variant="outline"
                onClick={() => edit(example)}
              >
                {m.example}
              </Button>
            )}
          </div>
          <Textarea
            id={field}
            value={source}
            onChange={(event) => edit(event.currentTarget.value)}
            placeholder={m.placeholder}
            dir="ltr"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            wrap="off"
            className="![field-sizing:fixed] min-h-52 resize-y font-mono text-sm lg:min-h-80"
          />
          {fileError && (
            <p role="alert" className="text-sm text-destructive">
              {m.fileError}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <ToolPanelCard className="min-w-0">
        <ToolPanelCardContent className="gap-3">
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
            <h2 id={previewLabel} className="text-base font-medium">
              {m.preview}
            </h2>
            {source.trim() && (
              <ScoreDownloadMenu
                messages={m}
                onScore={
                  ready
                    ? async (format) => {
                        const { exportAbc } = await import("./export-score")
                        return exportAbc(source, format, name, language)
                      }
                    : undefined
                }
                source={{
                  label: m.downloadSource,
                  file: () => ({
                    blob: new Blob([source], {
                      type: "text/vnd.abc; charset=utf-8",
                    }),
                    filename: `${scoreFilename(name)}.abc`,
                  }),
                }}
              />
            )}
          </div>
          <div className="min-h-52 rounded-lg border lg:min-h-80">
            {preview.type === "invalid" && (
              <p role="alert" className="p-4 text-sm text-destructive">
                {m.invalid}
              </p>
            )}
            {(preview.type === "empty" ||
              preview.type === "loading" ||
              preview.type === "noNotes") && (
              <p role="status" className="p-4 text-sm text-muted-foreground">
                {m[preview.type]}
              </p>
            )}
            <div
              ref={score}
              role="region"
              aria-labelledby={previewLabel}
              dir="ltr"
              className="w-full overflow-hidden rounded-lg bg-white text-black [&_svg]:block [&_svg]:max-w-full [&>div+div]:border-t"
            />
          </div>
          {"warnings" in preview && preview.warnings.length > 0 && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer">{m.warnings}</summary>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                {preview.warnings.map((warning, index) => (
                  <li
                    className="wrap-anywhere"
                    dir="auto"
                    lang="en"
                    key={index}
                  >
                    {warning}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}
