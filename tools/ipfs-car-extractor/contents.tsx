import type { ReactNode } from "react"

import type { IpfsReference } from "@workspace/ipfs-files"
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

import type { CarView } from "./client"
import type EnglishMessages from "./messages/en.json"

export function CarContents({
  view: { path, entry, children },
  language,
  messages,
  busy,
  feedback,
  browse,
  download,
}: {
  view: CarView
  language: string
  messages: typeof EnglishMessages
  busy: boolean
  feedback: ReactNode
  browse: (path: readonly IpfsReference[]) => void
  download: () => void
}) {
  const isFolder = entry.type === "directory"
  const size = new Intl.NumberFormat(language, { style: "unit", unit: "byte" })
  return (
    <ToolPanelCard>
      <CardHeader>
        <CardTitle>
          <h2>{messages.contents}</h2>
        </CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {path.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => browse(path.slice(0, -1))}
              >
                <ChevronLeft
                  className="rtl:rotate-180"
                  data-icon="inline-start"
                  aria-hidden="true"
                />
                {messages.back}
              </Button>
            )}
            <p dir="auto" className="min-w-0 font-medium wrap-anywhere">
              {path.map(({ name }) => name).join(" / ")}
            </p>
          </div>
          <Button type="button" size="sm" disabled={busy} onClick={download}>
            <Download data-icon="inline-start" aria-hidden="true" />
            {isFolder ? messages.zip : messages.download}
          </Button>
        </div>
        {feedback}
        {isFolder ? (
          children.length ? (
            <ul className="divide-y rounded-lg border">
              {children.map((child) => (
                <li key={child.name}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
                    disabled={busy}
                    onClick={() => browse([...path, child])}
                  >
                    <span dir="auto" className="min-w-0 wrap-anywhere">
                      {child.name}
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
              {messages.empty}
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            {size.format(entry.size)}
          </p>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
