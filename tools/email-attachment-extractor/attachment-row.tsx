import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Download } from "@workspace/ui/icons"
import type { convert } from "./core/convert"
import type { Messages } from "./types"

type Attachment = Awaited<ReturnType<typeof convert>>["attachments"][number]

export function AttachmentRow({
  item,
  selected,
  onSelect,
  messages: m,
}: {
  item: Attachment
  selected: boolean
  onSelect: () => void
  messages: Messages
}) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const value = URL.createObjectURL(item.file)
    setUrl(value)
    return () => URL.revokeObjectURL(value)
  }, [item.file])
  return (
    <li className="flex min-w-0 flex-wrap items-start gap-3 border-b p-3 last:border-0">
      <Checkbox
        className="mt-1"
        checked={selected}
        onCheckedChange={onSelect}
        aria-label={m.selectAttachment.replace("{name}", item.filename)}
      />
      <div className="min-w-0 flex-1 basis-28 space-y-1">
        <p className="text-sm font-medium break-all" dir="auto">
          {item.name || m.unnamed}
        </p>
        <p className="text-xs text-muted-foreground">
          {m[item.kind]} ·{" "}
          {item.file.size
            ? `${item.file.size.toLocaleString()} ${m.bytes}`
            : m.emptyAttachment}
        </p>
        {item.filename !== item.name ? (
          <p className="text-xs break-all text-muted-foreground">
            {m.downloadName}: <bdi>{item.filename}</bdi>
          </p>
        ) : null}
      </div>
      {url ? (
        <Button variant="outline" size="sm" asChild>
          <a
            href={url}
            download={item.filename}
            data-astro-prefetch="false"
            aria-label={m.downloadAttachment.replace("{name}", item.filename)}
          >
            <Download aria-hidden="true" />
            {m.download}
          </a>
        </Button>
      ) : null}
    </li>
  )
}
