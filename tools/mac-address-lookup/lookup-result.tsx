import {
  getBlockRange,
  makeToolHref,
  type lookupMac,
} from "@workspace/mac-address"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import type EnglishMessages from "./messages/en.json"

type Props = Readonly<{
  result: ReturnType<typeof lookupMac>
  ready: boolean
  language: string
  messages: typeof EnglishMessages
}>

function LookupResult({ result, ready, language, messages }: Props) {
  const { parsed, match, matches } = result
  if (!parsed) {
    return (
      <p className="hidden min-h-40 items-center justify-center text-sm text-muted-foreground lg:flex">
        {messages.emptyLookupHint}
      </p>
    )
  }

  const block = match ? getBlockRange(match) : null
  const { kind } = parsed
  const special = kind !== "universal" && kind !== "prefix"
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <code
            dir="ltr"
            translate="no"
            className="font-mono text-base break-all"
          >
            {parsed.formatted}
          </code>
          <ToolCopyButton
            value={parsed.formatted}
            copyLabel={messages.copyAddress}
            copiedLabel={messages.addressCopied}
            ariaLabel={messages.copyAddress}
            size="icon-sm"
            variant="ghost"
          />
        </div>
      </CardHeader>
      {matches.length > 0 ? (
        <CardContent className="flex min-w-0 flex-col gap-5">
          <ul className="flex flex-col gap-4">
            {matches.map((record) => (
              <li
                key={`${record.registry}:${record.assignment}:${record.organization}:${record.address}`}
                className="flex min-w-0 flex-col gap-1"
              >
                <a
                  className="rounded-sm font-heading text-xl font-medium wrap-anywhere underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  href={makeToolHref(language, "mac-address-vendor-lookup", {
                    org: record.organization,
                  })}
                >
                  <bdi translate="no">{record.organization}</bdi>
                </a>
                {record.address ? (
                  <p className="text-sm wrap-anywhere text-muted-foreground">
                    <bdi translate="no">{record.address}</bdi>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          {block && match ? (
            <div className="flex flex-col gap-4 border-t pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={makeToolHref(language, "mac-address-block-lookup", {
                    q: match.assignment,
                    registry: match.registry,
                  })}
                  className="rounded-sm font-mono text-sm underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  dir="ltr"
                  translate="no"
                >
                  {block.prefix}
                </a>
                <span
                  className="text-xs text-muted-foreground"
                  dir="ltr"
                  translate="no"
                >
                  {match.registry}
                </span>
              </div>
              <dl className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex min-w-0 flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">
                    {messages.range}
                  </dt>
                  <dd
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm"
                    dir="ltr"
                    translate="no"
                  >
                    <span className="whitespace-nowrap">{block.start}</span>
                    <span>–</span>
                    <span className="whitespace-nowrap">{block.end}</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">
                    {messages.capacity}
                  </dt>
                  <dd className="font-mono text-sm tabular-nums">
                    {new Intl.NumberFormat(language).format(block.size)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </CardContent>
      ) : special ? (
        <CardContent className="flex flex-col gap-2">
          <p className="font-medium">{messages.types[kind]}</p>
          <p className="text-sm text-muted-foreground">
            {messages.typeHints[kind]}
          </p>
        </CardContent>
      ) : ready ? (
        <CardContent className="flex flex-col gap-2">
          <p>{messages.noAssignment}</p>
          <a
            className="w-fit rounded-sm text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href={makeToolHref(language, "mac-address-block-lookup", {
              q: parsed.hex,
            })}
          >
            {messages.blocks}
          </a>
        </CardContent>
      ) : null}
    </Card>
  )
}

export { LookupResult }
