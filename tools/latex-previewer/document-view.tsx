import { useCallback, useId, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentZoom } from "@workspace/ui/components/tool/document-zoom"
import { List, RotateCw } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { DocumentFrame } from "./document-frame"
import { SourceView } from "./source-view"
import type { Diagnostic, Messages, Preview } from "./types"

export function DocumentView({
  source,
  preview,
  diagnostics,
  messages: m,
}: {
  source: string
  preview: Preview | null
  diagnostics: Diagnostic[]
  messages: Messages
}) {
  const [zoom, setZoom] = useState(100)
  const [outline, setOutline] = useState(false)
  const [sourceView, setSourceView] = useState(false)
  const [target, setTarget] = useState<{ id: string } | null>(null)
  const [missing, setMissing] = useState(false)
  const [position, setPosition] = useState(0)
  const outlineId = useId()
  const outlineButton = useRef<HTMLButtonElement>(null)
  const onMissing = useCallback(() => setMissing(true), [])
  const showSource = sourceView || !preview
  const incomplete = diagnostics.length > 0 || preview?.images
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b px-3 py-1">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            ref={outlineButton}
            label={m.outline}
            disabled={showSource}
            aria-expanded={outline && !showSource}
            aria-controls={outline && !showSource ? outlineId : undefined}
            onClick={() => setOutline(!outline)}
          >
            <List aria-hidden="true" />
          </DocumentIconButton>
          <ToggleGroup
            type="single"
            value={showSource ? "source" : "preview"}
            aria-label={m.view}
            onValueChange={(value) => {
              if (value) setSourceView(value === "source")
            }}
          >
            <ToggleGroupItem value="preview" disabled={!preview}>
              {m.preview}
            </ToggleGroupItem>
            <ToggleGroupItem value="source">{m.source}</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {!showSource ? (
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
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1">
        {outline && !showSource ? (
          <nav
            id={outlineId}
            aria-label={m.outline}
            className="w-full shrink-0 overflow-auto border-e p-2 sm:w-60"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                event.stopPropagation()
                setOutline(false)
                outlineButton.current?.focus()
              }
            }}
          >
            {preview!.outline.length ? (
              <ul className="flex flex-col gap-1">
                {preview!.outline.map((heading) => (
                  <li
                    key={heading.id}
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
        {preview ? (
          <div
            className={cn(
              "min-h-0 min-w-0 flex-1",
              showSource && "hidden",
              !showSource && outline && "hidden sm:block"
            )}
          >
            <DocumentFrame
              html={preview.html}
              title={m.documentBody}
              zoom={zoom}
              target={target}
              onMissing={onMissing}
              onPosition={setPosition}
            />
          </div>
        ) : null}
        {showSource ? <SourceView source={source} messages={m} /> : null}
      </div>
      <div className="flex shrink-0 items-start justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
        <details className="max-h-40 min-w-0 overflow-auto">
          <summary className="cursor-pointer">
            {m.limitedPreview} · {m.compatibility}
            {diagnostics.length ? ` (${diagnostics.length})` : ""}
          </summary>
          <p className="mt-2">{m.subset}</p>
          {preview?.images ? <p className="mt-2">{m.images}</p> : null}
          {diagnostics.length ? (
            <ul className="mt-2 flex list-disc flex-col gap-2 ps-4">
              {diagnostics.map((note, index) => (
                <li key={index}>
                  <span>{m.line.replace("{line}", String(note.line))}: </span>
                  <span dir="auto" className="whitespace-pre-wrap">
                    {note.code ? m[note.code] : note.message}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2">{m.notesHelp}</p>
        </details>
        {!showSource ? (
          <span
            className="shrink-0 tabular-nums"
            aria-label={`${m.position}: ${position}%`}
          >
            {position}%
          </span>
        ) : null}
      </div>
      {incomplete ? (
        <p
          role="status"
          className="shrink-0 px-3 pb-2 text-xs text-muted-foreground"
        >
          {m.incomplete}
        </p>
      ) : null}
      {missing ? (
        <p role="status" className="shrink-0 border-t px-3 py-2 text-xs">
          {m.missingReference}
        </p>
      ) : null}
    </>
  )
}
