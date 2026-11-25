import { useEffect, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { DocumentWorkspace } from "@workspace/ui/components/tool/document-workspace"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { FileArchive, FileText, Folder, List } from "@workspace/ui/icons"
import type { openIpa } from "./read"
import type English from "./messages/en.json"
import sample from "./fixtures/trail-notes.ipa?url&inline"

export type Messages = typeof English
type Metadata = NonNullable<Awaited<ReturnType<typeof openIpa>>>
type Result = { file: File } & (
  | { output: Metadata }
  | { error: "missing" | "invalid" }
)

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  useEffect(() => {
    if (!file) return
    let obsolete = false
    void import("./read")
      .then(({ openIpa }) => openIpa(file))
      .then((output) => {
        if (obsolete) return
        setResult(output ? { file, output } : { file, error: "missing" })
      })
      .catch(() => {
        if (!obsolete) setResult({ file, error: "invalid" })
      })
    return () => {
      obsolete = true
    }
  }, [file])
  const current = result?.file === file ? result : null
  const output = current && "output" in current ? current : null
  return (
    <DocumentWorkspace
      tool="ipa-metadata-viewer"
      file={file}
      onFile={(next) => {
        setFile(next)
        setResult(null)
      }}
      accept=".ipa,application/zip"
      active={Boolean(output)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileArchive aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{m.drop}</EmptyTitle>
            <EmptyDescription>{m.privacy}</EmptyDescription>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button data-file-open onClick={chooseFile}>
              <Folder data-icon="inline-start" aria-hidden="true" />
              {m.open}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const response = await fetch(sample)
                const bytes = await response.blob()
                setFile(
                  (current) => current ?? new File([bytes], "trail-notes.ipa")
                )
              }}
            >
              {m.example}
            </Button>
          </div>
        </Empty>
      )}
    >
      {file && !current ? (
        <p
          role="status"
          className="flex min-h-36 items-center justify-center gap-2 text-sm"
        >
          <Spinner aria-hidden="true" />
          {m.loading}
        </p>
      ) : null}
      {current && "error" in current ? (
        <Alert variant="destructive" className="m-3 w-auto">
          <AlertDescription>{m[current.error]}</AlertDescription>
        </Alert>
      ) : null}
      {output ? (
        <MetadataDetails
          key={output.file.name}
          result={output}
          messages={m}
          lang={lang}
        />
      ) : null}
    </DocumentWorkspace>
  )
}

function MetadataDetails({
  result,
  messages: m,
  lang,
}: {
  result: { output: Metadata }
  messages: Messages
  lang: string
}) {
  const { output } = result
  return (
    <Tabs
      defaultValue="overview"
      dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
      className="min-h-0 min-w-0 flex-1 gap-0"
    >
      <div className="border-b p-3">
        <TabsList>
          <TabsTrigger value="overview">
            <List aria-hidden="true" />
            {m.summary}
          </TabsTrigger>
          <TabsTrigger value="plist">
            <FileText aria-hidden="true" />
            {m.details}
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="overview" className="space-y-4 overflow-auto p-4">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            [m.appName, output.appName],
            [m.bundleId, output.bundleId],
            [m.version, output.version],
            [m.build, output.build],
            [m.minimumOs, output.minimumOs],
            [m.platforms, new Intl.ListFormat(lang).format(output.platforms)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-lg border px-3 py-2 nth-[-n+2]:col-span-2"
            >
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd dir="auto" className="mt-1 text-sm font-medium wrap-anywhere">
                {value || m.unspecified}
              </dd>
            </div>
          ))}
        </dl>
      </TabsContent>
      <TabsContent
        value="plist"
        className="flex min-h-0 flex-col data-[state=inactive]:hidden"
      >
        <div className="flex flex-wrap gap-2 border-b p-3">
          <ToolCopyButton
            value={output.xml}
            copyLabel={m.copyXml}
            copiedLabel={m.copied}
            size="default"
          />
          <DocumentDownload
            file={output.original}
            filename="Info.plist"
            label={m.download}
          />
        </div>
        <p
          dir="ltr"
          className="border-b px-3 py-2 text-start font-mono text-xs wrap-anywhere text-muted-foreground"
        >
          {output.path}
        </p>
        <pre
          dir="ltr"
          className="max-h-[32rem] min-h-0 flex-1 overflow-auto p-4 font-mono text-sm wrap-anywhere whitespace-pre-wrap group-data-[focus=true]/workspace:max-h-none"
        >
          {output.xml}
        </pre>
      </TabsContent>
    </Tabs>
  )
}
