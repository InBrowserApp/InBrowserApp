import { DocumentHtmlResult } from "@workspace/ui/components/tool/document-html-result"
import type { convert } from "./core/convert"
import type { Messages } from "./types"

export function Result({
  output,
  messages: m,
}: {
  output: Awaited<ReturnType<typeof convert>> & { source: File }
  messages: Messages
}) {
  return (
    <DocumentHtmlResult
      html={output.preview.html}
      title={output.preview.title}
      file={output.file}
      filename={
        output.source.name.replace(/\.(mobi|azw|azw3|prc)$/i, "") + ".epub"
      }
      messages={{ ...m, layoutNotice: m.styleNotice }}
      notes={
        <details className="shrink-0 border-b px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">{m.notes}</summary>
          {output.notes.map((note) => (
            <p key={note} className="pt-2 text-muted-foreground">
              {note}
            </p>
          ))}
        </details>
      }
    />
  )
}
