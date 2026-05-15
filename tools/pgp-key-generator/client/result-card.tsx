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
import { Download, Lock, TriangleAlert } from "@workspace/ui/icons"

import { useDownloadUrl } from "./use-download-url"
import type { PgpKeyPair } from "../core/pgp-keygen"
import type { PgpKeyGeneratorMessages } from "./types"

type ResultCardProps = Readonly<{
  error: string
  isGenerating: boolean
  keyPair: PgpKeyPair | null
  messages: PgpKeyGeneratorMessages
  passphraseProtected: boolean
}>

function SummaryItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-sm break-all">{value}</dd>
    </div>
  )
}

function KeyBlock({
  description,
  downloadFileName,
  title,
  value,
  messages,
}: Readonly<{
  description: string
  downloadFileName: string
  title: string
  value: string
  messages: PgpKeyGeneratorMessages
}>) {
  const downloadUrl = useDownloadUrl(value, "application/pgp-keys")

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
          className="min-h-48 resize-y font-mono text-xs"
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
  keyPair,
  messages,
  passphraseProtected,
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
              : keyPair
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

        {keyPair ? (
          <>
            <dl className="grid gap-3 sm:grid-cols-2">
              <SummaryItem
                label={messages.summaryUserIdLabel}
                value={keyPair.userID}
              />
              <SummaryItem
                label={messages.summaryKeyIdLabel}
                value={keyPair.keyID}
              />
              <SummaryItem
                label={messages.summaryFingerprintLabel}
                value={keyPair.fingerprint}
              />
              <SummaryItem
                label={messages.summaryProtectionLabel}
                value={
                  passphraseProtected
                    ? messages.protectedLabel
                    : messages.unprotectedLabel
                }
              />
            </dl>

            <KeyBlock
              title={messages.publicKeyTitle}
              description={messages.publicKeyDescription}
              value={keyPair.publicKey}
              downloadFileName="openpgp-public-key.asc"
              messages={messages}
            />
            <KeyBlock
              title={messages.privateKeyTitle}
              description={messages.privateKeyDescription}
              value={keyPair.privateKey}
              downloadFileName="openpgp-private-key.asc"
              messages={messages}
            />
            <KeyBlock
              title={messages.revocationCertificateTitle}
              description={messages.revocationCertificateDescription}
              value={keyPair.revocationCertificate}
              downloadFileName="openpgp-revocation-certificate.asc"
              messages={messages}
            />
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Lock aria-hidden="true" />
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
