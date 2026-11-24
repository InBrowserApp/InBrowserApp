import { Button } from "@workspace/ui/components/ui/button"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import type EnglishMessages from "./messages/en.json"

export type Feedback = { message: string; path?: string }
export type PartialDownload = {
  file: Blob | null
  paths: string[]
  name: string
}

export function DownloadFeedback({
  status,
  error,
  partial,
  messages,
  cancel,
}: {
  status: string | null
  error: Feedback | null
  partial: PartialDownload | null
  messages: typeof EnglishMessages
  cancel: () => void
}) {
  return (
    <>
      {status && (
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
            {status}
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={cancel}>
            {messages.cancel}
          </Button>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="grid gap-1 text-sm wrap-anywhere text-destructive"
        >
          <p>{error.message}</p>
          {error.path && (
            <p dir="auto" className="font-mono text-xs">
              {error.path}
            </p>
          )}
        </div>
      )}
      {partial && (
        <div className="grid gap-2 rounded-lg border p-3">
          <p role="alert" className="text-sm font-medium">
            {messages.incomplete}
          </p>
          <ul className="max-h-48 space-y-1 overflow-auto font-mono text-xs text-muted-foreground">
            {partial.paths.map((path) => (
              <li key={path} dir="auto" className="wrap-anywhere">
                {path}
              </li>
            ))}
          </ul>
          {partial.file && (
            <div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => downloadBlob(partial.file!, partial.name)}
              >
                <Download data-icon="inline-start" aria-hidden="true" />
                {messages.available}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
