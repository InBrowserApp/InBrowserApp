import { useEffect, useId, useMemo, useRef, useState } from "react"

import {
  IpfsFileError,
  readIpfsFile,
  zipAvailableIpfsDirectory,
  type IpfsReference,
} from "@workspace/ipfs-files"
import { FileBrowserPanel } from "@workspace/ui/components/tool/file-browser-panel"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Search } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import {
  addressView,
  entryView,
  gatewayStore,
  IpfsPathError,
  parseIpfsAddress,
  sampleAddress,
} from "./core/gateway"
import {
  DownloadFeedback,
  type DownloadOutcome,
  type DownloadOperation,
} from "./feedback"
import type EnglishMessages from "./messages/en.json"

type View = Awaited<ReturnType<typeof entryView>>

export default function IpfsDownloader({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const store = useMemo(() => gatewayStore(), [])
  const [address, setAddress] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [view, setView] = useState<View | null>(null)
  const [operation, setOperation] = useState<DownloadOperation | null>(null)
  const [outcome, setOutcome] = useState<DownloadOutcome | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setOperation(null)
  }

  async function run(
    status: DownloadOperation["status"],
    action: (signal: AbortSignal) => Promise<void>
  ) {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setOperation({ status })
    setOutcome((previous) =>
      status === "preparing" && previous?.kind === "partial" ? previous : null
    )
    try {
      await action(controller.signal)
    } catch (error) {
      if (!controller.signal.aborted) {
        if (error instanceof IpfsFileError) {
          setOutcome({
            kind: "error",
            message: messages[error.code],
            path: error.path,
          })
        } else {
          const key =
            error instanceof IpfsPathError
              ? "pathMissing"
              : status === "opening"
                ? "unsupported"
                : "failed"
          setOutcome({ kind: "error", message: messages[key] })
        }
      }
    } finally {
      if (active.current === controller) {
        active.current = null
        setOperation(null)
      }
    }
  }

  function open(input: string) {
    const parsed = parseIpfsAddress(input)
    setInvalid(!parsed)
    if (!parsed) return
    setView(null)
    void run("opening", async (signal) => {
      const next = await addressView(parsed, store, signal)
      signal.throwIfAborted()
      setView(next)
    })
  }

  function browse(path: readonly IpfsReference[]) {
    void run("opening", async (signal) => {
      const next = await entryView(path, store, signal)
      signal.throwIfAborted()
      setView(next)
    })
  }

  function download() {
    if (!view) return
    const { entry, path } = view
    const name = path.at(-1)!.name
    void run("preparing", async (signal) => {
      if (entry.type !== "directory") {
        const file = await readIpfsFile(entry, signal)
        signal.throwIfAborted()
        setOutcome(null)
        downloadBlob(file, name)
        return
      }
      const result = await zipAvailableIpfsDirectory(
        entry,
        store,
        signal,
        (path) => {
          if (!signal.aborted) setOperation({ status: "preparing", path })
        }
      )
      signal.throwIfAborted()
      if (result.failed.length > 0) {
        setOutcome({
          kind: "partial",
          file: result.saved ? result.blob : null,
          paths: result.failed,
          name: `${name}.partial.zip`,
        })
      } else {
        setOutcome(null)
        downloadBlob(result.blob, `${name}.zip`)
      }
    })
  }

  const feedback = (
    <DownloadFeedback
      operation={operation}
      outcome={outcome}
      messages={messages}
      cancel={cancel}
    />
  )

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              open(address)
            }}
          >
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor={id}>{messages.address}</FieldLabel>
              <Input
                id={id}
                dir="ltr"
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                value={address}
                placeholder="ipfs://bafy…"
                onChange={(event) => {
                  setAddress(event.target.value)
                  setInvalid(false)
                }}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${id}-error` : undefined}
              />
              {invalid && (
                <FieldError id={`${id}-error`}>{messages.invalid}</FieldError>
              )}
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={operation?.status === "opening"}>
                <Search data-icon="inline-start" aria-hidden="true" />
                {messages.open}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAddress(sampleAddress)
                  open(sampleAddress)
                }}
              >
                {messages.example}
              </Button>
            </div>
          </form>
          {!view && feedback}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {view && (
        <FileBrowserPanel
          path={view.path.map(({ name }) => name).join(" / ")}
          entries={
            view.entry.type === "directory"
              ? view.children.map(({ name }) => name)
              : null
          }
          size={
            view.entry.type === "directory"
              ? null
              : new Intl.NumberFormat(language, {
                  style: "unit",
                  unit: "byte",
                }).format(view.entry.size)
          }
          labels={messages}
          busy={Boolean(operation)}
          feedback={feedback}
          onBack={
            view.path.length > 1
              ? () => browse(view.path.slice(0, -1))
              : undefined
          }
          onOpen={(index) => browse([...view.path, view.children[index]!])}
          onDownload={download}
        />
      )}
    </div>
  )
}
