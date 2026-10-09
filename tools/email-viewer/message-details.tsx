import { Badge } from "@workspace/ui/components/ui/badge"
import { Paperclip } from "@workspace/ui/icons"
import type { Email, Messages } from "./types"

export function MessageDetails({
  email,
  messages: m,
}: {
  email: Email
  messages: Messages
}) {
  return (
    <div className="max-h-[40%] shrink-0 overflow-auto border-b px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 text-lg font-semibold wrap-anywhere" dir="auto">
          {email.subject || m.subjectFallback}
        </h2>
        <Badge variant="outline">{email.format}</Badge>
      </div>
      <p className="mt-1 text-sm wrap-anywhere" dir="auto">
        <span className="text-muted-foreground">{m.from}: </span>
        {email.from || m.unknown}
      </p>
      <p
        className="mt-1 text-xs wrap-anywhere text-muted-foreground"
        dir="auto"
      >
        {m.date}: {email.date || m.unknown}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <details className="open:w-full">
          <summary className="cursor-pointer text-muted-foreground">
            {m.headers}
          </summary>
          <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
            {(["to", "cc", "bcc"] as const).map((key) => (
              <div key={key} className="contents">
                <dt className="text-muted-foreground">{m[key]}</dt>
                <dd className="wrap-anywhere" dir="auto">
                  {email[key] || m.unknown}
                </dd>
              </div>
            ))}
          </dl>
        </details>
        <details className="open:w-full">
          <summary className="cursor-pointer">
            <Paperclip className="me-1 inline size-3.5" aria-hidden="true" />
            {m.attachments} ({email.attachments.length})
          </summary>
          <ul className="mt-2 flex flex-col gap-2">
            {email.attachments.map((item, index) => (
              <li
                key={index}
                className="min-w-0 rounded-md border px-3 py-2 [contain-intrinsic-size:auto_76px] [content-visibility:auto]"
              >
                <p className="wrap-anywhere" dir="auto">
                  {item.name || m.attachmentFallback}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <Badge variant="secondary">{m[item.kind]}</Badge>
                  <span dir="ltr" className="wrap-anywhere">
                    {item.type}
                  </span>
                  <span>
                    {item.size === null
                      ? m.unknownSize
                      : `${item.size.toLocaleString()} ${m.bytes}`}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </details>
      </div>
      {email.notices.length ? (
        <details className="mt-2 text-xs text-muted-foreground" open>
          <summary className="cursor-pointer">{m.compatibility}</summary>
          <ul className="mt-1 list-disc ps-4">
            {email.notices.map((notice) => (
              <li key={notice}>{m[notice]}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
