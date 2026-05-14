import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Separator } from "@workspace/ui/components/ui/separator"

import type { CertificatePublicKeyParserMessages } from "../client/types"
import type {
  CertificateEntry,
  ParsedCertificateEntry,
  PublicKeyEntry,
} from "../core/types"

type DetailValue = string | number | readonly string[] | undefined

function ParsedEntrySection({
  entry,
  messages,
}: Readonly<{
  entry: ParsedCertificateEntry
  messages: CertificatePublicKeyParserMessages
}>) {
  const typeLabel =
    entry.type === "certificate"
      ? messages.certificateTypeLabel
      : messages.publicKeyTypeLabel

  return (
    <section
      aria-label={entry.label}
      className="grid gap-4 rounded-lg border bg-muted/20 p-4"
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h3 className="min-w-0 text-sm font-medium">{entry.label}</h3>
        <Badge variant="secondary" className="max-w-full truncate">
          {typeLabel}
        </Badge>
      </div>

      {entry.type === "certificate" ? (
        <CertificateDetails entry={entry} messages={messages} />
      ) : (
        <PublicKeyDetails entry={entry} messages={messages} />
      )}
    </section>
  )
}

function CertificateDetails({
  entry,
  messages,
}: Readonly<{
  entry: CertificateEntry
  messages: CertificatePublicKeyParserMessages
}>) {
  const overviewFields = [
    [messages.subjectLabel, entry.subject],
    [messages.issuerLabel, entry.issuer],
    [messages.serialNumberLabel, entry.serialNumber],
    [messages.notBeforeLabel, entry.notBefore],
    [messages.notAfterLabel, entry.notAfter],
    [messages.signatureAlgorithmLabel, entry.signatureAlgorithm],
    [messages.publicKeyAlgorithmLabel, entry.publicKeyAlgorithm],
    [messages.keySizeLabel, entry.publicKeySize],
    [messages.curveLabel, entry.publicKeyCurve],
  ] as const

  return (
    <div className="grid gap-4">
      <DetailGrid fields={overviewFields} messages={messages} />
      <FingerprintDetails entry={entry} messages={messages} />
      <ExtensionDetails entry={entry} messages={messages} />
    </div>
  )
}

function PublicKeyDetails({
  entry,
  messages,
}: Readonly<{
  entry: PublicKeyEntry
  messages: CertificatePublicKeyParserMessages
}>) {
  const fields = [
    [messages.publicKeyAlgorithmLabel, entry.algorithm],
    [messages.keySizeLabel, entry.keySize],
    [messages.curveLabel, entry.curve],
  ] as const

  return (
    <div className="grid gap-4">
      <DetailGrid fields={fields} messages={messages} />
      <FingerprintDetails entry={entry} messages={messages} />
    </div>
  )
}

function FingerprintDetails({
  entry,
  messages,
}: Readonly<{
  entry: ParsedCertificateEntry
  messages: CertificatePublicKeyParserMessages
}>) {
  return (
    <section className="grid gap-3 rounded-lg border bg-background p-3">
      <h4 className="text-xs font-medium text-muted-foreground">
        {messages.fingerprintsTitle}
      </h4>
      <div className="grid gap-3">
        <CopyableValue
          label={messages.sha256FingerprintLabel}
          value={entry.fingerprints.sha256}
          messages={messages}
        />
        <CopyableValue
          label={messages.sha1FingerprintLabel}
          value={entry.fingerprints.sha1}
          messages={messages}
        />
      </div>
    </section>
  )
}

function ExtensionDetails({
  entry,
  messages,
}: Readonly<{
  entry: CertificateEntry
  messages: CertificatePublicKeyParserMessages
}>) {
  const fields = [
    [
      messages.subjectAlternativeNamesLabel,
      entry.extensions.subjectAlternativeNames,
    ],
    [messages.keyUsageLabel, entry.extensions.keyUsage],
    [messages.extendedKeyUsageLabel, entry.extensions.extendedKeyUsage],
    [messages.basicConstraintsLabel, entry.extensions.basicConstraints],
    [messages.subjectKeyIdentifierLabel, entry.extensions.subjectKeyIdentifier],
    [
      messages.authorityKeyIdentifierLabel,
      entry.extensions.authorityKeyIdentifier,
    ],
  ] as const

  return (
    <section className="grid gap-3 rounded-lg border bg-background p-3">
      <h4 className="text-xs font-medium text-muted-foreground">
        {messages.extensionsTitle}
      </h4>
      <DetailGrid fields={fields} messages={messages} />
    </section>
  )
}

function DetailGrid({
  fields,
  messages,
}: Readonly<{
  fields: readonly (readonly [string, DetailValue])[]
  messages: CertificatePublicKeyParserMessages
}>) {
  return (
    <dl className="grid gap-2 text-sm sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <DetailItem
          key={label}
          label={label}
          value={value}
          messages={messages}
        />
      ))}
    </dl>
  )
}

function DetailItem({
  label,
  messages,
  value,
}: Readonly<{
  label: string
  messages: CertificatePublicKeyParserMessages
  value: DetailValue
}>) {
  return (
    <div className="min-w-0 rounded-lg bg-background p-3 ring-1 ring-border sm:bg-muted/20">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-foreground">
        {formatDetailValue(value, messages)}
      </dd>
    </div>
  )
}

function CopyableValue({
  label,
  messages,
  value,
}: Readonly<{
  label: string
  messages: CertificatePublicKeyParserMessages
  value: string
}>) {
  return (
    <section className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-xs font-medium text-muted-foreground">{label}</h5>
        <ToolCopyButton
          value={value}
          copyLabel={messages.copyLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
      </div>
      <Separator />
      <code
        dir="ltr"
        translate="no"
        className="block text-left text-xs leading-6 break-all sm:text-sm"
      >
        {value}
      </code>
    </section>
  )
}

function formatDetailValue(
  value: DetailValue,
  messages: CertificatePublicKeyParserMessages
) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : messages.notAvailable
  }

  if (typeof value === "number") {
    return `${value} ${messages.bitsLabel}`
  }

  if (typeof value === "string" && value.length > 0) {
    return value
  }

  return messages.notAvailable
}

export { ParsedEntrySection }
