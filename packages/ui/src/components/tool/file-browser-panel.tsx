import type { ReactNode } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Folder,
} from "@workspace/ui/icons"

export function FileBrowserPanel({
  path,
  entries,
  size,
  labels,
  busy,
  feedback,
  onBack,
  onOpen,
  onDownload,
}: {
  path: string
  entries: readonly string[] | null
  size: string | null
  labels: {
    contents: string
    back: string
    zip: string
    download: string
    empty: string
  }
  busy: boolean
  feedback: ReactNode
  onBack?: () => void
  onOpen: (index: number) => void
  onDownload: () => void
}) {
  return (
    <ToolPanelCard>
      <CardHeader>
        <CardTitle>
          <h2>{labels.contents}</h2>
        </CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {onBack && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={onBack}
              >
                <ChevronLeft
                  className="rtl:rotate-180"
                  data-icon="inline-start"
                  aria-hidden="true"
                />
                {labels.back}
              </Button>
            )}
            <p dir="auto" className="min-w-0 font-medium wrap-anywhere">
              {path}
            </p>
          </div>
          <Button type="button" size="sm" disabled={busy} onClick={onDownload}>
            <Download data-icon="inline-start" aria-hidden="true" />
            {entries ? labels.zip : labels.download}
          </Button>
        </div>
        {feedback}
        {entries ? (
          entries.length ? (
            <ul className="divide-y rounded-lg border">
              {entries.map((name, index) => (
                <li key={name}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
                    disabled={busy}
                    onClick={() => onOpen(index)}
                  >
                    <span dir="auto" className="min-w-0 wrap-anywhere">
                      {name}
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              <Folder className="me-1 inline size-4" aria-hidden="true" />
              {labels.empty}
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">{size}</p>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
