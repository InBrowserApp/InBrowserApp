import { useId, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Bluetooth } from "@workspace/ui/icons"

import { requestedServices } from "./core/data"
import { NotificationLog } from "./notification-log"
import { ServiceList } from "./service-list"
import { useExplorer } from "./use-explorer"

import type english from "./messages/en.json"

export default function BluetoothExplorer({
  messages,
}: {
  messages: typeof english
}) {
  const explorer = useExplorer()
  const [input, setInput] = useState("")
  const hintId = useId()
  const requested = requestedServices(input)
  const { supported, connecting, connected, error } = explorer

  return (
    <section className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={connected ? "outline" : "default"}
            disabled={
              !supported ||
              connecting ||
              (!connected && (explorer.busy || !requested))
            }
            onClick={() => {
              if (connected) explorer.disconnect()
              else if (requested) void explorer.connect(requested)
            }}
          >
            <Bluetooth aria-hidden="true" />
            {connected
              ? messages.disconnect
              : connecting
                ? messages.connecting
                : messages.connect}
          </Button>
          <div
            role="status"
            className="flex min-w-0 flex-wrap items-center gap-x-2 text-sm text-muted-foreground"
          >
            <span>
              {connected
                ? messages.connected
                : connecting
                  ? messages.connecting
                  : messages.disconnected}
            </span>
            {connected && (
              <span className="min-w-0 font-medium wrap-anywhere text-foreground">
                {connected.name || messages.unnamedDevice}
              </span>
            )}
          </div>
        </div>
        {!connected && (
          <>
            <label className="grid max-w-lg gap-1.5 text-sm font-medium">
              {messages.additionalServices}
              <Input
                dir="ltr"
                placeholder="180F"
                value={input}
                disabled={connecting}
                aria-invalid={!requested}
                aria-describedby={hintId}
                spellCheck={false}
                onChange={(event) => setInput(event.target.value)}
              />
            </label>
            <p
              id={hintId}
              className={
                requested
                  ? "text-xs text-muted-foreground"
                  : "text-xs text-destructive"
              }
            >
              {requested ? messages.servicesHint : messages.invalidUuid}
            </p>
          </>
        )}
        {supported === false && (
          <p className="text-sm text-muted-foreground">
            {messages.unsupported}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messages[error]}
          </p>
        )}
      </div>

      {connected && (
        <ServiceList
          services={explorer.services}
          values={explorer.values}
          subscribed={explorer.subscribed}
          busy={explorer.busy}
          messages={messages}
          read={explorer.read}
          toggleSubscription={explorer.toggleSubscription}
        />
      )}
      <NotificationLog
        notifications={explorer.notifications}
        messages={messages}
        clear={explorer.clearLog}
      />
    </section>
  )
}
