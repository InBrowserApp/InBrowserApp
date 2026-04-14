import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { RegexAnalysisSummary } from "../core/regex-tester-replacer"
import type { RegexTesterReplacerLocalizedCatalog } from "../types"

type SummaryCardProps = Readonly<{
  hasPattern: boolean
  hasSourceText: boolean
  messages: RegexTesterReplacerLocalizedCatalog
  patternError: string | null
  summary: RegexAnalysisSummary
}>

function SummaryCard({
  hasPattern,
  hasSourceText,
  messages,
  patternError,
  summary,
}: SummaryCardProps) {
  const canShowCounts = hasPattern && hasSourceText && !patternError

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.summaryTitle}</CardTitle>
        <CardDescription>{messages.summaryDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {canShowCounts ? (
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">
              {messages.matchesCountLabel.replace(
                "{count}",
                String(summary.matchCount)
              )}
            </Badge>
            <Badge variant="secondary">
              {messages.groupsCountLabel.replace(
                "{count}",
                String(summary.groupCount)
              )}
            </Badge>
            <Badge variant="secondary">
              {messages.zeroLengthCountLabel.replace(
                "{count}",
                String(summary.zeroLengthCount)
              )}
            </Badge>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {messages.summaryEmpty}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export { SummaryCard }
