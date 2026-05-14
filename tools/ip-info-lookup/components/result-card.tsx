import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Network } from "@workspace/ui/icons"

import { AddressCard } from "./address-card"
import { RecordTable } from "./record-table"
import { SummaryGrid } from "./summary-grid"
import { ResultAlert, StatusEmpty } from "./status"

import type { LookupInputState, LookupResult } from "../core/ip-info-lookup"
import type { IpInfoLookupMessages, LookupState } from "../types"

type ResultCardProps = Readonly<{
  inputState: LookupInputState
  lookupState: LookupState
  messages: IpInfoLookupMessages
}>

function ResultCard({ inputState, lookupState, messages }: ResultCardProps) {
  const result = lookupState.status === "success" ? lookupState.result : null
  const target = inputState.status === "valid" ? inputState.target : null
  const copyValue = result?.addresses.map((entry) => entry.address).join("\n")

  return (
    <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
      <CardHeader className="border-b py-4">
        <div className="grid gap-1">
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </div>
        {copyValue ? (
          <CardAction>
            <ToolCopyButton
              value={copyValue}
              copyLabel={messages.copyAllAddresses}
              copiedLabel={messages.copied}
            />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        {renderCardBody(inputState, lookupState, messages)}
        {target ? (
          <p className="border-t px-4 py-3 text-xs break-all text-muted-foreground">
            {messages.normalizedTarget}: {target.normalized}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function renderCardBody(
  inputState: LookupInputState,
  lookupState: LookupState,
  messages: IpInfoLookupMessages
) {
  if (lookupState.status === "loading") {
    return (
      <StatusEmpty
        icon={<Spinner />}
        title={messages.loadingTitle}
        description={messages.loadingDescription}
      />
    )
  }

  if (inputState.status === "invalid") {
    return (
      <ResultAlert
        title={messages.invalidTargetTitle}
        description={messages.invalidTargetDescription}
      />
    )
  }

  if (lookupState.status === "error") {
    return (
      <ResultAlert
        title={messages.lookupFailedTitle}
        description={messages.lookupFailedDescription}
      />
    )
  }

  if (lookupState.status === "success") {
    return <LookupResultView result={lookupState.result} messages={messages} />
  }

  return (
    <StatusEmpty
      icon={<Network />}
      title={messages.idleTitle}
      description={messages.idleDescription}
    />
  )
}

function LookupResultView({
  result,
  messages,
}: Readonly<{
  result: LookupResult
  messages: IpInfoLookupMessages
}>) {
  if (result.target.kind === "domain" && result.addresses.length === 0) {
    return (
      <StatusEmpty
        icon={<Network />}
        title={messages.noAddressesTitle}
        description={messages.noAddressesDescription}
      />
    )
  }

  return (
    <div className="grid gap-5 p-4">
      <SummaryGrid result={result} messages={messages} />
      {result.records.length > 0 ? (
        <RecordTable records={result.records} messages={messages} />
      ) : null}
      <div className="grid gap-4">
        {result.addresses.map((entry) => (
          <AddressCard key={entry.address} entry={entry} messages={messages} />
        ))}
      </div>
    </div>
  )
}

export { ResultCard }
