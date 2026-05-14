import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
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
import { Separator } from "@workspace/ui/components/ui/separator"
import { FileJson2, Lock, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { formatBytes } from "./validation"

import type { AesDecryptorMessages, ParsedEnvelopeState } from "./types"

function EnvelopeCard({
  canDecrypt,
  messages,
  parsedEnvelope,
  onDecrypt,
  onReset,
}: Readonly<{
  canDecrypt: boolean
  messages: AesDecryptorMessages
  parsedEnvelope: ParsedEnvelopeState
  onDecrypt: () => void
  onReset: () => void
}>) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.envelopeCardTitle}</CardTitle>
        <CardDescription>{messages.envelopeCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        {parsedEnvelope.status === "valid" ? (
          <EnvelopeDetails messages={messages} state={parsedEnvelope} />
        ) : parsedEnvelope.status === "invalid" ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidEnvelopeTitle}</AlertTitle>
            <AlertDescription>{parsedEnvelope.error}</AlertDescription>
          </Alert>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileJson2 />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyEnvelopeTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyEnvelopeDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!canDecrypt}
          onClick={onDecrypt}
        >
          <Lock data-icon="inline-start" />
          {messages.decryptLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function EnvelopeDetails({
  messages,
  state,
}: Readonly<{
  messages: AesDecryptorMessages
  state: Extract<ParsedEnvelopeState, { status: "valid" }>
}>) {
  const { envelope } = state
  const plaintext =
    envelope.plaintext.type === "file"
      ? messages.filePlaintextLabel
      : messages.textPlaintextLabel

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{envelope.algorithm}</Badge>
        <Badge variant="outline">{`${envelope.key.lengthBits}-bit`}</Badge>
        <Badge variant="outline">
          {envelope.key.source === "password"
            ? messages.passwordSourceLabel
            : messages.rawKeySourceLabel}
        </Badge>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <Detail label={messages.modeLabel} value={envelope.algorithm} />
        <Detail
          label={messages.keyLengthLabel}
          value={`${envelope.key.lengthBits}-bit`}
        />
        <Detail
          label={messages.keySourceLabel}
          value={
            envelope.key.source === "password"
              ? messages.passwordSourceLabel
              : messages.rawKeySourceLabel
          }
        />
        <Detail label={messages.plaintextTypeLabel} value={plaintext} />
      </dl>

      {envelope.key.source === "password" ? (
        <>
          <Separator />
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail
              label={messages.pbkdf2HashLabel}
              value={envelope.key.hash}
            />
            <Detail
              label={messages.pbkdf2IterationsLabel}
              value={envelope.key.iterations.toLocaleString()}
            />
          </dl>
        </>
      ) : null}

      {envelope.plaintext.type === "file" ? (
        <>
          <Separator />
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail
              label={messages.fileNameLabel}
              value={envelope.plaintext.name}
            />
            <Detail
              label={messages.fileSizeLabel}
              value={formatBytes(envelope.plaintext.size)}
            />
          </dl>
        </>
      ) : null}
    </div>
  )
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string
  value: string
}>) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  )
}

export { EnvelopeCard }
