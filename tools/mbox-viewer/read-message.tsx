import { useEffect, useState } from "react"
import type { Email } from "@workspace/email"
import { MessageFrame } from "@workspace/ui/components/tool/email-message-frame"
import { preparePreview } from "@workspace/ui/lib/email-preview"
import { fileSizeFormatter } from "@workspace/ui/lib/format-file-size"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { Button } from "@workspace/ui/components/ui/button"
import { Download, Paperclip } from "@workspace/ui/icons"
import type { Messages } from "./types"

export function ReadMessage({
  email,
  lang,
  messages: m,
}: {
  email: Email
  lang: string
  messages: Messages
}) {
  const [preview, setPreview] = useState<
    ReturnType<typeof preparePreview> | false | null
  >(null)
  const [plain, setPlain] = useState(false)
  useEffect(() => {
    if (!email.html) return
    try {
      const next = preparePreview(email)
      setPreview(next)
      return next.dispose
    } catch {
      setPreview(false)
      return undefined
    }
  }, [email])
  const attachments = email.attachments.flatMap(({ bytes, name }) =>
    bytes ? [{ bytes, name: name || m.attachmentFallback }] : []
  )
  const formatSize = fileSizeFormatter(lang)
  return (
    <>
      <header className="max-h-[44%] shrink-0 space-y-2 overflow-auto border-b px-4 py-3 sm:px-5">
        <h2
          dir="auto"
          className="text-lg leading-snug font-semibold wrap-anywhere"
        >
          {email.subject || m.subjectFallback}
        </h2>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
          {(["from", "to", "date"] as const)
            .filter((field) => email[field])
            .map((field) => (
              <div key={field} className="contents">
                <dt className="text-muted-foreground">{m[field]}</dt>
                <dd dir="auto" className="wrap-anywhere">
                  {email[field]}
                </dd>
              </div>
            ))}
        </dl>
        {attachments.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              <Paperclip aria-hidden="true" className="me-1.5 inline size-4" />
              {m.attachments} ({attachments.length.toLocaleString(lang)})
            </summary>
            <ul className="mt-2 space-y-1">
              {attachments.map(({ bytes, name }, index) => (
                <li
                  key={index}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-md border ps-3 pe-1"
                >
                  <span className="min-w-0 text-sm wrap-anywhere">
                    <bdi>{name}</bdi>
                    <small className="ms-2 text-muted-foreground">
                      {formatSize(bytes.byteLength)}
                    </small>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={m.download}
                    aria-label={m.downloadAttachment.replace(
                      "{name}",
                      () => name
                    )}
                    onClick={() =>
                      downloadBlob(
                        new Blob([bytes], {
                          type: "application/octet-stream",
                        }),
                        name.replace(/[/\\]/g, "_")
                      )
                    }
                  >
                    <Download aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </header>
      {preview && email.text && (
        <div className="flex shrink-0 justify-end border-b px-3 py-1">
          <Button variant="ghost" size="sm" onClick={() => setPlain(!plain)}>
            {plain ? m.html : m.plain}
          </Button>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto">
        {preview && !plain ? (
          <MessageFrame html={preview.html} title={m.messageBody} size={16} />
        ) : email.text ? (
          <pre
            className="mx-auto max-w-[80ch] p-4 font-sans text-sm leading-relaxed wrap-anywhere whitespace-pre-wrap sm:p-5"
            dir="auto"
          >
            {email.text}
          </pre>
        ) : preview === false ? (
          <p className="p-4 text-sm text-muted-foreground">{m.messageError}</p>
        ) : !email.html ? (
          <p className="p-4 text-sm text-muted-foreground">{m.noBody}</p>
        ) : null}
      </div>
    </>
  )
}
