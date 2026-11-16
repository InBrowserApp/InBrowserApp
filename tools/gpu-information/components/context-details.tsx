import { useId, useState } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"

import { ParameterList } from "./parameter-list"
import type { AvailableContext, GpuMessages, GraphicsContext } from "../types"

function ContextDetails({
  context,
  messages,
}: Readonly<{
  context: GraphicsContext
  messages: GpuMessages
}>) {
  if (!context.available) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{messages.unavailableTitle}</CardTitle>
          <CardDescription>{messages.unavailableDescription}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="border-b pb-4">
          <CardTitle>{messages.identityTitle}</CardTitle>
          <CardDescription>{messages.identityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ParameterList
            messages={messages}
            entries={[
              { name: messages.gpuVendor, value: context.vendor },
              { name: messages.gpuRenderer, value: context.renderer },
              { name: messages.unmaskedVendor, value: context.unmaskedVendor },
              {
                name: messages.unmaskedRenderer,
                value: context.unmaskedRenderer,
              },
              { name: messages.version, value: context.version },
              {
                name: messages.shadingLanguage,
                value: context.shadingLanguage,
              },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="gap-0 overflow-hidden pb-0">
          <CardHeader className="border-b pb-4">
            <CardTitle>{messages.limitsTitle}</CardTitle>
            <CardDescription>{messages.limitsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ParameterList entries={context.limits} messages={messages} />
          </CardContent>
        </Card>

        <div className="grid min-w-0 gap-6">
          <Extensions context={context} messages={messages} />
          <Card className="gap-0 overflow-hidden pb-0">
            <CardHeader className="border-b pb-4">
              <CardTitle>{messages.attributesTitle}</CardTitle>
              <CardDescription>
                {messages.attributesDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {context.attributes.length ? (
                <ParameterList
                  entries={context.attributes}
                  messages={messages}
                />
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  {messages.notReported}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Precision context={context} messages={messages} />
    </div>
  )
}

function Extensions({
  context,
  messages,
}: Readonly<{
  context: AvailableContext
  messages: GpuMessages
}>) {
  const [query, setQuery] = useState("")
  const searchId = useId()
  const extensions = context.extensions.filter((extension) =>
    extension.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.extensionsTitle}</CardTitle>
        <CardDescription>{messages.extensionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <label className="sr-only" htmlFor={searchId}>
          {messages.searchExtensions}
        </label>
        <Input
          id={searchId}
          type="search"
          name="extensions"
          autoComplete="off"
          spellCheck={false}
          placeholder={messages.searchExtensions}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p
          className="text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {extensions.length} / {context.extensions.length}
        </p>
        {extensions.length ? (
          <ul className="grid gap-2" dir="ltr">
            {extensions.map((extension) => (
              <li key={extension} className="min-w-0">
                <Badge
                  variant="secondary"
                  className="max-w-full rounded-md px-2 py-1 text-start font-mono text-xs [overflow-wrap:anywhere] whitespace-normal"
                >
                  {extension}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {context.extensions.length
              ? messages.noMatches
              : messages.noExtensions}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function Precision({
  context,
  messages,
}: Readonly<{
  context: AvailableContext
  messages: GpuMessages
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.precisionTitle}</CardTitle>
        <CardDescription>{messages.precisionDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        {(["vertex", "fragment"] as const).map((stage) => (
          <div key={stage} className="min-w-0 overflow-x-auto">
            <table className="w-full text-start text-xs tabular-nums">
              <caption className="pb-3 text-start text-sm font-medium text-foreground">
                {stage === "vertex"
                  ? messages.vertexShader
                  : messages.fragmentShader}
              </caption>
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th scope="col" className="py-2 pe-3 text-start font-medium">
                    {messages.format}
                  </th>
                  <th scope="col" className="p-2 text-start font-medium">
                    {messages.range}
                    <code className="block text-[10px]" dir="ltr">
                      rangeMin / rangeMax
                    </code>
                  </th>
                  <th scope="col" className="py-2 ps-2 text-end font-medium">
                    {messages.precisionBits}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {context.precision
                  .filter((entry) => entry.stage === stage)
                  .map((entry) => (
                    <tr key={entry.format}>
                      <th
                        scope="row"
                        className="py-2 pe-3 text-start font-mono font-normal"
                      >
                        {entry.format}
                      </th>
                      <td className="p-2 font-mono" dir="ltr">
                        {entry.rangeMin === null
                          ? messages.notReported
                          : `${entry.rangeMin} / ${entry.rangeMax}`}
                      </td>
                      <td className="py-2 ps-2 text-end font-mono">
                        {entry.precision ?? messages.notReported}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export { ContextDetails }
