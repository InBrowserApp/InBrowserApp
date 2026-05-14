import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Lock, TriangleAlert } from "@workspace/ui/icons"

import type { BcryptHashPasswordMessages } from "../client/types"
import type { BcryptHashResult } from "../core/bcrypt"

type HashGenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; result: BcryptHashResult }
  | { status: "error"; message: string }

type HashOutputCardProps = Readonly<{
  state: HashGenerationState
  messages: BcryptHashPasswordMessages
}>

function HashOutputCard({ state, messages }: HashOutputCardProps) {
  const hash = state.status === "ready" ? state.result.hash : ""

  return (
    <ToolPanelCard>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.outputTitle}</CardTitle>
          <CardDescription>{messages.outputDescription}</CardDescription>
        </div>
        {state.status === "ready" ? (
          <CardAction>
            <Badge variant="secondary">
              {messages.generatedSummary.replace(
                "{cost}",
                String(state.result.parts.cost)
              )}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <ToolPanelCardContent>
        <HashOutputContent state={state} messages={messages} />
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <ToolCopyButton
          value={hash}
          copyLabel={messages.copyHashLabel}
          copiedLabel={messages.copiedLabel}
          disabled={state.status !== "ready"}
          variant="ghost"
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function HashOutputContent({
  state,
  messages,
}: Readonly<{
  state: HashGenerationState
  messages: BcryptHashPasswordMessages
}>) {
  if (state.status === "idle" || state.status === "loading") {
    return (
      <Empty className="min-h-80 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>
            {state.status === "loading"
              ? messages.generatingLabel
              : messages.emptyTitle}
          </EmptyTitle>
          <EmptyDescription>
            {state.status === "loading"
              ? messages.outputDescription
              : messages.emptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "error") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{messages.errorTitle}</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    )
  }

  return <ReadyHashOutput result={state.result} messages={messages} />
}

function ReadyHashOutput({
  result,
  messages,
}: Readonly<{
  result: BcryptHashResult
  messages: BcryptHashPasswordMessages
}>) {
  return (
    <section className="grid gap-5" aria-label={messages.hashDetailsLabel}>
      <output
        aria-label={messages.hashValueLabel}
        className="min-h-28 rounded-lg border bg-muted/30 p-4 font-mono text-sm break-all"
      >
        {result.hash}
      </output>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <HashDetail
          label={messages.versionLabel}
          value={result.parts.version}
        />
        <HashDetail
          label={messages.costValueLabel}
          value={String(result.parts.cost)}
        />
        <HashDetail label={messages.saltLabel} value={result.parts.salt} />
        <HashDetail
          label={messages.checksumLabel}
          value={result.parts.checksum}
        />
      </dl>
    </section>
  )
}

function HashDetail({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="min-w-0 rounded-lg border bg-card p-3">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm break-all">{value}</dd>
    </div>
  )
}

export { HashOutputCard }
export type { HashGenerationState }
