import { Button } from "@workspace/ui/components/ui/button"
import { Usb } from "@workspace/ui/icons"

import { Configurations } from "./configurations"
import { DeviceDetails } from "./device-details"
import { useInspector } from "./use-inspector"

import type english from "./messages/en.json"

export default function UsbDeviceInspector({
  messages,
}: {
  messages: typeof english
}) {
  const { supported, device, connected, busy, status, select, checkAccess } =
    useInspector()
  return (
    <section className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            disabled={!supported || !!busy}
            onClick={() => void select()}
          >
            <Usb aria-hidden="true" />
            {busy === "selecting" ? messages.selecting : messages.select}
          </Button>
          {device && (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={!connected || !!busy}
                onClick={() => void checkAccess()}
              >
                {busy === "checking" ? messages.checking : messages.checkAccess}
              </Button>
              <span
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "bg-muted-foreground/50"}`}
                />
                {connected ? messages.connected : messages.disconnected}
              </span>
            </>
          )}
        </div>
        {supported === false ? (
          <p className="text-sm text-muted-foreground">
            {messages.unsupported}
          </p>
        ) : (
          !device && (
            <p className="text-sm text-muted-foreground">
              {messages.chooseHint}
            </p>
          )
        )}
        {status && (
          <p
            role={status === "accessOk" ? "status" : "alert"}
            className={
              status === "accessOk" ? "text-sm" : "text-sm text-destructive"
            }
          >
            {messages[status]}
          </p>
        )}
        {device && <DeviceDetails device={device} messages={messages} />}
      </div>
      {device && (
        <Configurations configs={device.configurations} messages={messages} />
      )}
    </section>
  )
}
