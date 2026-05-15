import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Binary } from "@workspace/ui/icons"

import { CopyValue, DetailBadge, DetailItem } from "./detail-item"
import type { UuidDecodeResult } from "../core/uuid"

type UuidDecoderMessages = Readonly<{
  validTitle: string
  canonical: string
  normalizedUuid: string
  version: string
  variant: string
  format: string
  hex: string
  base64: string
  decimal: string
  octal: string
  binary: string
  timeDetails: string
  unixMilliseconds: string
  utcTime: string
  clockSequence: string
  nodeIdentifier: string
  nodeSourceMac: string
  nodeSourceRandom: string
  algorithm: string
  copyLabel: string
  copiedLabel: string
  versionLabels: Record<string, string>
  variantLabels: Record<string, string>
  algorithmLabels: Record<string, string>
}>

type DecodeSuccess = Extract<UuidDecodeResult, { ok: true }>

function getVersionText(result: DecodeSuccess) {
  return `${result.version} (${result.versionKind})`
}

function getLocalizedValue(
  labels: Record<string, string>,
  key: string,
  fallback: string
) {
  return labels[key] ?? fallback
}

function ResultSummary({
  result,
  messages,
}: Readonly<{ result: DecodeSuccess; messages: UuidDecoderMessages }>) {
  const versionText = getLocalizedValue(
    messages.versionLabels,
    result.versionKind,
    getVersionText(result)
  )
  const variantText = getLocalizedValue(
    messages.variantLabels,
    result.variantKind,
    String(result.variant)
  )

  return (
    <dl className="grid gap-4 lg:grid-cols-2">
      <DetailItem label={messages.normalizedUuid} className="lg:col-span-2">
        <CopyValue
          value={result.uuid}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
        />
      </DetailItem>
      <DetailItem label={messages.version}>
        <div className="flex flex-wrap items-center gap-2">
          <DetailBadge>{result.version}</DetailBadge>
          <span>{versionText}</span>
        </div>
      </DetailItem>
      <DetailItem label={messages.variant}>
        <div className="flex flex-wrap items-center gap-2">
          <DetailBadge>{result.variant}</DetailBadge>
          <span>{variantText}</span>
        </div>
      </DetailItem>
      {result.algorithm ? (
        <DetailItem label={messages.algorithm}>
          {getLocalizedValue(
            messages.algorithmLabels,
            result.algorithm,
            result.algorithm.toUpperCase()
          )}
        </DetailItem>
      ) : null}
    </dl>
  )
}

function TimeDetails({
  result,
  messages,
}: Readonly<{ result: DecodeSuccess; messages: UuidDecoderMessages }>) {
  if (!result.timestamp && result.clockSequence === null && !result.node) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{messages.timeDetails}</h3>
      <dl className="grid gap-4 lg:grid-cols-2">
        {result.timestamp ? (
          <>
            <DetailItem label={messages.unixMilliseconds}>
              <CopyValue
                value={String(result.timestamp.unixMilliseconds)}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
            </DetailItem>
            <DetailItem label={messages.utcTime}>
              <CopyValue
                value={result.timestamp.utcIso}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
            </DetailItem>
          </>
        ) : null}
        {result.clockSequence !== null ? (
          <DetailItem label={messages.clockSequence}>
            <CopyValue
              value={String(result.clockSequence)}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
            />
          </DetailItem>
        ) : null}
        {result.node ? (
          <DetailItem label={messages.nodeIdentifier}>
            <div className="flex flex-col gap-2">
              <CopyValue
                value={result.node.value}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
              />
              <span className="text-xs text-muted-foreground">
                {result.node.isMulticast
                  ? messages.nodeSourceRandom
                  : messages.nodeSourceMac}
              </span>
            </div>
          </DetailItem>
        ) : null}
      </dl>
    </section>
  )
}

function FormatDetails({
  result,
  messages,
}: Readonly<{ result: DecodeSuccess; messages: UuidDecoderMessages }>) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{messages.format}</h3>
      <dl className="grid gap-4 lg:grid-cols-2">
        <DetailItem label={messages.hex}>
          <CopyValue
            value={result.hex}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
          />
        </DetailItem>
        <DetailItem label={messages.base64}>
          <CopyValue
            value={result.base64}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
          />
        </DetailItem>
        <DetailItem label={messages.decimal}>
          <CopyValue
            value={result.decimal}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            compact
          />
        </DetailItem>
        <DetailItem label={messages.octal}>
          <CopyValue
            value={result.octal}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            compact
          />
        </DetailItem>
        <DetailItem label={messages.binary} className="lg:col-span-2">
          <CopyValue
            value={result.binary}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            compact
          />
        </DetailItem>
      </dl>
    </section>
  )
}

function DecodeSuccessPanel({
  result,
  messages,
}: Readonly<{ result: DecodeSuccess; messages: UuidDecoderMessages }>) {
  return (
    <>
      <div aria-live="polite">
        <Alert>
          <Binary />
          <AlertTitle>{messages.validTitle}</AlertTitle>
          <AlertDescription>{messages.canonical}</AlertDescription>
        </Alert>
      </div>
      <ResultSummary result={result} messages={messages} />
      <TimeDetails result={result} messages={messages} />
      <FormatDetails result={result} messages={messages} />
    </>
  )
}

function CanonicalCopyFooter({
  result,
  messages,
}: Readonly<{ result: DecodeSuccess; messages: UuidDecoderMessages }>) {
  return (
    <ToolCopyButton
      value={result.uuid}
      copyLabel={messages.copyLabel}
      copiedLabel={messages.copiedLabel}
      variant="ghost"
    />
  )
}

export { CanonicalCopyFooter, DecodeSuccessPanel }
