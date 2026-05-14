import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
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
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { BadgeCheck } from "@workspace/ui/icons"

import type { ClaimCheck } from "../core/jwt-claims"
import type { JwtDecoderVerifierMessages } from "../client/types"

type ClaimsCardProps = Readonly<{
  checks: readonly ClaimCheck[]
  messages: JwtDecoderVerifierMessages["claims"]
}>

function ClaimsCard({ checks, messages }: ClaimsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.title}</CardTitle>
        <CardDescription>{messages.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        {checks.length === 0 ? (
          <Empty className="min-h-40">
            <EmptyHeader>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {checks.map((check) => (
              <li
                key={`${check.code}-${"isoDate" in check ? check.isoDate : ""}`}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <span className="min-w-0 text-sm break-words">
                  {formatClaimMessage(messages, check)}
                </span>
                <Badge
                  variant={getBadgeVariant(check.severity)}
                  className="shrink-0"
                >
                  <BadgeCheck data-icon="inline-start" />
                  {messages.severities[check.severity]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function formatClaimMessage(
  messages: JwtDecoderVerifierMessages["claims"],
  check: ClaimCheck
) {
  const message = messages.messages[check.code]
  return "isoDate" in check ? message.replace("{date}", check.isoDate) : message
}

function getBadgeVariant(severity: ClaimCheck["severity"]) {
  if (severity === "danger") return "destructive"
  if (severity === "success") return "default"
  if (severity === "warning") return "secondary"
  return "outline"
}

export { ClaimsCard }
