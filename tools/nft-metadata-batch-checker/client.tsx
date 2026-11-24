import { useEffect, useId, useRef, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileCheck } from "@workspace/ui/icons"

import { checkBatch, type Item, type Result } from "./core/batch"
import { expandUriPattern } from "./core/pattern"
import {
  exampleFiles,
  LocalFileInput,
  UriPatternInput,
  type PatternInput,
} from "./inputs"
import type EnglishMessages from "./messages/en.json"
import MetadataResults from "./results"

type Mode = "files" | "urls" | "pattern"
type InputProblem =
  | "noFiles"
  | "noUrls"
  | "invalidPattern"
  | "invalidRange"
  | "unavailable"
type Selection = { items: Item[]; paths: string[]; folder: boolean }
const modes = ["files", "urls", "pattern"] as const
const metadataName = /\.json$|^(?:\d+|[\da-f]{64})$/i

function filePath(file: File) {
  return file.webkitRelativePath || file.name
}

function localSelection(files: readonly File[], folder: boolean): Selection {
  const paths: string[] = []
  const items: Item[] = []
  for (const file of files) {
    const source = filePath(file)
    paths.push(source)
    if (metadataName.test(file.name) || file.type === "application/json") {
      items.push({ source, file })
    }
  }
  return { paths, items, folder }
}

export default function NftMetadataChecker({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const [mode, setMode] = useState<Mode>("files")
  const [selection, setSelection] = useState<Selection | null>(null)
  const [uriList, setUriList] = useState("")
  const [pattern, setPattern] = useState<PatternInput>({
    uri: "",
    first: "1",
    last: "10",
    format: "decimal",
  })
  const [checkMedia, setCheckMedia] = useState(false)
  const [inputError, setInputError] = useState<InputProblem | null>(null)
  const [progress, setProgress] = useState<{
    completed: number
    total: number
  } | null>(null)
  const [results, setResults] = useState<Result[] | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  function stop() {
    active.current?.abort()
    active.current = null
    setProgress(null)
  }

  function edit() {
    stop()
    setInputError(null)
    setResults(null)
  }

  async function run(items: readonly Item[], local?: Selection) {
    edit()
    const controller = new AbortController()
    const { signal } = controller
    active.current = controller
    const total = items.length
    setProgress({ completed: 0, total })
    try {
      const report = await checkBatch(items, {
        signal,
        checkMedia,
        localFiles: new Set(local?.paths),
        completeFolder: local?.folder ?? false,
        onProgress: (completed) => {
          if (!signal.aborted) setProgress({ completed, total })
        },
      })
      if (!signal.aborted) setResults(report)
    } catch {
      if (!signal.aborted) setInputError("unavailable")
    } finally {
      if (active.current === controller) stop()
    }
  }

  function submit() {
    if (mode === "files") {
      if (!selection?.items.length) setInputError("noFiles")
      else void run(selection.items, selection)
      return
    }
    if (mode === "urls") {
      const sources = [
        ...new Set(
          uriList
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
        ),
      ]
      if (sources.length === 0) setInputError("noUrls")
      else void run(sources.map((source) => ({ source })))
      return
    }
    const expanded = expandUriPattern(
      pattern.uri,
      pattern.first,
      pattern.last,
      pattern.format
    )
    if ("error" in expanded) setInputError(expanded.error)
    else void run(expanded.items)
  }

  const busy = progress !== null
  const format = new Intl.NumberFormat(language)

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <Tabs
              dir={language === "ar" || language === "he" ? "rtl" : "ltr"}
              value={mode}
              onValueChange={(value) => {
                edit()
                setMode(value as Mode)
              }}
              className="gap-3"
            >
              <TabsList className="max-w-full">
                {modes.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {messages[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="files">
                <LocalFileInput
                  count={selection?.items.length ?? 0}
                  language={language}
                  messages={messages}
                  onSelect={(files, folder) => {
                    edit()
                    const next = localSelection(files, folder)
                    setSelection(next)
                    if (next.items.length === 0) setInputError("noFiles")
                  }}
                />
              </TabsContent>
              <TabsContent value="urls">
                <Field>
                  <FieldLabel htmlFor={`${id}-urls`}>
                    {messages.urlList}
                  </FieldLabel>
                  <Textarea
                    id={`${id}-urls`}
                    dir="ltr"
                    className="min-h-30 font-mono"
                    spellCheck={false}
                    autoCapitalize="off"
                    value={uriList}
                    placeholder="ipfs://…&#10;https://…"
                    onChange={(event) => {
                      edit()
                      setUriList(event.target.value)
                    }}
                  />
                </Field>
              </TabsContent>
              <TabsContent value="pattern">
                <UriPatternInput
                  value={pattern}
                  messages={messages}
                  onChange={(value) => {
                    edit()
                    setPattern(value)
                  }}
                />
              </TabsContent>
            </Tabs>
            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={checkMedia}
                onCheckedChange={(checked) => {
                  edit()
                  setCheckMedia(checked === true)
                }}
              />
              {messages.checkMedia}
            </label>
            {inputError && (
              <p role="alert" className="text-sm text-destructive">
                {messages[inputError]}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={busy}>
                <FileCheck data-icon="inline-start" aria-hidden="true" />
                {messages.run}
              </Button>
              {busy ? (
                <Button type="button" variant="ghost" onClick={stop}>
                  {messages.cancel}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const selection = localSelection(exampleFiles(), false)
                    setMode("files")
                    setSelection(selection)
                    void run(selection.items, selection)
                  }}
                >
                  {messages.example}
                </Button>
              )}
            </div>
          </form>
          {progress && (
            <div className="grid gap-1">
              <p className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>{messages.progress}</span>
                <bdi className="tabular-nums">
                  {format.format(progress.completed)} /{" "}
                  {format.format(progress.total)}
                </bdi>
              </p>
              <progress
                className="w-full accent-primary"
                aria-label={messages.progress}
                max={progress.total}
                value={progress.completed}
              />
            </div>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <p role="status" className="sr-only">
        {progress ? messages.progress : results && messages.results}
      </p>
      {results && (
        <MetadataResults
          results={results}
          language={language}
          messages={messages}
        />
      )}
    </div>
  )
}
