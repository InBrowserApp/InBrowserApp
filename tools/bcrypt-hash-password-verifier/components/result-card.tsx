import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
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
import {
  BadgeCheck,
  Check,
  LoaderCircle,
  Lock,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { BcryptHashPasswordVerifierMessages } from "../client/types"
import type { BcryptHashDetails } from "../core/bcrypt"

type VerificationState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "match"; details: BcryptHashDetails }>
  | Readonly<{ status: "mismatch"; details: BcryptHashDetails }>
  | Readonly<{ status: "invalid-hash" }>

type ResultCardProps = Readonly<{
  messages: BcryptHashPasswordVerifierMessages
  state: VerificationState
}>

function ResultCard({ messages, state }: ResultCardProps) {
  const description =
    state.status === "match"
      ? messages.matchTitle
      : state.status === "mismatch"
        ? messages.mismatchTitle
        : state.status === "invalid-hash"
          ? messages.invalidHashTitle
          : state.status === "loading"
            ? messages.loadingTitle
            : messages.resultDescription

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4" aria-live="polite">
        {state.status === "idle" ? (
          <Empty className="min-h-72 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Lock />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : state.status === "loading" ? (
          <Empty className="min-h-72 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LoaderCircle className="animate-spin" />
              </EmptyMedia>
              <EmptyTitle>{messages.loadingTitle}</EmptyTitle>
              <EmptyDescription>{messages.loadingDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : state.status === "invalid-hash" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidHashTitle}</AlertTitle>
            <AlertDescription>
              {messages.invalidHashDescription} {messages.invalidHashHelp}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={state.status === "match" ? "default" : "destructive"}
                >
                  {state.status === "match" ? (
                    <BadgeCheck />
                  ) : (
                    <TriangleAlert />
                  )}
                  {state.status === "match"
                    ? messages.matchTitle
                    : messages.mismatchTitle}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {state.status === "match"
                    ? messages.matchDescription
                    : messages.mismatchDescription}
                </p>
              </div>
            </section>
            <section
              aria-label={messages.detailsTitle}
              className="grid gap-3 sm:grid-cols-3"
            >
              <DetailTile
                label={messages.versionLabel}
                value={`$${state.details.version}$`}
              />
              <DetailTile
                label={messages.costLabel}
                value={String(state.details.cost)}
              />
              <DetailTile label={messages.formatLabel} value="bcrypt" />
            </section>
          </>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function DetailTile({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl border border-border/70 bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Check />
        {label}
      </div>
      <div className="mt-2 font-mono text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  )
}

export { ResultCard, type VerificationState }
