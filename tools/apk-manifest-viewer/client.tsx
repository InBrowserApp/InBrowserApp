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
import { FileCog, FileText, Folder, List } from "@workspace/ui/icons"
import type { openManifest } from "./read"
import type English from "./messages/en.json"
import sample from "./fixtures/trail-notes.apk?url&inline"

export type Messages = typeof English
type Manifest = NonNullable<Awaited<ReturnType<typeof openManifest>>>
type Result = { file: File } & (
  | { output: Manifest; blob: Blob }
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
      .then(({ openManifest }) => openManifest(file))
      .then((output) => {
        if (obsolete) return
        setResult(
          output
            ? {
                file,
                output,
                blob: new Blob([output.xml], {
                  type: "application/xml;charset=utf-8",
                }),
              }
            : { file, error: "missing" }
        )
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
      tool="apk-manifest-viewer"
      file={file}
      onFile={(next) => {
        setFile(next)
        setResult(null)
      }}
      accept=".apk,.xml,application/vnd.android.package-archive,application/xml,text/xml"
      active={Boolean(output)}
      fitContent
      messages={m}
      renderEmpty={(chooseFile) => (
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileCog aria-hidden="true" />
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
                  (current) => current ?? new File([bytes], "trail-notes.apk")
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
        <ManifestDetails
          key={output.file.name}
          result={output}
          messages={m}
          lang={lang}
        />
      ) : null}
    </DocumentWorkspace>
  )
}

function ManifestDetails({
  result,
  messages: m,
  lang,
}: {
  result: { output: Manifest; blob: Blob }
  messages: Messages
  lang: string
}) {
  const { output, blob } = result
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
          <TabsTrigger value="xml">
            <FileText aria-hidden="true" />
            {m.manifest}
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="overview" className="space-y-4 overflow-auto p-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            [m.packageName, output.packageName],
            [m.versionName, output.versionName],
            [m.versionCode, output.versionCode],
            [m.minSdk, output.minSdk],
            [m.targetSdk, output.targetSdk],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-lg border px-3 py-2 first:col-span-2 sm:first:col-span-1"
            >
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd dir="auto" className="mt-1 text-sm font-medium wrap-anywhere">
                {value || m.unspecified}
              </dd>
            </div>
          ))}
        </dl>
        <section>
          <h2 className="font-medium">{m.permissions}</h2>
          {output.permissions.length ? (
            <ul className="mt-2 divide-y rounded-lg border">
              {output.permissions.map((permission) => (
                <li
                  key={permission}
                  dir="ltr"
                  className="px-3 py-2 text-start font-mono text-xs wrap-anywhere sm:text-sm"
                >
                  {permission}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-muted-foreground">{m.noPermissions}</p>
          )}
        </section>
      </TabsContent>
      <TabsContent
        value="xml"
        className="flex min-h-0 flex-col data-[state=inactive]:hidden"
      >
        <div className="flex flex-wrap gap-2 border-b p-3">
          <ToolCopyButton
            value={output.xml}
            copyLabel={m.copy}
            copiedLabel={m.copied}
            size="default"
          />
          <DocumentDownload
            file={blob}
            filename="AndroidManifest.xml"
            label={m.download}
          />
        </div>
        <pre
          dir="ltr"
          className="max-h-[32rem] min-h-0 flex-1 overflow-auto p-4 font-mono text-sm group-data-[focus=true]/workspace:max-h-none"
        >
          {output.xml}
        </pre>
      </TabsContent>
    </Tabs>
  )
}
