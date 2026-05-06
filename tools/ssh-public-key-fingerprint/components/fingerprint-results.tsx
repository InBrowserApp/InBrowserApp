import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { FileText, LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import type {
  FingerprintParseState,
  SshPublicKeyFingerprintPageMessages,
} from "../client/types"
import type { ParsedSshPublicKey } from "../core/parse"

type FingerprintResultsProps = Readonly<{
  messages: SshPublicKeyFingerprintPageMessages
  state: FingerprintParseState
}>

const DETAIL_FIELDS = [
  { key: "keyType", labelKey: "keyTypeLabel" },
  { key: "keySize", labelKey: "keySizeLabel" },
  { key: "curve", labelKey: "curveLabel" },
  { key: "comment", labelKey: "commentLabel" },
] as const satisfies ReadonlyArray<{
  key: keyof ParsedSshPublicKey
  labelKey: keyof SshPublicKeyFingerprintPageMessages
}>

function FingerprintResults({ messages, state }: FingerprintResultsProps) {
  if (state.status === "idle") {
    return (
      <Empty className="min-h-64 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>{messages.resultsEmptyTitle}</EmptyTitle>
          <EmptyDescription>
            {messages.resultsEmptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "loading") {
    return (
      <Empty className="min-h-64 border bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircle className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>{messages.resultsTitle}</EmptyTitle>
          <EmptyDescription>{messages.resultsDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (state.status === "error") {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>
          <strong>{messages.parseErrorTitle}</strong>
          <span className="block">{state.message}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {state.entries.map((entry, index) => (
        <KeyFingerprintSection
          key={`${entry.fingerprints.sha256}-${index}`}
          entry={entry}
          index={index}
          messages={messages}
        />
      ))}
    </div>
  )
}

function KeyFingerprintSection({
  entry,
  index,
  messages,
}: Readonly<{
  entry: ParsedSshPublicKey
  index: number
  messages: SshPublicKeyFingerprintPageMessages
}>) {
  return (
    <section
      aria-label={formatMessage(messages.keyLabel, index + 1)}
      className="grid gap-4 rounded-xl border bg-muted/20 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium">
          {formatMessage(messages.keyLabel, index + 1)}
        </h3>
        <Badge variant="secondary" className="max-w-full truncate">
          {entry.keyType}
        </Badge>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {DETAIL_FIELDS.map(({ key, labelKey }) => (
          <div key={key} className="min-w-0 rounded-lg bg-background p-3">
            <dt className="text-xs font-medium text-muted-foreground">
              {messages[labelKey]}
            </dt>
            <dd className="mt-1 break-all">
              {formatDetailValue(entry, key, messages)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3">
        <FingerprintValue
          label={messages.fingerprintSha256Label}
          value={entry.fingerprints.sha256}
          messages={messages}
        />
        <FingerprintValue
          label={messages.fingerprintMd5Label}
          value={entry.fingerprints.md5}
          messages={messages}
        />
      </div>
    </section>
  )
}

function FingerprintValue({
  label,
  messages,
  value,
}: Readonly<{
  label: string
  messages: SshPublicKeyFingerprintPageMessages
  value: string
}>) {
  return (
    <section className="grid gap-2 rounded-lg border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-medium text-muted-foreground">{label}</h4>
        <ToolCopyButton
          value={value}
          copyLabel={messages.copyResultLabel}
          copiedLabel={messages.copiedLabel}
          variant="ghost"
        />
      </div>
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
  entry: ParsedSshPublicKey,
  key: keyof ParsedSshPublicKey,
  messages: SshPublicKeyFingerprintPageMessages
) {
  const value = entry[key]

  if (typeof value === "number") {
    return `${value} ${messages.bitsLabel}`
  }

  if (typeof value === "string" && value.length > 0) {
    return value
  }

  return messages.missingValueLabel
}

function formatMessage(template: string, index: number) {
  return template.replace("{index}", String(index))
}

export { FingerprintResults }
