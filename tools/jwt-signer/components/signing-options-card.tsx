import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Lock, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import {
  JWT_ALGORITHMS,
  isHmacAlgorithm,
  isJwtAlgorithm,
} from "../core/jwt-signer"

import type {
  AlgorithmOption,
  JwtSignerMessages,
  KeyFormatOption,
} from "../client/types"
import type { JwtAlgorithm, JwtKeyFormat } from "../core/jwt-signer"

type SigningOptionsCardProps = Readonly<{
  messages: JwtSignerMessages
  algorithm: JwtAlgorithm
  keyFormat: JwtKeyFormat
  signingKey: string
  algorithmId: string
  keyFormatId: string
  keyId: string
  canSign: boolean
  isSigning: boolean
  onAlgorithmChange: (value: JwtAlgorithm) => void
  onKeyFormatChange: (value: JwtKeyFormat) => void
  onKeyChange: (value: string) => void
  onLoadSample: () => void
  onReset: () => void
  onSign: () => void
}>

function SigningOptionsCard({
  messages,
  algorithm,
  keyFormat,
  signingKey,
  algorithmId,
  keyFormatId,
  keyId,
  canSign,
  isSigning,
  onAlgorithmChange,
  onKeyFormatChange,
  onKeyChange,
  onLoadSample,
  onReset,
  onSign,
}: SigningOptionsCardProps) {
  const keyFormatOptions = createKeyFormatOptions(messages, algorithm)
  const isHmac = isHmacAlgorithm(algorithm)
  const keyLabel =
    keyFormat === "jwk"
      ? messages.keyLabelJwk
      : isHmac
        ? messages.keyLabelSecret
        : messages.keyLabelPrivate
  const keyDescription =
    keyFormat === "jwk"
      ? messages.keyDescriptionJwk
      : isHmac
        ? messages.keyDescriptionSecret
        : messages.keyDescriptionPrivate
  const keyPlaceholder =
    keyFormat === "jwk"
      ? messages.keyPlaceholderJwk
      : isHmac
        ? messages.keyPlaceholderSecret
        : messages.keyPlaceholderPem

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsCardTitle}</CardTitle>
        <CardDescription>{messages.optionsCardDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={algorithmId}>
              {messages.algorithmLabel}
            </FieldLabel>
            <Select
              value={algorithm}
              onValueChange={(value) => {
                if (isJwtAlgorithm(value)) onAlgorithmChange(value)
              }}
            >
              <SelectTrigger id={algorithmId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {createAlgorithmOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              {isHmac ? messages.hmacNote : messages.privateKeyNote}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={keyFormatId}>
              {messages.keyFormatLabel}
            </FieldLabel>
            <Select
              value={keyFormat}
              onValueChange={(value) => {
                if (isKeyFormat(value)) onKeyFormatChange(value)
              }}
            >
              <SelectTrigger id={keyFormatId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {keyFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={keyId}>{keyLabel}</FieldLabel>
            {isHmac && keyFormat === "secret" ? (
              <Input
                id={keyId}
                type="password"
                value={signingKey}
                autoComplete="new-password"
                spellCheck={false}
                placeholder={keyPlaceholder}
                onChange={(event) => {
                  onKeyChange(event.target.value)
                }}
              />
            ) : (
              <Textarea
                id={keyId}
                value={signingKey}
                spellCheck={false}
                autoCapitalize="none"
                className="min-h-44 font-mono text-sm"
                placeholder={keyPlaceholder}
                onChange={(event) => {
                  onKeyChange(event.target.value)
                }}
              />
            )}
            <FieldDescription>{keyDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-col gap-2 border-t sm:flex-row sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLoadSample}
          >
            <Sparkles data-icon="inline-start" />
            {messages.loadSampleButton}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetButton}
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          disabled={!canSign || isSigning}
          onClick={onSign}
        >
          {isSigning ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Lock data-icon="inline-start" />
          )}
          {isSigning ? messages.signingButton : messages.signButton}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

function createAlgorithmOptions(): AlgorithmOption[] {
  return JWT_ALGORITHMS.map((algorithm) => ({
    value: algorithm,
    label: algorithm,
  }))
}

function createKeyFormatOptions(
  messages: JwtSignerMessages,
  algorithm: JwtAlgorithm
): KeyFormatOption[] {
  if (isHmacAlgorithm(algorithm)) {
    return [
      { value: "secret", label: messages.keyFormatSecret },
      { value: "jwk", label: messages.keyFormatJwk },
    ]
  }

  return [
    { value: "pem", label: messages.keyFormatPem },
    { value: "jwk", label: messages.keyFormatJwk },
  ]
}

function isKeyFormat(value: string): value is JwtKeyFormat {
  return value === "secret" || value === "pem" || value === "jwk"
}

export { SigningOptionsCard, createKeyFormatOptions }
