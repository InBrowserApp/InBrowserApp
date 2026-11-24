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
import { LoaderCircle, Search } from "@workspace/ui/icons"
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
  type Feedback,
  type PartialDownload,
} from "./feedback"
import type EnglishMessages from "./messages/en.json"

type View = Awaited<ReturnType<typeof entryView>>
type Job = "opening" | "preparing"

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
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<Feedback | null>(null)
  const [partial, setPartial] = useState<PartialDownload | null>(null)
  const [progress, setProgress] = useState("")

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setJob(null)
    setProgress("")
  }

  async function run(
    status: Job,
    action: (signal: AbortSignal) => Promise<void>
  ) {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setJob(status)
    setError(null)
    setPartial(null)
    setProgress("")
    try {
      await action(controller.signal)
    } catch (error) {
      if (!controller.signal.aborted) {
        if (error instanceof IpfsFileError) {
          setError({ message: messages[error.code], path: error.path })
        } else {
          const key =
            error instanceof IpfsPathError
              ? "pathMissing"
              : status === "opening"
                ? "unsupported"
                : "failed"
          setError({ message: messages[key] })
        }
      }
    } finally {
      if (active.current === controller) {
        active.current = null
        setJob(null)
        setProgress("")
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
        downloadBlob(file, name)
        return
      }
      const result = await zipAvailableIpfsDirectory(
        entry,
        store,
        signal,
        setProgress
      )
      signal.throwIfAborted()
      if (result.failed.length > 0) {
        setPartial({
          file: result.saved ? result.blob : null,
          paths: result.failed,
          name: `${name}.partial.zip`,
        })
      } else {
        downloadBlob(result.blob, `${name}.zip`)
      }
    })
  }

  const feedback = (
    <DownloadFeedback
      status={
        job
          ? progress
            ? messages.progress.replace("{path}", () => progress)
            : messages[job]
          : null
      }
      error={error}
      partial={partial}
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
              <Button type="submit" disabled={job === "opening"}>
                {job === "opening" ? (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Search data-icon="inline-start" aria-hidden="true" />
                )}
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
          busy={Boolean(job)}
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
