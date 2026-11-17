import { useEffect, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import { ContextDetails } from "./components/context-details"
import { captureGpuReport, serializeTextReport } from "./report"
import type { GpuMessages, GpuReport, GraphicsApi } from "./types"

function GpuInformationClient({
  messages,
}: Readonly<{ messages: GpuMessages }>) {
  const [report, setReport] = useState<GpuReport | null>(null)
  const [api, setApi] = useState<GraphicsApi>("webgl2")

  useEffect(() => {
    const snapshot = captureGpuReport()
    setReport(snapshot)
    setApi(snapshot.contexts[1]?.available ? "webgl2" : "webgl")
  }, [])

  if (!report) {
    return (
      <Card>
        <CardContent
          className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground"
          role="status"
        >
          <Spinner />
          {messages.loading}
        </CardContent>
      </Card>
    )
  }

  const context = report.contexts.find((entry) => entry.api === api)!
  const renderer = context.available
    ? (context.unmaskedRenderer ?? context.renderer)
    : null
  const vendor = context.available
    ? (context.unmaskedVendor ?? context.vendor)
    : null
  const downloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`

  return (
    <div className="grid min-w-0 gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-1.5">
            <CardTitle>
              <h2>{messages.reportTitle}</h2>
            </CardTitle>
            <CardDescription>{messages.reportDescription}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setReport(captureGpuReport())}
            >
              <RefreshCcw aria-hidden="true" data-icon="inline-start" />
              {messages.refresh}
            </Button>
            <ToolCopyButton
              value={serializeTextReport(report)}
              copyLabel={messages.copyText}
              copiedLabel={messages.copied}
            />
            <Button asChild size="sm" variant="outline">
              <a href={downloadHref} download="gpu-information.json">
                <Download aria-hidden="true" data-icon="inline-start" />
                {messages.downloadJson}
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            {report.contexts.map((entry) => (
              <Badge
                key={entry.api}
                variant={entry.available ? "outline" : "secondary"}
              >
                {entry.api === "webgl2" ? "WebGL 2" : "WebGL 1"}:{" "}
                {entry.available ? messages.available : messages.unavailable}
              </Badge>
            ))}
          </div>
          <dl className="grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="grid min-w-0 content-start gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                {messages.gpuRenderer}
              </dt>
              <dd
                className="font-mono text-sm leading-6 [overflow-wrap:anywhere]"
                dir="ltr"
              >
                {renderer ?? messages.notReported}
              </dd>
            </div>
            <div className="grid min-w-0 content-start gap-2">
              <dt className="text-xs font-medium text-muted-foreground">
                {messages.gpuVendor}
              </dt>
              <dd
                className="font-mono text-sm leading-6 [overflow-wrap:anywhere]"
                dir="ltr"
              >
                {vendor ?? messages.notReported}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            {messages.browserReported}
          </p>
        </CardContent>
      </Card>

      {context.available &&
      (!context.unmaskedRenderer || context.softwareRenderer) ? (
        <aside
          className="grid gap-1.5 rounded-lg border bg-muted/40 p-4 text-sm"
          role="note"
        >
          <p className="font-medium">
            {context.softwareRenderer
              ? messages.softwareTitle
              : messages.privacyTitle}
          </p>
          <p className="leading-6 text-muted-foreground">
            {context.softwareRenderer
              ? messages.softwareDescription
              : messages.privacyDescription}
          </p>
        </aside>
      ) : null}

      <Tabs
        value={api}
        onValueChange={(value) => setApi(value as GraphicsApi)}
        className="min-w-0 gap-4"
      >
        <TabsList aria-label={messages.version}>
          <TabsTrigger value="webgl">WebGL 1</TabsTrigger>
          <TabsTrigger value="webgl2">WebGL 2</TabsTrigger>
        </TabsList>
        {report.contexts.map((entry) => (
          <TabsContent key={entry.api} value={entry.api} className="min-w-0">
            <ContextDetails context={entry} messages={messages} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default GpuInformationClient
