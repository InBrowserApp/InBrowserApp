import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import { SALT_FORMAT_OPTIONS } from "../client/constants"
import type { ScryptKeyDerivationPageMessages } from "../client/types"
import type { CostFactorValidation, SaltFormat } from "../core/scrypt"

type ConfigurationCardProps = Readonly<{
  passwordId: string
  costFactorId: string
  blockSizeId: string
  parallelismId: string
  lengthId: string
  password: string
  saltFormat: SaltFormat
  costFactorInput: string
  blockSizeInput: string
  parallelismInput: string
  lengthInput: string
  costFactorState: CostFactorValidation
  blockSizeValid: boolean
  parallelismValid: boolean
  lengthValid: boolean
  memoryEstimate: string
  messages: ScryptKeyDerivationPageMessages
  onPasswordChange: (value: string) => void
  onSaltFormatChange: (value: SaltFormat) => void
  onCostFactorChange: (value: string) => void
  onBlockSizeChange: (value: string) => void
  onParallelismChange: (value: string) => void
  onLengthChange: (value: string) => void
}>

function ConfigurationCard({
  passwordId,
  costFactorId,
  blockSizeId,
  parallelismId,
  lengthId,
  password,
  saltFormat,
  costFactorInput,
  blockSizeInput,
  parallelismInput,
  lengthInput,
  costFactorState,
  blockSizeValid,
  parallelismValid,
  lengthValid,
  memoryEstimate,
  messages,
  onPasswordChange,
  onSaltFormatChange,
  onCostFactorChange,
  onBlockSizeChange,
  onParallelismChange,
  onLengthChange,
}: ConfigurationCardProps) {
  const costFactorInvalidMessage = getCostFactorInvalidMessage(
    costFactorState.error,
    messages
  )

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field className="grid gap-2">
          <FieldLabel htmlFor={passwordId}>{messages.passwordLabel}</FieldLabel>
          <Input
            id={passwordId}
            name="password"
            type="password"
            value={password}
            placeholder={messages.passwordPlaceholder}
            autoComplete="off"
            onChange={(event) => {
              onPasswordChange(event.target.value)
            }}
          />
        </Field>

        <Field className="grid gap-2">
          <FieldLabel>{messages.saltFormatLabel}</FieldLabel>
          <Select
            value={saltFormat}
            onValueChange={(value) => {
              onSaltFormatChange(value as SaltFormat)
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label={messages.saltFormatLabel}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{messages.saltFormatLabel}</SelectLabel>
                {SALT_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field className="grid gap-2" data-invalid={!costFactorState.isValid}>
          <FieldLabel htmlFor={costFactorId}>
            {messages.costFactorLabel}
          </FieldLabel>
          <Input
            id={costFactorId}
            name="cost-factor"
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={2}
            max={524288}
            step={2}
            value={costFactorInput}
            aria-invalid={!costFactorState.isValid}
            onChange={(event) => {
              onCostFactorChange(event.target.value)
            }}
          />
          {costFactorInvalidMessage ? (
            <FieldError>{costFactorInvalidMessage}</FieldError>
          ) : null}
        </Field>

        <Field className="grid gap-2" data-invalid={!blockSizeValid}>
          <FieldLabel htmlFor={blockSizeId}>
            {messages.blockSizeLabel}
          </FieldLabel>
          <Input
            id={blockSizeId}
            name="block-size"
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={1}
            max={64}
            step={1}
            value={blockSizeInput}
            aria-invalid={!blockSizeValid}
            onChange={(event) => {
              onBlockSizeChange(event.target.value)
            }}
          />
          {blockSizeValid ? null : (
            <FieldError>{messages.blockSizeInvalidMessage}</FieldError>
          )}
        </Field>

        <Field className="grid gap-2" data-invalid={!parallelismValid}>
          <FieldLabel htmlFor={parallelismId}>
            {messages.parallelismLabel}
          </FieldLabel>
          <Input
            id={parallelismId}
            name="parallelism"
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={1}
            max={32}
            step={1}
            value={parallelismInput}
            aria-invalid={!parallelismValid}
            onChange={(event) => {
              onParallelismChange(event.target.value)
            }}
          />
          {parallelismValid ? null : (
            <FieldError>{messages.parallelismInvalidMessage}</FieldError>
          )}
        </Field>

        <Field className="grid gap-2" data-invalid={!lengthValid}>
          <FieldLabel htmlFor={lengthId}>{messages.lengthLabel}</FieldLabel>
          <Input
            id={lengthId}
            name="derived-length"
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={16}
            max={256}
            step={1}
            value={lengthInput}
            aria-invalid={!lengthValid}
            onChange={(event) => {
              onLengthChange(event.target.value)
            }}
          />
          {lengthValid ? null : (
            <FieldError>{messages.lengthInvalidMessage}</FieldError>
          )}
        </Field>

        <Field className="sm:col-span-2">
          <FieldDescription>
            {messages.memoryEstimateLabel}: {memoryEstimate}
          </FieldDescription>
        </Field>
      </CardContent>
    </Card>
  )
}

function getCostFactorInvalidMessage(
  error: CostFactorValidation["error"],
  messages: ScryptKeyDerivationPageMessages
) {
  if (error === "range") return messages.costFactorRangeInvalidMessage
  if (error === "power") return messages.costFactorPowerInvalidMessage
  if (error === "memory") return messages.costFactorMemoryInvalidMessage
  return ""
}

export { ConfigurationCard }
