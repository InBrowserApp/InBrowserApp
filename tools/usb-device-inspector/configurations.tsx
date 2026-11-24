import { ChevronDown } from "@workspace/ui/icons"

import { usbHex } from "./core/format"

import type english from "./messages/en.json"
import type { Configuration, Endpoint } from "./usb"

type Messages = typeof english

export function Configurations({
  configs,
  messages,
}: {
  configs: Configuration[]
  messages: Messages
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="text-sm font-semibold">{messages.configurations}</h2>
      {configs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {messages.noConfigurations}
        </p>
      )}
      {configs.map((config, index) => (
        <details
          key={config.configurationValue}
          open={index === 0}
          className="rounded-lg border [&[open]>summary>svg]:rotate-180"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
            <span className="min-w-0 wrap-anywhere">
              {messages.configuration} {config.configurationValue}
              {config.configurationName && (
                <span className="ms-2 font-normal text-muted-foreground">
                  {config.configurationName}
                </span>
              )}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </summary>
          <div className="divide-y border-t">
            {config.interfaces.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">
                {messages.noInterfaces}
              </p>
            )}
            {config.interfaces.map((usbInterface) => (
              <div key={usbInterface.interfaceNumber} className="space-y-3 p-3">
                <h3 className="text-sm font-medium">
                  {messages.interface} {usbInterface.interfaceNumber}
                </h3>
                {usbInterface.alternates.map((alternate) => (
                  <div
                    key={alternate.alternateSetting}
                    className="space-y-2 rounded-md bg-muted/45 p-3"
                  >
                    <h4 className="text-xs font-medium wrap-anywhere">
                      {messages.alternate} {alternate.alternateSetting}
                      {alternate.interfaceName && (
                        <span className="ms-2 font-normal text-muted-foreground">
                          {alternate.interfaceName}
                        </span>
                      )}
                    </h4>
                    <dl className="flex flex-wrap gap-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">
                          {messages.class}
                        </dt>
                        <dd>
                          <code dir="ltr">
                            {usbHex(alternate.interfaceClass)}
                          </code>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {messages.subclass}
                        </dt>
                        <dd>
                          <code dir="ltr">
                            {usbHex(alternate.interfaceSubclass)}
                          </code>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          {messages.protocol}
                        </dt>
                        <dd>
                          <code dir="ltr">
                            {usbHex(alternate.interfaceProtocol)}
                          </code>
                        </dd>
                      </div>
                    </dl>
                    <Endpoints
                      endpoints={alternate.endpoints}
                      messages={messages}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}

function Endpoints({
  endpoints,
  messages,
}: {
  endpoints: Endpoint[]
  messages: Messages
}) {
  if (endpoints.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{messages.noEndpoints}</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-xs sm:text-sm">
        <colgroup>
          <col className="w-[16%]" />
          <col className="w-[18%]" />
          <col className="w-[32%]" />
          <col className="w-[34%]" />
        </colgroup>
        <thead className="text-muted-foreground">
          <tr>
            {[
              messages.endpoint,
              messages.direction,
              messages.transferType,
              messages.packetSize,
            ].map((label) => (
              <th
                key={label}
                scope="col"
                className="px-1.5 py-1 text-start font-medium wrap-anywhere sm:px-2"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y border-t">
          {endpoints.map((endpoint) => (
            <tr key={`${endpoint.endpointNumber}-${endpoint.direction}`}>
              <td className="px-1.5 py-1.5 font-mono sm:px-2">
                {endpoint.endpointNumber}
              </td>
              <td className="px-1.5 py-1.5 font-mono sm:px-2">
                {endpoint.direction.toUpperCase()}
              </td>
              <td className="px-1.5 py-1.5 wrap-anywhere sm:px-2">
                {messages[endpoint.type]}
              </td>
              <td className="px-1.5 py-1.5 font-mono sm:px-2">
                {endpoint.packetSize}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
