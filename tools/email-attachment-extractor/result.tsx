import { useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { AttachmentRow } from "./attachment-row"
import { useZip } from "./use-zip"
import { safeNames } from "./core/names"
import type { convert } from "./core/convert"
import type { Messages } from "./types"

export function Result({
  output,
  messages: m,
}: {
  output: Awaited<ReturnType<typeof convert>> & { source: File }
  messages: Messages
}) {
  const { attachments } = output
  const [selected, setSelected] = useState(
    () =>
      new Set(
        attachments.flatMap((item, index) =>
          item.kind === "inline" ? [] : [index]
        )
      )
  )
  const { state, prepare, cancel } = useZip(attachments, selected)
  const zipName = safeNames([
    output.source.name.replace(/\.(eml|emlx|msg)$/i, "") + ".zip",
  ])[0]!
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="space-y-1 border-b p-3">
        <p role="status" className="text-xs text-muted-foreground">
          {m.ready}
        </p>
        <h2 className="font-medium break-words" dir="auto">
          {output.subject || m.subjectFallback}
        </h2>
        <p className="text-xs break-all text-muted-foreground">
          {m.from}: <bdi>{output.from || m.unknown}</bdi>
        </p>
      </header>
      {attachments.length ? (
        <>
          <div className="flex flex-wrap items-center gap-2 border-b p-3">
            <p className="basis-full text-sm" role="status">
              {m.selected
                .replace("{selected}", String(selected.size))
                .replace("{total}", String(attachments.length))}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelected(new Set(attachments.map((_item, index) => index)))
              }
            >
              {m.selectAll}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(new Set())}
            >
              {m.selectNone}
            </Button>
            {state?.loading ? (
              <>
                <p role="status" className="flex items-center gap-2 text-sm">
                  <Spinner />
                  {m.packaging}
                </p>
                <Button variant="outline" size="sm" onClick={cancel}>
                  {m.cancelZip}
                </Button>
              </>
            ) : state?.file ? (
              <>
                <span role="status" className="sr-only">
                  {m.zipReady}
                </span>
                <DocumentDownload
                  file={state.file}
                  filename={zipName}
                  label={m.zipDownload}
                />
              </>
            ) : (
              <Button
                size="sm"
                disabled={!selected.size}
                onClick={() => void prepare()}
              >
                {m.prepareZip}
              </Button>
            )}
            {state?.error ? (
              <p role="alert" className="basis-full text-sm text-destructive">
                {m.zipFailed}
              </p>
            ) : null}
          </div>
          <ul
            aria-label={m.attachments}
            className="max-h-[70vh] min-h-0 overflow-auto group-data-[focus]/workspace:max-h-none group-data-[focus]/workspace:flex-1"
          >
            {attachments.map((item, index) => (
              <AttachmentRow
                key={index}
                item={item}
                selected={selected.has(index)}
                messages={m}
                onSelect={() =>
                  setSelected((current) => {
                    const next = new Set(current)
                    if (next.has(index)) next.delete(index)
                    else next.add(index)
                    return next
                  })
                }
              />
            ))}
          </ul>
          <div className="space-y-1 border-t p-3 text-xs text-muted-foreground">
            <p>{m.inlineNotice}</p>
            <p>{m.namesNotice}</p>
            <p>{m.nestedNotice}</p>
          </div>
        </>
      ) : (
        <div className="space-y-2 p-6 text-center">
          <h3 className="font-medium">{m.noAttachments}</h3>
          <p className="text-sm text-muted-foreground">
            {m.noAttachmentsDescription}
          </p>
        </div>
      )}
    </div>
  )
}
