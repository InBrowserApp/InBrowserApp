import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, FileText, Lock, TriangleAlert } from "@workspace/ui/icons"

import { useDownloadUrl } from "./use-download-url"
import type { CsrGeneratorMessages } from "./types"

type CsrGenerationResult = Readonly<{
  csrPem: string
  privateKeyPem?: string
  keyAlgorithmLabel: string
  subjectSummary: string
  sanSummary: string
  generatedAt: string
}>

type ResultCardProps = Readonly<{
  error: string
  isGenerating: boolean
  messages: CsrGeneratorMessages
  result: CsrGenerationResult | null
}>

function SummaryItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm break-words">{value}</dd>
    </div>
  )
}

function PemBlock({
  description,
  downloadFileName,
  mimeType,
  messages,
  title,
  value,
}: Readonly<{
  description: string
  downloadFileName: string
  mimeType: string
  messages: CsrGeneratorMessages
  title: string
  value: string
}>) {
  const downloadUrl = useDownloadUrl(value, mimeType)

  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="border-b bg-muted/30 p-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="p-4">
        <Textarea
          readOnly
          aria-label={title}
          value={value}
          className="min-h-56 resize-y font-mono text-xs"
        />
      </div>
      <div className="flex flex-wrap justify-end gap-3 border-t p-3">
        <ToolCopyButton
          value={value}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
        {downloadUrl ? (
          <Button asChild size="sm">
            <a href={downloadUrl} download={downloadFileName}>
              <Download data-icon="inline-start" aria-hidden="true" />
              {messages.downloadLabel}
            </a>
          </Button>
        ) : (
          <Button type="button" size="sm" disabled>
            <Download data-icon="inline-start" aria-hidden="true" />
            {messages.downloadLabel}
          </Button>
        )}
      </div>
    </section>
  )
}

function ResultCard({
  error,
  isGenerating,
  messages,
  result,
}: ResultCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultTitle}</CardTitle>
        <CardDescription>{messages.resultDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {error
            ? `${messages.errorTitle}: ${error}`
            : isGenerating
              ? messages.generatingLabel
              : result
                ? messages.resultDescription
                : messages.emptyTitle}
        </div>

        {error ? (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>{messages.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {result ? (
          <>
            <dl className="grid gap-3 sm:grid-cols-2">
              <SummaryItem
                label={messages.summaryAlgorithmLabel}
                value={result.keyAlgorithmLabel}
              />
              <SummaryItem
                label={messages.summaryGeneratedAtLabel}
                value={result.generatedAt}
              />
              <SummaryItem
                label={messages.summarySubjectLabel}
                value={result.subjectSummary}
              />
              <SummaryItem
                label={messages.summarySanLabel}
                value={result.sanSummary}
              />
            </dl>

            <PemBlock
              title={messages.csrTitle}
              description={messages.csrDescription}
              value={result.csrPem}
              downloadFileName="certificate-request.csr"
              mimeType="application/pkcs10"
              messages={messages}
            />

            {result.privateKeyPem ? (
              <PemBlock
                title={messages.privateKeyTitle}
                description={messages.privateKeyOutputDescription}
                value={result.privateKeyPem}
                downloadFileName="private-key.pem"
                mimeType="application/x-pem-file"
                messages={messages}
              />
            ) : (
              <Alert role="note">
                <Lock aria-hidden="true" />
                <AlertTitle>{messages.privateKeyTitle}</AlertTitle>
                <AlertDescription>{messages.importedKeyNote}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>
                {isGenerating ? messages.generatingLabel : messages.emptyTitle}
              </EmptyTitle>
              <EmptyDescription>
                {isGenerating
                  ? messages.resultDescription
                  : messages.emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ResultCard }
export type { CsrGenerationResult }
