import { useEffect, useId, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Code, Download, Eye, Maximize2 } from "@workspace/ui/icons"
import { examples } from "./examples"

import type Messages from "./messages/en.json"

type Result = { source: string } & ({ svg: string } | { error: string })
type Example = keyof typeof examples

const exampleNames = Object.keys(examples) as Example[]

export default function Client({ messages: m }: { messages: typeof Messages }) {
  const sourceId = useId()
  const previewId = useId()
  const [source, setSource] = useState(examples.flowchart)
  const [result, setResult] = useState<Result>()
  const [actualSize, setActualSize] = useState(false)
  const [pngExport, setPngExport] = useState<"busy" | Result>()
  const current = result?.source === source ? result : undefined
  const svg = current && "svg" in current ? current.svg : undefined
  const error = current && "error" in current ? current.error : undefined
  const url = svg && `data:image/svg+xml,${encodeURIComponent(svg)}`
  const exporting = pngExport === "busy"

  useEffect(() => {
    if (!source.trim()) return

    let obsolete = false
    const timer = window.setTimeout(async () => {
      try {
        const { renderDiagram } = await import("./render")
        if (obsolete) return
        const svg = await renderDiagram(source)
        if (!obsolete) setResult({ source, svg })
      } catch (error) {
        if (!obsolete)
          setResult({
            source,
            error: error instanceof Error ? error.message : "",
          })
      }
    }, 250)

    return () => {
      obsolete = true
      window.clearTimeout(timer)
    }
  }, [source])

  async function savePng() {
    if (!url) return
    setPngExport("busy")
    try {
      const { createPng, download } = await import("./render")
      download(await createPng(url), "mermaid-diagram.png")
      setPngExport(undefined)
    } catch {
      setPngExport(current)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
          <label
            htmlFor={sourceId}
            className="flex items-center gap-2 font-medium"
          >
            <Code aria-hidden="true" className="size-4 text-muted-foreground" />
            {m.source}
          </label>
          <Select
            value=""
            onValueChange={(value) => setSource(examples[value as Example])}
          >
            <SelectTrigger aria-label={m.example}>
              <SelectValue placeholder={m.example} />
            </SelectTrigger>
            <SelectContent position="popper">
              {exampleNames.map((key) => (
                <SelectItem key={key} value={key}>
                  {m[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          id={sourceId}
          dir="ltr"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          wrap="off"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="h-56 flex-auto resize-none rounded-none border-0 p-4 font-mono focus-visible:ring-inset sm:h-72 lg:h-96"
        />
      </section>

      <section
        aria-labelledby={previewId}
        className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
      >
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
          <h2 id={previewId} className="flex items-center gap-2 font-medium">
            <Eye aria-hidden="true" className="size-4 text-muted-foreground" />
            {m.preview}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <DocumentIconButton
              label={m.fit}
              disabled={!url}
              aria-pressed={!actualSize}
              className="aria-pressed:bg-accent"
              onClick={() => setActualSize(false)}
            >
              <Maximize2 aria-hidden="true" />
            </DocumentIconButton>
            <Button
              size="sm"
              variant="ghost"
              aria-label={m.actualSize}
              title={m.actualSize}
              disabled={!url}
              aria-pressed={actualSize}
              className="aria-pressed:bg-accent"
              onClick={() => setActualSize(true)}
            >
              1:1
            </Button>
            <Button
              asChild={Boolean(url)}
              variant="outline"
              size="sm"
              disabled={!url}
            >
              {url ? (
                <a
                  href={url}
                  download="mermaid-diagram.svg"
                  data-astro-prefetch="false"
                >
                  <Download data-icon="inline-start" aria-hidden="true" />
                  {m.downloadSvg}
                </a>
              ) : (
                <span>{m.downloadSvg}</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!url || exporting}
              aria-busy={exporting}
              onClick={() => void savePng()}
            >
              <Download data-icon="inline-start" aria-hidden="true" />
              {m.downloadPng}
            </Button>
          </div>
        </div>
        <div className="relative min-h-56 flex-1 bg-white text-zinc-700 sm:min-h-72 lg:min-h-96">
          {url ? (
            <div
              role="group"
              aria-labelledby={previewId}
              dir="ltr"
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keep the full-size preview keyboard-scrollable.
              tabIndex={actualSize ? 0 : undefined}
              className="absolute inset-0 overflow-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div
                className={
                  actualSize
                    ? "flex min-h-full w-max min-w-full p-4"
                    : "size-full p-4"
                }
              >
                <img
                  src={url}
                  alt={m.preview}
                  className={
                    actualSize
                      ? "m-auto block h-auto w-auto max-w-none"
                      : "block size-full object-scale-down"
                  }
                />
              </div>
            </div>
          ) : (
            <div
              role="status"
              className="absolute inset-0 grid min-w-0 content-center p-4 text-center text-sm"
            >
              {error !== undefined ? (
                <>
                  <p className="font-medium text-red-800">{m.invalid}</p>
                  {error && (
                    <pre
                      dir="ltr"
                      className="mt-2 max-h-32 overflow-auto text-start text-xs break-words whitespace-pre-wrap"
                    >
                      {error}
                    </pre>
                  )}
                </>
              ) : source.trim() ? (
                m.loading
              ) : (
                m.empty
              )}
            </div>
          )}
        </div>
        {current && pngExport === current && (
          <p
            role="status"
            className="border-t px-4 py-2 text-sm text-destructive"
          >
            {m.exportError}
          </p>
        )}
      </section>
    </div>
  )
}
