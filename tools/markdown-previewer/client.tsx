import {
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { Button } from "@workspace/ui/components/ui/button"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { cn } from "@workspace/ui/lib/utils"
import { IMPORT_ACCEPT } from "./constants"
import {
  createExportHtmlDocument,
  slugifyHeading,
} from "./core/markdown-preview"
import { useDocument } from "./use-document"
import { usePreview } from "./use-preview"
import { usePreferences } from "./use-preferences"
import { EditorCard } from "./components/editor-card"
import { PreviewFrame } from "./components/preview-frame"
import { ReaderToolbar } from "./components/reader-toolbar"
import { ReaderOutline } from "./components/reader-outline"
import { PreviewActions } from "./components/preview-actions"
import type { MarkdownPreviewerMessages } from "./types"

export default function MarkdownPreviewerClient({
  messages: m,
  language,
  direction,
}: {
  messages: MarkdownPreviewerMessages
  language: string
  direction: "ltr" | "rtl"
}) {
  const source = useDocument(m)
  const { theme, setTheme, outline, setOutline } = usePreferences()
  const [renderHtml, setRenderHtml] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [wide, setWide] = useState(false)
  const [target, setTarget] = useState<{ id: string } | null>(null)
  const [missing, setMissing] = useState(false)
  const outlineButton = useRef<HTMLButtonElement>(null)
  const outlineId = useId()
  const deferred = useDeferredValue(source.markdown)
  const { preview, pending, error, retry } = usePreview(
    deferred,
    m.untitledHeadingLabel,
    renderHtml
  )
  const busy = pending || deferred !== source.markdown
  const onMissing = useCallback(() => setMissing(true), [])
  const html = useMemo(
    () =>
      createExportHtmlDocument({
        title: preview?.documentTitle || m.meta.name,
        html: preview?.html || "",
        theme: "clean",
        language,
        direction,
      }),
    [preview, m.meta.name, language, direction]
  )
  const exported = useMemo(
    () =>
      preview
        ? createExportHtmlDocument({
            title: preview.documentTitle,
            html: preview.exportHtml,
            theme,
            language,
            direction,
          })
        : "",
    [preview, theme, language, direction]
  )
  function open(file: File | null) {
    source.open(file)
    setMissing(false)
    setTarget(null)
  }
  return (
    <DocumentWorkspace
      tool="markdown-previewer"
      file={source.file}
      onFile={open}
      accept={IMPORT_ACCEPT}
      active
      messages={{
        open: m.importLabel,
        replace: m.replace,
        clear: m.close,
        reader: m.reader,
        privacy: m.privacy,
        focus: m.focus,
        exitFocus: m.exitFocus,
        releaseFile: m.releaseFile,
      }}
    >
      <ReaderToolbar
        m={m}
        reading={source.reading}
        onReading={source.setReading}
        outline={outline}
        onOutline={() => setOutline(!outline)}
        outlineId={outlineId}
        outlineButton={outlineButton}
        zoom={zoom}
        onZoom={setZoom}
        wide={wide}
        onWide={() => setWide(!wide)}
      />
      {source.loading ? (
        <div
          role="status"
          className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-1 text-sm"
        >
          {m.opening}
          <Button size="sm" variant="ghost" onClick={source.cancel}>
            {m.cancel}
          </Button>
        </div>
      ) : null}
      {source.error || source.storageFailed ? (
        <p role="alert" className="shrink-0 border-b px-3 py-2 text-sm">
          {source.error || m.storageFailed}
        </p>
      ) : null}
      <div className="flex min-h-0 flex-1">
        {outline ? (
          <ReaderOutline
            id={outlineId}
            messages={m}
            items={preview?.toc || []}
            onClose={() => {
              setOutline(false)
              outlineButton.current?.focus()
            }}
            onSelect={(id) => {
              setTarget({ id })
              setMissing(false)
              setOutline(false)
            }}
          />
        ) : null}
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col md:flex-row",
            outline && "hidden sm:flex"
          )}
        >
          <div
            hidden={source.reading}
            className={cn(
              "h-48 shrink-0 border-b md:h-auto md:w-2/5 md:border-e md:border-b-0",
              source.reading && "hidden"
            )}
          >
            <EditorCard
              messages={m}
              markdown={source.markdown}
              onMarkdownChange={source.change}
              onLoadSample={source.sample}
              onClear={source.clear}
            />
          </div>
          <div className="relative min-h-0 min-w-0 flex-1" aria-busy={busy}>
            {preview && source.markdown.trim() ? (
              <PreviewFrame
                html={html}
                title={m.previewTitle}
                zoom={zoom}
                wide={wide}
                theme={theme}
                target={target}
                onMissing={onMissing}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 overflow-auto p-4 text-center text-sm text-muted-foreground">
                <p>
                  {error
                    ? m.previewFailed
                    : busy
                      ? m.rendering
                      : m.previewEmptyDescription}
                </p>
                {error ? (
                  <Button variant="outline" onClick={retry}>
                    {m.retry}
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
      {busy && preview ? (
        <p
          role="status"
          className="shrink-0 px-3 text-xs text-muted-foreground"
        >
          {m.rendering}
        </p>
      ) : null}
      {missing ? (
        <p role="status" className="shrink-0 border-t px-3 py-1 text-xs">
          {m.missingReference}
        </p>
      ) : null}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-t px-3 py-1">
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={theme}
          aria-label={m.themeLabel}
          onValueChange={(value) => {
            if (value === "clean" || value === "slate") setTheme(value)
          }}
        >
          <ToggleGroupItem value="clean">{m.cleanThemeLabel}</ToggleGroupItem>
          <ToggleGroupItem value="slate">{m.slateThemeLabel}</ToggleGroupItem>
        </ToggleGroup>
        <PreviewActions
          html={exported}
          filename={`${slugifyHeading(preview?.documentTitle || "document")}.html`}
          disabled={!source.markdown.trim() || busy || error}
          messages={m}
        />
      </div>
      <details className="max-h-44 shrink-0 overflow-auto border-t px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer">
          {source.file ? m.fileSession : m.draftSession} · {m.compatibility}
          {preview
            ? ` · ${preview.stats.words} ${m.wordsLabel} · ${preview.stats.readTimeMinutes} ${m.readTimeLabel}`
            : ""}
        </summary>
        <p className="mt-2">{source.file ? m.filePrivacy : m.draftPrivacy}</p>
        <p className="mt-2">{m.supported}</p>
        <p className="mt-2">{m.safePreview}</p>
        {preview?.localImages ? <p className="mt-2">{m.localImages}</p> : null}
        {preview?.remoteImages ? (
          <p className="mt-2">{m.remoteImages}</p>
        ) : null}
        <label className="mt-3 flex items-center gap-2">
          <Switch
            checked={renderHtml}
            onCheckedChange={setRenderHtml}
            aria-label={m.renderHtmlLabel}
          />
          {m.renderHtmlLabel}
        </label>
      </details>
    </DocumentWorkspace>
  )
}
