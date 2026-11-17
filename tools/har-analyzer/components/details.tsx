import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/ui/tabs"
import { Badge } from "@workspace/ui/components/ui/badge"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  formatBytes,
  formatTime,
  isFailure,
  requestName,
} from "../core/analysis"
import { BodyView, Pairs } from "./fields"
import { TimingDetails } from "./timing"
import type { Capture, Entry, Messages } from "../types"

export function Details({
  entry,
  capture,
  messages: m,
  lang,
  onClose,
  onRestoreFocus,
}: {
  entry: Entry
  capture: Capture
  messages: Messages
  lang: string
  onClose: () => void
  onRestoreFocus: () => void
}) {
  const values = [
    [m.method, entry.method],
    [m.status, `${entry.status} ${entry.statusText}`.trim()],
    [m.protocol, entry.protocol || m.unknown],
    [m.type, entry.mimeType || m.unknown],
    [m.start, formatTime(entry.started - capture.started, lang, m.unknown)],
    [m.time, formatTime(entry.duration, lang, m.unknown)],
    [m.size, formatBytes(entry.transferSize, lang, m.unknown)],
    [m.contentSize, formatBytes(entry.contentSize, lang, m.unknown)],
  ]
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        closeLabel={m.close}
        dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onRestoreFocus()
        }}
        className="max-h-[90dvh] min-w-0 overflow-y-auto sm:max-w-3xl rtl:[&>[data-slot=dialog-close]]:right-auto rtl:[&>[data-slot=dialog-close]]:left-4"
      >
        <DialogHeader className="min-w-0 pe-7 text-start sm:text-start">
          <DialogTitle>{m.details}</DialogTitle>
          <DialogDescription className="break-all" dir="auto">
            {requestName(entry.url)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge variant={isFailure(entry) ? "destructive" : "secondary"}>
            {entry.status}
          </Badge>
          <Badge variant="outline">{entry.method}</Badge>
          <ToolCopyButton
            value={entry.url}
            copyLabel={m.copy}
            copiedLabel={m.copied}
            ariaLabel={`${m.copy}: ${m.url}`}
          />
        </div>
        <p
          dir="ltr"
          className="min-w-0 rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all"
        >
          {entry.url}
        </p>
        <Tabs
          defaultValue="overview"
          className="min-w-0"
          dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
        >
          <TabsList
            className="h-auto w-full flex-wrap justify-start"
            aria-label={m.details}
          >
            {["overview", "request", "response", "timing"].map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {m[tab as "overview" | "request" | "response" | "timing"]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="overview" className="pt-3">
            <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 text-sm">
              {values.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="break-all tabular-nums" dir="auto">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="request" className="flex flex-col gap-5 pt-3">
            <Pairs
              title={m.headers}
              values={entry.request.headers}
              messages={m}
            />
            <Pairs title={m.query} values={entry.request.query} messages={m} />
            <Pairs
              title={m.cookies}
              values={entry.request.cookies}
              messages={m}
            />
            <BodyView body={entry.request.body} messages={m} />
          </TabsContent>
          <TabsContent value="response" className="flex flex-col gap-5 pt-3">
            <Pairs
              title={m.headers}
              values={entry.response.headers}
              messages={m}
            />
            <Pairs
              title={m.cookies}
              values={entry.response.cookies}
              messages={m}
            />
            <BodyView body={entry.response.body} messages={m} />
          </TabsContent>
          <TabsContent value="timing" className="pt-3">
            <TimingDetails entry={entry} messages={m} lang={lang} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
