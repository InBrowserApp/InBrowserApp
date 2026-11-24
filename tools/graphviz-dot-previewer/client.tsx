import { useEffect, useId, useMemo, useRef, useState } from "react"
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
import { graphSvgUrl } from "./graph-svg"

import type { GraphInput, GraphResult } from "./graph-worker"
import type Messages from "./messages/en.json"

type Example = keyof typeof examples

const exampleNames = Object.keys(examples) as Example[]
const engines = [
  "dot",
  "neato",
  "fdp",
  "sfdp",
  "circo",
  "twopi",
  "osage",
  "patchwork",
]

export default function Client({ messages: m }: { messages: typeof Messages }) {
  const sourceId = useId()
  const previewId = useId()
  const [input, setInput] = useState<GraphInput>(examples.dependencies)
  const [result, setResult] = useState<GraphResult>()
  const [actualSize, setActualSize] = useState(false)
  const worker = useRef<Worker>(null)
  const { source, engine } = input
  const current =
    result?.source === source && result.engine === engine ? result : undefined
  const svg = current?.svg
  const url = useMemo(() => (svg ? graphSvgUrl(svg) : undefined), [svg])
  const notes = current?.notes.join("\n")

  useEffect(() => {
    const graphWorker = new Worker(
      new URL("./graph-worker.ts", import.meta.url),
      { type: "module" }
    )
    worker.current = graphWorker
    return () => graphWorker.terminate()
  }, [])

  useEffect(() => {
    const graphWorker = worker.current
    if (!graphWorker || !source.trim()) return

    function receive(event: MessageEvent<GraphResult>) {
      if (event.data.source === source && event.data.engine === engine)
        setResult(event.data)
    }
    function failed() {
      setResult({ source, engine, notes: [] })
    }

    graphWorker.addEventListener("message", receive)
    graphWorker.addEventListener("error", failed)
    const timer = window.setTimeout(
      () => graphWorker.postMessage({ source, engine }),
      250
    )
    return () => {
      window.clearTimeout(timer)
      graphWorker.removeEventListener("message", receive)
      graphWorker.removeEventListener("error", failed)
    }
  }, [source, engine])

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
            onValueChange={(value) => setInput(examples[value as Example])}
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
          onChange={(event) => setInput({ source: event.target.value, engine })}
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
            <span className="text-sm text-muted-foreground">{m.engine}</span>
            <Select
              value={engine}
              onValueChange={(engine) => setInput({ source, engine })}
            >
              <SelectTrigger
                aria-label={m.engine}
                dir="ltr"
                className="font-mono"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" dir="ltr" className="font-mono">
                {engines.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              asChild={Boolean(url)}
              variant="outline"
              size="sm"
              disabled={!url}
            >
              {url ? (
                <a
                  href={url}
                  download="graphviz-graph.svg"
                  data-astro-prefetch="false"
                >
                  <Download data-icon="inline-start" aria-hidden="true" />
                  {m.downloadSvg}
                </a>
              ) : (
                <span>{m.downloadSvg}</span>
              )}
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
              {current ? (
                <>
                  <p className="font-medium text-red-800">{m.invalid}</p>
                  {notes && (
                    <pre
                      dir="ltr"
                      className="mt-2 max-h-32 overflow-auto text-start text-xs break-words whitespace-pre-wrap"
                    >
                      {notes}
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
        {url && notes && (
          <details className="border-t px-4 py-2 text-sm">
            <summary className="cursor-pointer">{m.warnings}</summary>
            <pre
              dir="ltr"
              className="mt-2 max-h-32 overflow-auto text-xs break-words whitespace-pre-wrap"
            >
              {notes}
            </pre>
          </details>
        )}
      </section>
    </div>
  )
}
