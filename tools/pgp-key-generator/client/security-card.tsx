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
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { LoaderCircle, Lock, RefreshCcw } from "@workspace/ui/icons"

import { MAX_EXPIRATION_DAYS } from "../core/pgp-keygen"
import { ToggleField } from "./toggle-field"
import type { KeyAlgorithm, RsaKeySize } from "../core/pgp-keygen"
import type { PgpKeyGeneratorMessages } from "./types"

type SecurityCardProps = Readonly<{
  algorithm: KeyAlgorithm
  canGenerate: boolean
  expirationDays: string
  expirationInvalid: boolean
  hasResult: boolean
  isGenerating: boolean
  messages: PgpKeyGeneratorMessages
  rsaKeySize: RsaKeySize
  expirationInputId: string
  onAlgorithmChange: (value: KeyAlgorithm) => void
  onExpirationDaysChange: (value: string) => void
  onReset: () => void
  onRsaKeySizeChange: (value: RsaKeySize) => void
}>

function SecurityCard({
  algorithm,
  canGenerate,
  expirationDays,
  expirationInputId,
  expirationInvalid,
  hasResult,
  isGenerating,
  messages,
  rsaKeySize,
  onAlgorithmChange,
  onExpirationDaysChange,
  onReset,
  onRsaKeySizeChange,
}: SecurityCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.securityTitle}</CardTitle>
        <CardDescription>{messages.securityDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldTitle>{messages.algorithmLabel}</FieldTitle>
            <ToggleField
              ariaLabel={messages.algorithmLabel}
              value={algorithm}
              onValueChange={onAlgorithmChange}
              options={[
                { value: "ecc", label: messages.eccLabel },
                { value: "rsa", label: messages.rsaLabel },
              ]}
            />
            <FieldDescription>
              {algorithm === "ecc"
                ? messages.eccDescription
                : messages.rsaDescription}
            </FieldDescription>
          </Field>

          {algorithm === "rsa" ? (
            <Field>
              <FieldTitle>{messages.rsaKeySizeLabel}</FieldTitle>
              <ToggleField
                ariaLabel={messages.rsaKeySizeLabel}
                value={String(rsaKeySize)}
                onValueChange={(nextValue) => {
                  onRsaKeySizeChange(Number(nextValue) as RsaKeySize)
                }}
                options={[
                  { value: "2048", label: "2048" },
                  { value: "3072", label: "3072" },
                  { value: "4096", label: "4096" },
                ]}
              />
            </Field>
          ) : null}

          <Field data-invalid={expirationInvalid}>
            <FieldLabel htmlFor={expirationInputId}>
              {messages.expirationDaysLabel}
            </FieldLabel>
            <Input
              id={expirationInputId}
              name="expiration-days"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_EXPIRATION_DAYS}
              step={1}
              value={expirationDays}
              aria-invalid={expirationInvalid}
              autoComplete="off"
              placeholder={messages.expirationDaysPlaceholder}
              onChange={(event) => onExpirationDaysChange(event.target.value)}
            />
            <FieldDescription>
              {messages.expirationDaysDescription}
            </FieldDescription>
            <FieldError>
              {expirationInvalid ? messages.expirationInvalidError : null}
            </FieldError>
          </Field>
        </FieldGroup>

        <Alert role="note">
          <Lock aria-hidden="true" />
          <AlertTitle>{messages.privacyNoteTitle}</AlertTitle>
          <AlertDescription>{messages.privacyNoteDescription}</AlertDescription>
        </Alert>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-between gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" aria-hidden="true" />
          {messages.resetLabel}
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!canGenerate}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <LoaderCircle
              data-icon="inline-start"
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : null}
          {isGenerating
            ? messages.generatingLabel
            : hasResult
              ? messages.regenerateLabel
              : messages.generateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { SecurityCard }
