import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { bodyPreview } from "../core/content"
import type { Body, Messages, Pair } from "../types"

export function Pairs({
  title,
  values,
  messages: m,
}: {
  title: string
  values: readonly Pair[]
  messages: Messages
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <h3 className="font-medium">{title}</h3>
      {values.length ? (
        <dl className="divide-y rounded-lg border text-xs">
          {values.map((pair, i) => (
            <div
              key={i}
              className="grid gap-1 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4"
            >
              <dt className="font-mono break-all" dir="auto">
                {pair.name}
              </dt>
              <dd className="break-all whitespace-pre-wrap" dir="auto">
                {pair.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs text-muted-foreground">{m.none}</p>
      )}
    </section>
  )
}

export function BodyView({
  body,
  messages: m,
}: {
  body: Body
  messages: Messages
}) {
  const preview = bodyPreview(body)
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">{m.body}</h3>
        {body.mimeType ? (
          <Badge variant="outline">{body.mimeType}</Badge>
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
        <Pairs title={m.parameters} values={body.params} messages={m} />
      ) : null}
    </section>
  )
}
