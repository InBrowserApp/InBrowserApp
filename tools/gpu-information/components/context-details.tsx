import { useId, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { ParameterCard } from "./parameter-card"
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
          <CardTitle>
            <h2>{messages.unavailableTitle}</h2>
          </CardTitle>
          <CardDescription>{messages.unavailableDescription}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <ParameterCard
        title={messages.identityTitle}
        description={messages.identityDescription}
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

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <ParameterCard
          title={messages.limitsTitle}
          description={messages.limitsDescription}
          entries={context.limits}
          messages={messages}
          compact
        />

        <div className="grid min-w-0 gap-6">
          <Extensions context={context} messages={messages} />
          <ParameterCard
            title={messages.attributesTitle}
            description={messages.attributesDescription}
            entries={context.attributes}
            messages={messages}
            compact
            collapsible
          />
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
        <CardTitle>
          <h2>{messages.extensionsTitle}</h2>
        </CardTitle>
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
          <Textarea
            readOnly
            aria-label={messages.extensionsTitle}
            dir="ltr"
            spellCheck={false}
            rows={Math.min(extensions.length, 10)}
            className="[field-sizing:fixed] max-h-80 min-h-20 resize-y overscroll-contain font-mono text-xs"
            value={extensions.join("\n")}
          />
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
    <Card className="gap-0 overflow-hidden py-0">
      <details>
        <summary className="cursor-pointer p-4 marker:text-muted-foreground hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring">
          <h2 className="ms-1 inline text-sm font-medium">
            {messages.precisionTitle}
          </h2>
        </summary>
        <CardHeader className="border-t pt-4">
          <CardDescription>{messages.precisionDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 py-4 lg:grid-cols-2">
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
                    <th
                      scope="col"
                      className="py-2 pe-3 text-start font-medium"
                    >
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
      </details>
    </Card>
  )
}

export { ContextDetails }
