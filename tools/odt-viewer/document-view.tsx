import { useCallback, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import { List, RotateCw, TriangleAlert } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { DocumentFrame } from "./document-frame"
import type { Messages, OdtDocument, Preview } from "./types"

export function DocumentView({
  document: source,
  preview,
  messages: m,
}: {
  document: OdtDocument
  preview: Preview
  messages: Messages
}) {
  const [zoom, setZoom] = useState(100)
  const [outline, setOutline] = useState(false)
  const [target, setTarget] = useState<{ id: string } | null>(null)
  const [missing, setMissing] = useState(false)
  const outlineId = useId()
  const outlineButton = useRef<HTMLButtonElement>(null)
  const onMissing = useCallback(() => setMissing(true), [])
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b px-3 py-1">
        <DocumentIconButton
          ref={outlineButton}
          label={m.outline}
          aria-expanded={outline}
          aria-controls={outline ? outlineId : undefined}
          onClick={() => setOutline(!outline)}
        >
          <List aria-hidden="true" />
        </DocumentIconButton>
        <div className="flex items-center gap-1">
          <DocumentZoom value={zoom} onChange={setZoom} messages={m} />
          <DocumentIconButton
            label={m.resetZoom}
            disabled={zoom === 100}
            onClick={() => setZoom(100)}
          >
            <RotateCw aria-hidden="true" />
          </DocumentIconButton>
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        {outline ? (
          <nav
            id={outlineId}
            aria-label={m.outline}
            className="w-full shrink-0 overflow-auto border-e p-2 sm:w-60"
            onKeyDown={(event) => {
              if (event.key !== "Escape") return
              event.preventDefault()
              event.stopPropagation()
              setOutline(false)
              outlineButton.current?.focus()
            }}
          >
            {preview.outline.length ? (
              <ul className="flex flex-col gap-1">
                {preview.outline.map((heading) => (
                  <li
                    key={heading.id}
                    className="[contain-intrinsic-size:auto_44px] [content-visibility:auto]"
                    style={{ paddingInlineStart: (heading.level - 1) * 12 }}
                  >
                    <Button
                      variant="ghost"
                      className="h-auto min-h-10 w-full justify-start py-2 text-start whitespace-normal"
                      onClick={() => {
                        setTarget({ id: heading.id })
                        setMissing(false)
                        setOutline(false)
                      }}
                    >
                      <span dir="auto">{heading.label}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-2 text-sm text-muted-foreground">
                {m.noHeadings}
              </p>
            )}
          </nav>
        ) : null}
        <div
          className={cn("min-h-0 min-w-0 flex-1", outline && "hidden sm:block")}
        >
          <DocumentFrame
            html={preview.html}
            title={m.documentBody}
            zoom={zoom}
            target={target}
            onMissing={onMissing}
          />
        </div>
      </div>
      <details className="max-h-40 shrink-0 overflow-auto border-t px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer">
          {preview.limited ? (
            <span title={m.limited}>
              <TriangleAlert
                aria-hidden="true"
                className="me-1 inline size-3"
              />
              <span className="sr-only">{m.limited} </span>
            </span>
          ) : null}
          {m.compatibility}
          {source.template ? ` · ${m.template}` : ""}
        </summary>
        <p className="mt-1">{m.reflow}</p>
        <p className="mt-1">{m.changes}</p>
        <p className="mt-1">{m.safePreview}</p>
        {preview.limited ? <p className="mt-1">{m.limited}</p> : null}
      </details>
      {missing ? (
        <p role="status" className="shrink-0 border-t px-3 py-2 text-xs">
          {m.missingReference}
        </p>
      ) : null}
    </>
  )
}
