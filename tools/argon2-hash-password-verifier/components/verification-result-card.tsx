import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
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
import { BadgeCheck, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type { Argon2HashPasswordVerifierPageMessages } from "../client/types"
import type { Argon2HashInfo } from "../core/argon2"

type VerificationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "verified"; info: Argon2HashInfo }
  | { status: "mismatch"; info: Argon2HashInfo }
  | { status: "invalid" }

type VerificationResultCardProps = Readonly<{
  state: VerificationState
  messages: Argon2HashPasswordVerifierPageMessages
}>

function VerificationResultCard({
  state,
  messages,
}: VerificationResultCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultLabel}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent aria-live="polite">
        <ResultState state={state} messages={messages} />
      </CardContent>
    </Card>
  )
}

function ResultState({ state, messages }: VerificationResultCardProps) {
  if (state.status === "idle") {
    return (
      <Empty className="min-h-44 border bg-muted/20">
        <EmptyHeader>
          <EmptyTitle>{messages.idleTitle}</EmptyTitle>
          <EmptyDescription>{messages.idleDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "loading") {
    return (
      <Empty className="min-h-44 border bg-muted/20">
        <EmptyMedia>
          <LoaderCircle className="animate-spin text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{messages.verifyingTitle}</EmptyTitle>
          <EmptyDescription>{messages.verifyingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "invalid") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>
          <strong>{messages.invalidTitle}</strong>
          <span className="mt-1 block">{messages.invalidDescription}</span>
        </AlertDescription>
      </Alert>
    )
  }

  const verified = state.status === "verified"

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-1">
            <p className="flex items-center gap-2 text-sm font-medium">
              {verified ? <BadgeCheck /> : <TriangleAlert />}
              {verified ? messages.verifiedTitle : messages.mismatchTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {verified
                ? messages.verifiedDescription
                : messages.mismatchDescription}
            </p>
          </div>
          <Badge variant={verified ? "default" : "secondary"}>
            {state.info.variant}
          </Badge>
        </div>
      </div>
      <HashDetails info={state.info} messages={messages} />
    </section>
  )
}

function HashDetails({
  info,
  messages,
}: Readonly<{
  info: Argon2HashInfo
  messages: Argon2HashPasswordVerifierPageMessages
}>) {
  const details = [
    [messages.variantLabel, info.variant],
    [
      messages.versionLabel,
      info.version === null ? messages.notAvailableLabel : String(info.version),
    ],
    [messages.memoryCostLabel, `${info.memoryCost} KiB`],
    [messages.iterationsLabel, String(info.iterations)],
    [messages.parallelismLabel, String(info.parallelism)],
    [messages.saltLengthLabel, `${info.saltLength} B`],
    [messages.digestLengthLabel, `${info.digestLength} B`],
  ] as const

  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-medium">{messages.hashDetailsLabel}</h3>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-lg border bg-background p-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-mono text-sm break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export { VerificationResultCard }
export type { VerificationState }
