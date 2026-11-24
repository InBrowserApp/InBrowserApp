import { useId, useMemo, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ArrowRight,
  Check,
  FileText,
  Paperclip,
  Trash2,
  Upload,
} from "@workspace/ui/icons"
import { TEXT_LIMIT } from "./transfer"
import type { Messages } from "./types"
import type { useConnection } from "./use-connection"

type Connection = ReturnType<typeof useConnection>
type Draft = Readonly<{
  file: File | undefined
  setFile: (file: File | undefined) => void
  text: string
  setText: (text: string) => void
  mode: "file" | "text"
  setMode: (mode: "file" | "text") => void
}>

export function TransferPanel({
  messages: m,
  connection: c,
  draft,
}: Readonly<{ messages: Messages; connection: Connection; draft: Draft }>) {
  const id = useId()
  const { mode, setMode } = draft
  const [dragging, setDragging] = useState(false)
  const { outgoing } = c
  const sending = typeof outgoing === "number"
  const fileMode = mode === "file"
  const textTooLarge = useMemo(
    () => new Blob([draft.text]).size > TEXT_LIMIT,
    [draft.text]
  )
  const tooLarge = !fileMode && textTooLarge
  const value = fileMode ? draft.file : draft.text

  return (
    <div className="grid gap-5 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Check
            aria-hidden="true"
            className="size-5 text-emerald-600 dark:text-emerald-400"
          />
          {m.connected}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => c.reset()}
        >
          {m.disconnect}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "file", label: m.fileMode, Icon: Paperclip },
            { key: "text", label: m.textMode, Icon: FileText },
          ] as const
        ).map(({ key, label, Icon }) => (
          <Button
            key={key}
            type="button"
            variant={mode === key ? "secondary" : "ghost"}
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
          >
            <Icon aria-hidden="true" />
            {label}
          </Button>
        ))}
      </div>
      {fileMode ? (
        <label
          className={`grid cursor-pointer justify-items-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm focus-within:ring-2 focus-within:ring-ring hover:bg-muted/50 ${dragging ? "border-primary bg-primary/10" : "bg-background"}`}
          onDragOver={(event) => {
            event.preventDefault()
            if (!sending) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file && !sending) draft.setFile(file)
          }}
        >
          <Upload aria-hidden="true" className="size-6 text-muted-foreground" />
          <span className="font-medium">{m.chooseFile}</span>
          {draft.file && (
            <bdi className="max-w-full break-all text-muted-foreground">
              {draft.file.name}
            </bdi>
          )}
          <input
            type="file"
            disabled={sending}
            aria-label={m.chooseFile}
            className="sr-only"
            onChange={(event) => {
              draft.setFile(event.currentTarget.files?.[0])
              event.currentTarget.value = ""
            }}
          />
        </label>
      ) : (
        <div className="grid gap-2">
          <label htmlFor={id} className="text-sm font-medium">
            {m.textLabel}
          </label>
          <Textarea
            id={id}
            dir="auto"
            rows={4}
            placeholder={m.textPlaceholder}
            value={draft.text}
            onChange={(event) => draft.setText(event.target.value)}
            className="resize-y bg-background"
          />
        </div>
      )}
      {tooLarge && (
        <p role="status" className="text-sm text-destructive">
          {m.textTooLarge}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={!value || sending || tooLarge}
          onClick={() => {
            if (value) void c.send(value)
          }}
        >
          {fileMode
            ? c.resumeFile && c.resumeFile === value && !sending
              ? m.resumeFile
              : m.sendFile
            : m.sendText}
          <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
        </Button>
        {outgoing === value && (
          <p
            role="status"
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            <Check aria-hidden="true" className="size-4" />
            {m.sent}
          </p>
        )}
      </div>
      {sending && <TransferProgress label={m.sending} value={outgoing} />}
      {c.incoming !== null && (
        <TransferProgress label={m.receiving} value={c.incoming} />
      )}
    </div>
  )
}

function TransferProgress({
  label,
  value,
}: Readonly<{ label: string; value: number }>) {
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <progress className="h-2 w-full accent-primary" max={100} value={value} />
    </label>
  )
}

export function ReceivedPanel({
  messages: m,
  connection: c,
}: Readonly<{ messages: Messages; connection: Connection }>) {
  return (
    <div className="grid gap-3 border-t bg-background p-5 sm:p-7">
      {c.receivedFiles.map((received) => (
        <div
          key={received.file.name}
          className="grid gap-2 rounded-xl border p-4"
        >
          <h2 className="text-sm font-semibold">{m.receivedFile}</h2>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <bdi className="min-w-0 flex-1 text-sm break-all">
              {received.name}
            </bdi>
            <div className="flex flex-wrap items-center gap-2">
              <DocumentDownload
                file={received.file}
                filename={received.name}
                label={m.download}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={m.removeFile}
                title={m.removeFile}
                onClick={() => void c.removeFile(received.file)}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {c.receivedText !== undefined && (
        <div className="grid gap-2 rounded-xl border p-4">
          <h2 className="text-sm font-semibold">{m.receivedText}</h2>
          <pre
            dir="auto"
            className="max-h-48 overflow-auto text-sm break-words whitespace-pre-wrap"
          >
            {c.receivedText}
          </pre>
          <ToolCopyButton
            className="justify-self-start"
            value={c.receivedText}
            copyLabel={m.copyText}
            copiedLabel={m.copied}
            failedLabel={m.copyFailed}
          />
        </div>
      )}
    </div>
  )
}
