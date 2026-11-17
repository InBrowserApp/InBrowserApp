import {
  getBlockRange,
  makeToolHref,
  type lookupMac,
} from "@workspace/mac-address"
import { MacAddressRecords } from "@workspace/ui/components/tool/mac-address-records"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Network } from "@workspace/ui/icons"
import type EnglishMessages from "./messages/en.json"

type Props = Readonly<{
  result: ReturnType<typeof lookupMac>
  hasQuery: boolean
  ready: boolean
  language: string
  messages: typeof EnglishMessages
}>

function LookupResult({ result, hasQuery, ready, language, messages }: Props) {
  const { parsed, match, matches } = result
  if (!parsed) {
    return (
      <Card className="min-w-0">
        <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
          <Network
            aria-hidden="true"
            className="size-8 text-muted-foreground"
          />
          <p className="font-medium">{messages.emptyLookup}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {hasQuery ? messages.invalidAddress : messages.emptyLookupHint}
          </p>
        </CardContent>
      </Card>
    )
  }

  const block = match ? getBlockRange(match) : null
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle>{messages.normalized}</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <code
            dir="ltr"
            translate="no"
            className="font-mono text-lg break-all"
          >
            {parsed.formatted}
          </code>
          <ToolCopyButton
            value={parsed.formatted}
            copyLabel={messages.copyAddress}
            copiedLabel={messages.addressCopied}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.addressType}
          </span>
          <Badge variant="secondary">{messages.types[parsed.kind]}</Badge>
        </div>
        <CardDescription>{messages.typeHints[parsed.kind]}</CardDescription>
      </CardHeader>
      {matches.length > 0 ? (
        <CardContent className="flex min-w-0 flex-col gap-5 px-0">
          <MacAddressRecords
            labels={messages}
            rows={matches.map((record) => ({
              key: `${record.registry}:${record.assignment}:${record.organization}:${record.address}`,
              prefix: getBlockRange(record).prefix,
              registry: record.registry,
              organization: record.organization,
              address: record.address,
              blockHref: makeToolHref(language, "mac-address-block-lookup", {
                q: record.assignment,
                registry: record.registry,
              }),
              organizationHref: makeToolHref(
                language,
                "mac-address-vendor-lookup",
                { org: record.organization }
              ),
            }))}
          />
          {block ? (
            <dl className="grid gap-4 px-6 sm:grid-cols-[minmax(0,1fr)_auto]">
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
          ) : null}
        </CardContent>
      ) : ready && (parsed.kind === "universal" || parsed.kind === "prefix") ? (
        <CardContent className="flex flex-col gap-1">
          <p className="font-medium">{messages.noAssignment}</p>
          <p className="text-sm text-muted-foreground">
            {messages.noAssignmentHint}
          </p>
          <a
            className="mt-2 rounded-sm text-sm underline underline-offset-4 focus-visible:outline-2"
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
