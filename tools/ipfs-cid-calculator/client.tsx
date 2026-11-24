import { useEffect, useRef, useState, type DragEvent } from "react"
import type { CID } from "multiformats/cid"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  File,
  FolderInput,
  Hash,
  LoaderCircle,
  Upload,
} from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import {
  calculateCid,
  compareCid,
  DEFAULT_SETTINGS,
  kuboCommand,
  type ImportSettings,
  type Selection,
} from "./core/cid"
import { ImportOptions } from "./import-options"
import { ResultPanel } from "./result-panel"
import type EnglishMessages from "./messages/en.json"

function CidCalculator({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const calculation = useRef<AbortController | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [result, setResult] = useState<CID | null>(null)
  const [expected, setExpected] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => () => calculation.current?.abort(), [])

  function cancel() {
    calculation.current?.abort()
    calculation.current = null
    setBusy(false)
  }

  function select(files: File[], directory: boolean) {
    const first = files[0]
    if (!first) return
    cancel()
    setSelection({
      name: directory ? first.webkitRelativePath.split("/")[0]! : first.name,
      directory,
      files,
    })
    setResult(null)
    setError("")
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const files = Array.from(event.dataTransfer.files)
    if (
      files.length > 1 ||
      event.dataTransfer.items?.[0]?.webkitGetAsEntry?.()?.isDirectory
    ) {
      setError(messages.singleFile)
      return
    }
    select(files, false)
  }

  async function run() {
    if (!selection) return
    const controller = new AbortController()
    calculation.current = controller
    setBusy(true)
    setResult(null)
    setError("")
    try {
      const cid = await calculateCid(selection, settings, controller.signal)
      if (!controller.signal.aborted) setResult(cid)
    } catch {
      if (!controller.signal.aborted) setError(messages.failed)
    } finally {
      if (calculation.current === controller) {
        calculation.current = null
        setBusy(false)
      }
    }
  }

  function updateSettings(next: ImportSettings) {
    setSettings(next)
    setResult(null)
    setError("")
  }

  const comparison =
    result && expected.trim() ? compareCid(expected, result) : null
  const format = new Intl.NumberFormat(language)
  const SelectionIcon = selection?.directory ? FolderInput : File

  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader>
          <CardTitle>{messages.input}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <div
            className={cn(
              "grid min-h-36 place-content-center justify-items-center gap-2 rounded-xl border border-dashed bg-muted/30 p-4 text-center",
              dragging && "border-primary bg-primary/5"
            )}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "copy"
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              )
                setDragging(false)
            }}
            onDrop={onDrop}
          >
            {selection ? (
              <>
                <SelectionIcon
                  aria-hidden="true"
                  className="size-6 text-muted-foreground"
                />
                <p
                  dir="auto"
                  className="max-w-full text-sm font-medium wrap-anywhere"
                >
                  {selection.name}
                </p>
                {selection.directory && (
                  <p className="text-xs text-muted-foreground">
                    {messages.files} · {format.format(selection.files.length)}
                  </p>
                )}
              </>
            ) : (
              <>
                <Upload
                  aria-hidden="true"
                  className="size-6 text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">{messages.drop}</p>
              </>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInput.current?.click()}
              >
                <File data-icon="inline-start" aria-hidden="true" />
                {messages.chooseFile}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => folderInput.current?.click()}
              >
                <FolderInput data-icon="inline-start" aria-hidden="true" />
                {messages.chooseFolder}
              </Button>
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            hidden
            onChange={(event) => {
              select(Array.from(event.target.files ?? []), false)
              event.target.value = ""
            }}
          />
          <input
            ref={folderInput}
            type="file"
            hidden
            multiple
            {...{ webkitdirectory: "" }}
            onChange={(event) => {
              select(Array.from(event.target.files ?? []), true)
              event.target.value = ""
            }}
          />
          <ImportOptions
            settings={settings}
            messages={messages}
            disabled={busy}
            onChange={updateSettings}
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={!selection || busy}
              onClick={() => void run()}
            >
              {busy ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <Hash aria-hidden="true" data-icon="inline-start" />
              )}
              {busy ? messages.calculating : messages.calculate}
            </Button>
            {busy && (
              <Button type="button" variant="outline" onClick={cancel}>
                {messages.cancel}
              </Button>
            )}
          </div>
        </ToolPanelCardContent>
      </ToolPanelCard>
      <ResultPanel
        messages={messages}
        result={result?.toString()}
        command={selection ? kuboCommand(selection, settings) : ""}
        expected={expected}
        comparison={comparison}
        busy={busy}
        setExpected={setExpected}
      />
    </div>
  )
}

export default CidCalculator
