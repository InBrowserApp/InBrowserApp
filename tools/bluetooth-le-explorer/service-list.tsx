import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { ChevronDown } from "@workspace/ui/icons"

import type { Characteristic } from "./bluetooth"
import type english from "./messages/en.json"
import type { Service, Value } from "./use-explorer"

export function ServiceList({
  services,
  values,
  subscribed,
  busy,
  messages,
  read,
  toggleSubscription,
}: {
  services: Service[]
  values: Map<Characteristic, Value>
  subscribed: Set<Characteristic>
  busy: boolean
  messages: typeof english
  read: (characteristic: Characteristic) => Promise<void>
  toggleSubscription: (characteristic: Characteristic) => Promise<void>
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="text-sm font-semibold">{messages.services}</h2>
      {services.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {messages.emptyServices}
        </p>
      )}
      {services.map((service, index) => (
        <details
          key={index}
          open={index === 0}
          className="group rounded-lg border"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-ring">
            <code dir="ltr" className="text-xs wrap-anywhere sm:text-sm">
              {service.uuid}
            </code>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
            />
          </summary>
          <div className="divide-y border-t">
            {service.characteristics.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">
                {messages.noCharacteristics}
              </p>
            )}
            {service.characteristics.map((characteristic, row) => {
              const properties = characteristic.properties
              const value = values.get(characteristic)
              const listening = subscribed.has(characteristic)
              // Web Bluetooth dispatches the same event for reads and notifications.
              const canRead = properties.read && !listening
              return (
                <div key={row} className="space-y-3 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="grid min-w-0 gap-1">
                      <span className="text-xs text-muted-foreground">
                        {messages.characteristic}
                      </span>
                      <code
                        dir="ltr"
                        className="text-xs wrap-anywhere sm:text-sm"
                      >
                        {characteristic.uuid}
                      </code>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {canRead && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          aria-label={`${messages.read} ${characteristic.uuid}`}
                          onClick={() => void read(characteristic)}
                        >
                          {messages.read}
                        </Button>
                      )}
                      {(properties.notify || properties.indicate) && (
                        <Button
                          type="button"
                          size="sm"
                          variant={listening ? "secondary" : "outline"}
                          disabled={busy}
                          aria-label={`${listening ? messages.unsubscribe : messages.subscribe} ${characteristic.uuid}`}
                          onClick={() =>
                            void toggleSubscription(characteristic)
                          }
                        >
                          {listening
                            ? messages.unsubscribe
                            : messages.subscribe}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {properties.read && (
                      <Badge variant="outline">{messages.readable}</Badge>
                    )}
                    {(properties.write || properties.writeWithoutResponse) && (
                      <Badge variant="outline">{messages.writable}</Badge>
                    )}
                    {properties.notify && (
                      <Badge variant="outline">{messages.notify}</Badge>
                    )}
                    {properties.indicate && (
                      <Badge variant="outline">{messages.indicate}</Badge>
                    )}
                  </div>
                  {value && (
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-md bg-muted/55 px-3 py-2 text-sm">
                      <dt className="text-muted-foreground">{messages.hex}</dt>
                      <dd dir="ltr" className="font-mono wrap-anywhere">
                        {value.hex || messages.emptyValue}
                      </dd>
                      <dt className="text-muted-foreground">{messages.text}</dt>
                      <dd
                        dir="auto"
                        className="font-mono wrap-anywhere whitespace-pre-wrap"
                      >
                        {value.text || messages.emptyValue}
                      </dd>
                    </dl>
                  )}
                </div>
              )
            })}
          </div>
        </details>
      ))}
    </div>
  )
}
