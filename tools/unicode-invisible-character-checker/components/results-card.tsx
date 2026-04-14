import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { DEFAULT_ENABLED_CATEGORIES } from "../constants"
import type { InvisibleCategory, ScanResult } from "../core/unicode-invisible"
import { OutputPanel } from "./output-panel"

type ResultsCardProps = Readonly<{
  title: string
  description: string
  findingsCountLabel: string
  cleanLengthLabel: string
  activeFiltersLabel: string
  selectedCategoriesCount: number
  noIssuesLabel: string
  cleanedTitle: string
  annotatedTitle: string
  copyLabel: string
  copiedLabel: string
  downloadCleaned: string
  downloadAnnotated: string
  cleanedDownloadUrl: string | null
  annotatedDownloadUrl: string | null
  categoryLabels: Record<InvisibleCategory, string>
  scanResult: ScanResult
}>

function ResultsCard({
  title,
  description,
  findingsCountLabel,
  cleanLengthLabel,
  activeFiltersLabel,
  selectedCategoriesCount,
  noIssuesLabel,
  cleanedTitle,
  annotatedTitle,
  copyLabel,
  copiedLabel,
  downloadCleaned,
  downloadAnnotated,
  cleanedDownloadUrl,
  annotatedDownloadUrl,
  categoryLabels,
  scanResult,
}: ResultsCardProps) {
  const findingsCount = findingsCountLabel.replace(
    "{count}",
    String(scanResult.matches.length)
  )
  const cleanLength = cleanLengthLabel.replace(
    "{count}",
    String(scanResult.cleanedText.length)
  )
  const activeFilters = activeFiltersLabel.replace(
    "{count}",
    String(selectedCategoriesCount)
  )

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[findingsCount, cleanLength, activeFilters].map((value) => (
            <div
              key={value}
              className="rounded-lg border border-border/80 bg-muted/30 p-4"
            >
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {scanResult.matches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {DEFAULT_ENABLED_CATEGORIES.filter(
              (category) => scanResult.counts[category] > 0
            ).map((category) => (
              <Badge key={category} variant="secondary">
                {categoryLabels[category]}: {scanResult.counts[category]}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{noIssuesLabel}</p>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <OutputPanel
            title={cleanedTitle}
            value={scanResult.cleanedText}
            filename="cleaned.txt"
            downloadLabel={downloadCleaned}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            downloadUrl={cleanedDownloadUrl}
          />
          <OutputPanel
            title={annotatedTitle}
            value={scanResult.annotatedText}
            filename="annotated.txt"
            downloadLabel={downloadAnnotated}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            downloadUrl={annotatedDownloadUrl}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { ResultsCard }
