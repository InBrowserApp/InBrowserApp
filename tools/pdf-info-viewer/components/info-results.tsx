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
import {
  Download,
  Eye,
  FileText,
  LoaderCircle,
  Lock,
} from "@workspace/ui/icons"

import { getMetadataFieldCount } from "../core/pdf-info"
import {
  formatMetric,
  getDocumentRows,
  getFileRows,
  getMetadataRows,
} from "./info-rows"
import type { PdfInfoViewerMessages } from "../client/types"
import type { PdfInfo } from "../core/pdf-info"
import type { DisplayRow, ResultRow } from "./info-rows"

type InfoResultsProps = Readonly<{
  info: PdfInfo | null
  isLoading: boolean
  jsonDownloadUrl: string | null
  jsonExport: string
  language: string
  messages: PdfInfoViewerMessages
}>

function InfoResults({
  info,
  isLoading,
  jsonDownloadUrl,
  jsonExport,
  language,
  messages,
}: InfoResultsProps) {
  if (isLoading) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircle className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>{messages.readingTitle}</EmptyTitle>
          <EmptyDescription>{messages.readingDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!info) {
    return (
      <Empty className="min-h-72 border border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye />
          </EmptyMedia>
          <EmptyTitle>{messages.noFileTitle}</EmptyTitle>
          <EmptyDescription>{messages.noFileDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const metadataFieldCount = getMetadataFieldCount(info.metadata)
  const fileRows = getFileRows(info, language, messages)
  const documentRows = getDocumentRows(info, messages)
  const metadataRows = getMetadataRows(info, language, messages)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-heading text-base font-medium">
            {messages.documentResults}
          </h2>
          <p className="text-sm text-muted-foreground">
            {messages.resultsDescription}
          </p>
        </div>
        <div className="grid gap-2 sm:min-w-72 sm:grid-cols-2">
          <ToolCopyButton
            value={jsonExport}
            copyLabel={messages.copyAsJson}
            copiedLabel={messages.copiedJson}
            className="w-full"
          />
          {jsonDownloadUrl ? (
            <Button asChild variant="outline" size="sm" className="w-full">
              <a download={`${info.file.name}.json`} href={jsonDownloadUrl}>
                <Download data-icon="inline-start" />
                {messages.downloadJson}
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <Metric
          label={messages.pageCount}
          value={formatMetric(info.document.pageCount, messages)}
        />
        <Metric
          label={messages.pdfVersion}
          value={info.document.version ?? messages.notAvailable}
        />
        <Metric
          label={messages.encryptionStatus}
          value={
            info.document.encrypted ? messages.encrypted : messages.notEncrypted
          }
        />
      </dl>

      {info.document.encrypted ? (
        <Empty className="min-h-44 border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>{messages.encryptedTitle}</EmptyTitle>
            <EmptyDescription>{messages.encryptedDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      <InfoSection
        messages={messages}
        rows={fileRows}
        title={messages.sectionFile}
      />
      <InfoSection
        messages={messages}
        rows={documentRows}
        title={messages.sectionDocument}
      />

      {metadataFieldCount > 0 ? (
        <InfoSection
          messages={messages}
          rows={metadataRows}
          title={messages.sectionMetadata}
        />
      ) : (
        <Empty className="min-h-44 border border-dashed bg-muted/30">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{messages.noMetadataTitle}</EmptyTitle>
            <EmptyDescription>
              {messages.noMetadataDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

function Metric({ label, value }: ResultRow) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 min-h-7 text-lg font-medium break-words">{value}</dd>
    </div>
  )
}

function InfoSection({
  messages,
  rows,
  title,
}: Readonly<{
  messages: PdfInfoViewerMessages
  rows: readonly DisplayRow[]
  title: string
}>) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h3 className="font-heading text-sm font-medium">{title}</h3>
        <Badge variant="secondary">{rows.length}</Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 sm:w-48">{messages.fieldName}</TableHead>
            <TableHead>{messages.fieldValue}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="align-top font-medium whitespace-normal">
                {row.label}
              </TableCell>
              <TableCell className="align-top break-words whitespace-normal">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export { InfoResults }
