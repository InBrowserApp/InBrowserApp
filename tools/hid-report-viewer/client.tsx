import { Button } from "@workspace/ui/components/ui/button"
import { Binary } from "@workspace/ui/icons"

import { Collections } from "./collections"
import { hex } from "./core/report"
import { ReportLog } from "./report-log"
import { useHidDevice } from "./use-hid-device"
import { useReportLog } from "./use-report-log"

import type english from "./messages/en.json"

export default function HidReportViewer({
  language,
  messages,
}: {
  language: string
  messages: typeof english
}) {
  const log = useReportLog()
  const {
    supported,
    device,
    interfaces,
    selectedIndex,
    phase,
    error,
    connect,
    disconnect,
  } = useHidDevice(log.add, log.startSession)
  const connected = phase === "connected"
  const busy = phase === "connecting" || phase === "disconnecting"
  const action = {
    disconnected: messages.connect,
    connecting: messages.connecting,
    connected: messages.disconnect,
    disconnecting: messages.disconnecting,
  }[phase]

  return (
    <section className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={connected ? "outline" : "default"}
            disabled={!supported || busy}
            onClick={() => void (connected ? disconnect() : connect())}
          >
            <Binary aria-hidden="true" />
            {action}
          </Button>
          <span role="status" className="text-sm text-muted-foreground">
            {connected
              ? messages.connected
              : busy
                ? action
                : messages.disconnected}
          </span>
        </div>
        {interfaces.length > 1 && (
          <label className="flex flex-wrap items-center gap-2 text-sm">
            HID
            <select
              dir="ltr"
              disabled={busy}
              value={selectedIndex}
              onChange={(event) => void connect(Number(event.target.value))}
              className="h-9 max-w-full rounded-md border border-input bg-background px-2 font-mono text-sm focus-visible:outline-2 focus-visible:outline-ring"
            >
              {interfaces.map((item, index) => {
                const first = item.collections[0]
                return (
                  <option key={index} value={index}>
                    {index + 1}
                    {first &&
                      ` · 0x${hex(first.usagePage, 4)} / 0x${hex(first.usage, 4)}`}
                  </option>
                )
              })}
            </select>
          </label>
        )}
        {supported === false && (
          <p className="text-sm text-muted-foreground">
            {messages.unsupported}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messages.connectionError}
          </p>
        )}
        {device && (
          <div className="space-y-2 border-t pt-3">
            <h2 className="font-semibold wrap-anywhere">
              {device.productName || messages.unnamed}
            </h2>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">
                  {messages.vendorId}
                </dt>
                <dd>
                  <code dir="ltr">0x{hex(device.vendorId, 4)}</code>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {messages.productId}
                </dt>
                <dd>
                  <code dir="ltr">0x{hex(device.productId, 4)}</code>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
      {device && (
        <Collections collections={device.collections} messages={messages} />
      )}
      <ReportLog
        language={language}
        messages={messages}
        connected={connected}
        reports={log.reports}
        paused={log.paused}
        clear={log.clear}
        toggleCapture={log.toggleCapture}
      />
    </section>
  )
}
