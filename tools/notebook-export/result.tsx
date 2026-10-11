import { useEffect, useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { DocumentHtmlResult } from "@workspace/ui/components/tool/document-html-result"
import { DocumentTextExport } from "@workspace/ui/components/tool/document-text-export"
import type { convert } from "./core/convert"
import type { Messages } from "./types"

export function Result({
  output,
  messages: m,
}: {
  output: Awaited<ReturnType<typeof convert>> & { source: File }
  messages: Messages
}) {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr")
  useEffect(
    () => setDirection(document.documentElement.dir === "rtl" ? "rtl" : "ltr"),
    []
  )
  const stem = output.source.name.replace(/\.ipynb$/i, "")
  return (
    <Tabs defaultValue="html" dir={direction} className="min-h-0 flex-1 gap-0">
      <div className="shrink-0 border-b px-3 py-2">
        <TabsList aria-label={m.format}>
          <TabsTrigger value="html">{m.html}</TabsTrigger>
          <TabsTrigger value="markdown">{m.markdown}</TabsTrigger>
          <TabsTrigger value="code">{m.code}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="html"
        className="min-h-0 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
      >
        <DocumentHtmlResult
          html={output.preview.html}
          title={output.preview.title}
          file={output.file}
          filename={stem + ".html"}
          messages={m}
          notes={
            <details className="shrink-0 border-b px-3 py-2 text-sm">
              <summary className="cursor-pointer font-medium">
                {m.notes}
              </summary>
              {output.notes.map((note) => (
                <p key={note} className="pt-2 text-muted-foreground">
                  {note}
                </p>
              ))}
            </details>
          }
        />
      </TabsContent>
      <TabsContent
        value="markdown"
        className="min-h-0 overflow-auto data-[state=active]:flex data-[state=active]:flex-col"
      >
        <p role="status" className="sr-only">
          {m.markdownReady}
        </p>
        <p className="border-b p-3 text-sm text-muted-foreground">
          {m.markdownNotice}
        </p>
        <DocumentTextExport
          text={output.markdown}
          blob={output.markdownFile}
          filename={stem + ".md"}
          messages={{ ...m, download: m.markdownDownload }}
        />
      </TabsContent>
      <TabsContent
        value="code"
        className="min-h-0 overflow-auto data-[state=active]:flex data-[state=active]:flex-col"
      >
        <p role="status" className="sr-only">
          {m.codeReady}
        </p>
        <div className="space-y-2 border-b p-3 text-sm text-muted-foreground">
          <p>{m.codeNotice}</p>
          {output.script.unknownLanguage ? <p>{m.unknownLanguage}</p> : null}
          {!output.script.count ? <p>{m.noCode}</p> : null}
        </div>
        <DocumentTextExport
          text={output.script.text}
          blob={output.scriptFile}
          filename={stem + "." + output.script.extension}
          messages={{ ...m, download: m.codeDownload }}
        />
      </TabsContent>
    </Tabs>
  )
}
