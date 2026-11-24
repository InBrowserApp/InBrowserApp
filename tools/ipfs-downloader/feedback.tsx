import { Button } from "@workspace/ui/components/ui/button"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import type EnglishMessages from "./messages/en.json"

export type DownloadOperation = {
  status: "opening" | "preparing"
  path?: string
}
export type DownloadOutcome =
  | { kind: "error"; message: string; path?: string }
  | { kind: "partial"; file: Blob | null; paths: string[]; name: string }

export function DownloadFeedback({
  operation,
  outcome,
  messages,
  cancel,
}: {
  operation: DownloadOperation | null
  outcome: DownloadOutcome | null
  messages: typeof EnglishMessages
  cancel: () => void
}) {
  if (operation) {
    const { status, path } = operation
    return (
      <div className="flex flex-wrap items-center gap-2">
        <p
          role="status"
          dir="auto"
          className="flex min-w-0 items-center gap-2 text-sm wrap-anywhere text-muted-foreground"
        >
          <LoaderCircle
            className="size-4 shrink-0 animate-spin"
            aria-hidden="true"
          />
          {path
            ? messages.progress.replace("{path}", () => path)
            : messages[status]}
        </p>
        <Button type="button" size="sm" variant="ghost" onClick={cancel}>
          {messages.cancel}
        </Button>
      </div>
    )
  }

  if (!outcome) return null

  if (outcome.kind === "error") {
    return (
      <div
        role="alert"
        className="grid gap-1 text-sm wrap-anywhere text-destructive"
      >
        <p>{outcome.message}</p>
        {outcome.path && (
          <p dir="auto" className="font-mono text-xs">
            {outcome.path}
          </p>
        )}
      </div>
    )
  }

  const { file, paths, name } = outcome
  return (
    <div className="grid gap-2 rounded-lg border p-3">
      <p role="alert" className="text-sm font-medium">
        {messages.incomplete}
      </p>
      <ul className="max-h-48 space-y-1 overflow-auto font-mono text-xs text-muted-foreground">
        {paths.map((path) => (
          <li key={path} dir="auto" className="wrap-anywhere">
            {path}
          </li>
        ))}
      </ul>
      {file && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="justify-self-start"
          onClick={() => downloadBlob(file, name)}
        >
          <Download data-icon="inline-start" aria-hidden="true" />
          {messages.available}
        </Button>
      )}
    </div>
  )
}
