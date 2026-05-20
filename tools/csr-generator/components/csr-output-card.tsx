import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Download,
  FileText,
  LoaderCircle,
  Lock,
  TriangleAlert,
} from "@workspace/ui/icons"

import { useTextDownloadUrl } from "../client/use-text-download-url"
import type { CsrGenerationState, CsrGeneratorMessages } from "../client/types"
import type { CsrResult } from "../core/csr"

type CsrOutputCardProps = Readonly<{
  messages: CsrGeneratorMessages
  state: CsrGenerationState
}>

function CsrOutputCard({ messages, state }: CsrOutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.outputTitle}</CardTitle>
          <CardDescription>{messages.outputDescription}</CardDescription>
        </div>
        {state.status === "ready" ? (
          <CardAction>
            <Badge variant="secondary">{state.result.keyAlgorithmLabel}</Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <ToolPanelCardContent
        className="py-4"
        aria-busy={state.status === "loading"}
        aria-live="polite"
      >
        <CsrOutputContent messages={messages} state={state} />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function CsrOutputContent({
  messages,
  state,
}: Readonly<{
  messages: CsrGeneratorMessages
  state: CsrGenerationState
}>) {
  if (state.status === "idle" || state.status === "loading") {
    return (
      <Empty className="min-h-80 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {state.status === "loading" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <FileText />
            )}
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

  return <CsrReadyOutput messages={messages} result={state.result} />
}

function CsrReadyOutput({
  messages,
  result,
}: Readonly<{
  messages: CsrGeneratorMessages
  result: CsrResult
}>) {
  const csrDownloadUrl = useTextDownloadUrl(result.csrPem, "application/pkcs10")
  const privateKeyDownloadUrl = useTextDownloadUrl(
    result.privateKeyPem ?? "",
    "application/x-pem-file"
  )

  return (
    <section className="grid gap-5">
      <KeyMaterialSection
        title={messages.csrTitle}
        description={messages.csrDescription}
        value={result.csrPem}
        copyLabel={messages.copyCsrLabel}
        copiedLabel={messages.copiedLabel}
        downloadLabel={messages.downloadCsrLabel}
        downloadName="request.csr"
        downloadUrl={csrDownloadUrl}
        minRows={10}
      />

      {result.privateKeyPem ? (
        <>
          <Alert>
            <Lock />
            <AlertTitle>{messages.privateKeyWarningTitle}</AlertTitle>
            <AlertDescription>
              {messages.privateKeyWarningDescription}
            </AlertDescription>
          </Alert>
          <KeyMaterialSection
            title={messages.privateKeyTitle}
            description={messages.privateKeyDescription}
            value={result.privateKeyPem}
            copyLabel={messages.copyPrivateKeyLabel}
            copiedLabel={messages.copiedLabel}
            downloadLabel={messages.downloadPrivateKeyLabel}
            downloadName="private-key.pem"
            downloadUrl={privateKeyDownloadUrl}
            minRows={10}
          />
        </>
      ) : null}
    </section>
  )
}

function KeyMaterialSection({
  copiedLabel,
  copyLabel,
  description,
  downloadLabel,
  downloadName,
  downloadUrl,
  minRows = 4,
  title,
  value,
}: Readonly<{
  copiedLabel: string
  copyLabel: string
  description: string
  downloadLabel: string
  downloadName: string
  downloadUrl: string | null
  minRows?: number
  title: string
  value: string
}>) {
  return (
    <section className="grid gap-3 rounded-lg border bg-muted/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={value}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            variant="ghost"
          />
          {downloadUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={downloadUrl} download={downloadName}>
                <Download data-icon="inline-start" />
                {downloadLabel}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <Textarea
        readOnly
        dir="ltr"
        translate="no"
        spellCheck={false}
        value={value}
        rows={minRows}
        aria-label={title}
        className="[field-sizing:fixed] resize-y text-left font-mono text-xs"
      />
    </section>
  )
}

export { CsrOutputCard }
