import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Eye, Globe, LoaderCircle } from "@workspace/ui/icons"

import { createMapUrls, getGpsCoordinates } from "../core/metadata"
import type {
  MetadataGroup,
  MetadataGroupId,
  MetadataRecord,
} from "../core/metadata"
import type { ExifViewerMessages } from "../client/types"

type MetadataResultsProps = Readonly<{
  categoryCount: number
  fieldCount: number
  groups: readonly MetadataGroup[]
  isLoading: boolean
  metadata: MetadataRecord | null
  metadataJson: string
  messages: ExifViewerMessages
  showAmap: boolean
}>

const categoryLabels = {
  basic: "categoryBasic",
  camera: "categoryCamera",
  gps: "categoryGps",
  advanced: "categoryAdvanced",
} as const satisfies Record<MetadataGroupId, keyof ExifViewerMessages>

function MetadataResults({
  categoryCount,
  fieldCount,
  groups,
  isLoading,
  metadata,
  metadataJson,
  messages,
  showAmap,
}: MetadataResultsProps) {
  if (isLoading) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircle className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>{messages.readingMetadata}</EmptyTitle>
          <EmptyDescription>{messages.readingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!metadata) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye />
          </EmptyMedia>
          <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
          <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (fieldCount === 0) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye />
          </EmptyMedia>
          <EmptyTitle>{messages.noExifTitle}</EmptyTitle>
          <EmptyDescription>{messages.noExifDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-base font-medium">
            {messages.metadataResults}
          </h2>
          <p className="text-sm text-muted-foreground">
            {messages.resultsDescription}
          </p>
        </div>
        <ToolCopyButton
          value={metadataJson}
          copyLabel={messages.copyAsJson}
          copiedLabel={messages.copiedJson}
        />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <Metric label={messages.fieldsFound} value={String(fieldCount)} />
        <Metric
          label={messages.categoriesFound}
          value={String(categoryCount)}
        />
        <Metric
          label={messages.gpsStatus}
          value={
            getGpsCoordinates(metadata)
              ? messages.gpsAvailable
              : messages.gpsUnavailable
          }
        />
      </dl>

      <GpsActions metadata={metadata} messages={messages} showAmap={showAmap} />

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <MetadataGroupDetails
            group={group}
            key={group.id}
            messages={messages}
          />
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-medium">{value}</dd>
    </div>
  )
}

function GpsActions({
  metadata,
  messages,
  showAmap,
}: Readonly<{
  metadata: MetadataRecord
  messages: ExifViewerMessages
  showAmap: boolean
}>) {
  const coords = getGpsCoordinates(metadata)

  if (!coords) {
    return null
  }

  const mapUrls = createMapUrls(coords.latitude, coords.longitude)

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="outline">
        <a href={mapUrls.googleMaps} rel="noreferrer" target="_blank">
          <Globe data-icon="inline-start" />
          {messages.openInGoogleMaps}
        </a>
      </Button>
      {showAmap ? (
        <Button asChild size="sm" variant="outline">
          <a href={mapUrls.amap} rel="noreferrer" target="_blank">
            <Globe data-icon="inline-start" />
            {messages.openInAmap}
          </a>
        </Button>
      ) : null}
    </div>
  )
}

function MetadataGroupDetails({
  group,
  messages,
}: Readonly<{
  group: MetadataGroup
  messages: ExifViewerMessages
}>) {
  return (
    <details className="rounded-lg border bg-card" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium">
        <span>{messages[categoryLabels[group.id]]}</span>
        <Badge variant="secondary">{group.entries.length}</Badge>
      </summary>
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">{messages.fieldName}</TableHead>
              <TableHead>{messages.fieldValue}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.entries.map((entry) => (
              <TableRow key={entry.key}>
                <TableCell className="font-mono text-xs whitespace-normal">
                  {entry.key}
                </TableCell>
                <TableCell className="font-mono text-xs break-words whitespace-normal">
                  {entry.displayValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </details>
  )
}

export { MetadataResults }
