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
  LoaderCircle,
  Lock,
  TriangleAlert,
} from "@workspace/ui/icons"

import { useTextDownloadUrl } from "../client/use-text-download-url"
import type {
  KeyGenerationState,
  SshKeyGeneratorMessages,
} from "../client/types"
import type { SshKeyPair } from "../core/ssh-keygen"

type KeyOutputCardProps = Readonly<{
  messages: SshKeyGeneratorMessages
  state: KeyGenerationState
}>

function KeyOutputCard({ messages, state }: KeyOutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="grid gap-1">
          <CardTitle>{messages.outputTitle}</CardTitle>
          <CardDescription>{messages.outputDescription}</CardDescription>
        </div>
        {state.status === "ready" ? (
          <CardAction>
            <Badge variant="secondary">
              {messages.generatedSummary.replace(
                "{algorithm}",
                state.result.algorithm === "ed25519"
                  ? messages.algorithmEd25519
                  : messages.algorithmRsa
              )}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <ToolPanelCardContent
        aria-busy={state.status === "loading"}
        aria-live="polite"
      >
        <KeyOutputContent messages={messages} state={state} />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

function KeyOutputContent({
  messages,
  state,
}: Readonly<{
  messages: SshKeyGeneratorMessages
  state: KeyGenerationState
}>) {
  if (state.status === "idle" || state.status === "loading") {
    return (
      <Empty className="min-h-80 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {state.status === "loading" ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Lock />
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

  return <ReadyKeyOutput messages={messages} result={state.result} />
}

function ReadyKeyOutput({
  messages,
  result,
}: Readonly<{
  messages: SshKeyGeneratorMessages
  result: SshKeyPair
}>) {
  const publicDownloadUrl = useTextDownloadUrl(
    `${result.publicKey}\n`,
    "text/plain"
  )
  const privateDownloadUrl = useTextDownloadUrl(
    result.privateKey,
    "application/x-pem-file"
  )

  return (
    <section className="grid gap-5" aria-label={messages.keyDetailsLabel}>
      <Alert>
        <Lock />
        <AlertTitle>{messages.privateKeyWarningTitle}</AlertTitle>
        <AlertDescription>
          {messages.privateKeyWarningDescription}
        </AlertDescription>
      </Alert>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <KeyDetail label={messages.keyTypeLabel} value={result.keyType} />
        <KeyDetail
          label={messages.keySizeLabel}
          value={`${result.bits} ${messages.bitsLabel}`}
        />
        <KeyDetail
          label={messages.commentValueLabel}
          value={result.comment || messages.noCommentLabel}
        />
        <KeyDetail
          label={messages.fingerprintLabel}
          value={result.fingerprintSha256}
          copyLabel={messages.copyFingerprintLabel}
          copiedLabel={messages.copiedLabel}
        />
      </dl>

      <KeyMaterialSection
        title={messages.publicKeyTitle}
        description={messages.publicKeyDescription}
        value={result.publicKey}
        copyLabel={messages.copyPublicKeyLabel}
        copiedLabel={messages.copiedLabel}
        downloadLabel={messages.downloadPublicKeyLabel}
        downloadName="id_ssh_generated.pub"
        downloadUrl={publicDownloadUrl}
      />

      <KeyMaterialSection
        title={messages.privateKeyTitle}
        description={messages.privateKeyDescription}
        value={result.privateKey}
        copyLabel={messages.copyPrivateKeyLabel}
        copiedLabel={messages.copiedLabel}
        downloadLabel={messages.downloadPrivateKeyLabel}
        downloadName="id_ssh_generated"
        downloadUrl={privateDownloadUrl}
        minRows={12}
      />
    </section>
  )
}

function KeyDetail({
  copiedLabel,
  copyLabel,
  label,
  value,
}: Readonly<{
  copiedLabel?: string
  copyLabel?: string
  label: string
  value: string
}>) {
  return (
    <div className="min-w-0 rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </dt>
        {copyLabel && copiedLabel ? (
          <ToolCopyButton
            value={value}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            variant="ghost"
          />
        ) : null}
      </div>
      <dd className="mt-1 font-mono text-sm break-all">{value}</dd>
    </div>
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

export { KeyOutputCard }
