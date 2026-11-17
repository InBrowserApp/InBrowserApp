import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { bodyPreview } from "../core/content"
import { Pairs } from "./pair-list"
import type { Body, Messages } from "../types"

export function BodyView({
  body,
  messages: m,
  lang,
}: {
  body: Body
  messages: Messages
  lang: string
}) {
  const preview = bodyPreview(body)
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">{m.body}</h3>
        {body.mimeType ? (
          <Badge
            variant="outline"
            className="h-auto max-w-full min-w-0 whitespace-normal"
          >
            <span className="break-all">{body.mimeType}</span>
          </Badge>
        ) : null}
        <ToolCopyButton
          value={preview.text}
          copyLabel={m.copy}
          copiedLabel={m.copied}
        />
      </div>
      {preview.state === "missing" || preview.state === "empty" ? (
        <p className="text-sm text-muted-foreground">
          {preview.state === "missing" ? m.bodyMissing : m.bodyEmpty}
        </p>
      ) : (
        <pre
          dir="ltr"
          className="max-h-80 overflow-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all whitespace-pre-wrap"
        >
          <code>{preview.text}</code>
        </pre>
      )}
      {preview.state === "encoded" ? (
        <p className="text-xs text-muted-foreground">{m.bodyEncoded}</p>
      ) : null}
      {preview.truncated ? (
        <p className="text-xs text-muted-foreground">{m.bodyTruncated}</p>
      ) : null}
      {body.params.length ? (
        <Pairs
          title={m.parameters}
          values={body.params}
          messages={m}
          lang={lang}
        />
      ) : null}
    </section>
  )
}
