import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from "@workspace/ui/lib/utils"
import { LoaderCircle, Lock, TriangleAlert } from "@workspace/ui/icons"

import type { Argon2HashPasswordPageMessages } from "../client/types"

type HashState =
  | { status: "idle" }
  | { status: "loading"; hash: string | null }
  | { status: "ready"; hash: string }
  | { status: "error"; message: string }

type ResultCardProps = Readonly<{
  state: HashState
  canGenerate: boolean
  messages: Argon2HashPasswordPageMessages
}>

function ResultCard({ state, canGenerate, messages }: ResultCardProps) {
  const loading = state.status === "loading"

  return (
    <Card>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.hashResultLabel}</CardTitle>
          <CardDescription>{messages.hashResultDescription}</CardDescription>
        </div>
        {loading ? (
          <CardAction>
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col" aria-live="polite">
        <ResultSection state={state} messages={messages} />
      </CardContent>
      <CardFooter className="flex-wrap justify-start gap-3 border-t">
        <Button type="submit" disabled={!canGenerate || loading}>
          {loading ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <Lock data-icon="inline-start" />
          )}
          {loading ? messages.generatingHashLabel : messages.generateHashLabel}
        </Button>

        <ToolCopyButton
          value={state.status === "ready" ? state.hash : ""}
          copyLabel={messages.copyHashLabel}
          copiedLabel={messages.copiedLabel}
          disabled={state.status !== "ready"}
        />
      </CardFooter>
    </Card>
  )
}

function ResultSection({
  state,
  messages,
}: Readonly<{
  state: HashState
  messages: Argon2HashPasswordPageMessages
}>) {
  if (state.status === "idle") {
    return (
      <Empty className="min-h-64 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>{messages.emptyStateTitle}</EmptyTitle>
          <EmptyDescription>{messages.emptyStateDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <section className="grid gap-4">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "loading" || state.status === "ready" ? (
        <EncodedHashOutput
          value={state.hash}
          loading={state.status === "loading"}
          messages={messages}
        />
      ) : null}
    </section>
  )
}

function EncodedHashOutput({
  value,
  loading,
  messages,
}: Readonly<{
  value: string | null
  loading: boolean
  messages: Argon2HashPasswordPageMessages
}>) {
  return (
    <section
      className={cn(
        "grid gap-3 rounded-xl border bg-muted/20 p-4",
        loading && "opacity-75"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-medium">{messages.encodedHashLabel}</h3>
        <ToolCopyButton
          value={value ?? ""}
          copyLabel={messages.copyHashLabel}
          copiedLabel={messages.copiedLabel}
          disabled={loading || !value}
        />
      </div>
      <div className="relative min-h-[8rem]">
        {value ? (
          <code
            className={cn(
              "block text-xs leading-6 break-all transition-opacity sm:text-sm",
              loading && "opacity-30"
            )}
          >
            {value}
          </code>
        ) : null}

        {loading ? (
          <div
            className={cn(
              "grid gap-2",
              value ? "absolute inset-0" : "min-h-[8rem] content-start"
            )}
            aria-hidden="true"
          >
            <div className="h-3 w-full animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-foreground/10" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-foreground/10" />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export { ResultCard }
export type { HashState }
