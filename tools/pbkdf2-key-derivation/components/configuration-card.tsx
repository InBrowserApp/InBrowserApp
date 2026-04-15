import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
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

import {
  PBKDF2_ALGORITHM_OPTIONS,
  SALT_FORMAT_OPTIONS,
} from "../client/constants"
import type { Pbkdf2KeyDerivationPageMessages } from "../client/types"
import type { Pbkdf2Algorithm, SaltFormat } from "../core/pbkdf2"

type ConfigurationCardProps = Readonly<{
  passwordId: string
  iterationsId: string
  lengthId: string
  password: string
  algorithm: Pbkdf2Algorithm
  saltFormat: SaltFormat
  iterationsInput: string
  lengthInput: string
  iterationsValid: boolean
  lengthValid: boolean
  messages: Pbkdf2KeyDerivationPageMessages
  onPasswordChange: (value: string) => void
  onAlgorithmChange: (value: Pbkdf2Algorithm) => void
  onSaltFormatChange: (value: SaltFormat) => void
  onIterationsChange: (value: string) => void
  onLengthChange: (value: string) => void
}>

function ConfigurationCard({
  passwordId,
  iterationsId,
  lengthId,
  password,
  algorithm,
  saltFormat,
  iterationsInput,
  lengthInput,
  iterationsValid,
  lengthValid,
  messages,
  onPasswordChange,
  onAlgorithmChange,
  onSaltFormatChange,
  onIterationsChange,
  onLengthChange,
}: ConfigurationCardProps) {
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
          <FieldLabel>{messages.algorithmLabel}</FieldLabel>
          <Select
            value={algorithm}
            onValueChange={(value) => {
              onAlgorithmChange(value as Pbkdf2Algorithm)
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label={messages.algorithmLabel}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{messages.algorithmLabel}</SelectLabel>
                {PBKDF2_ALGORITHM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

        <Field className="grid gap-2" data-invalid={!iterationsValid}>
          <FieldLabel htmlFor={iterationsId}>
            {messages.iterationsLabel}
          </FieldLabel>
          <Input
            id={iterationsId}
            type="number"
            inputMode="numeric"
            min={1}
            max={1_000_000}
            step={1}
            value={iterationsInput}
            onChange={(event) => {
              onIterationsChange(event.target.value)
            }}
          />
          {iterationsValid ? null : (
            <FieldError>{messages.iterationsInvalidMessage}</FieldError>
          )}
        </Field>

        <Field className="grid gap-2 sm:col-span-2" data-invalid={!lengthValid}>
          <FieldLabel htmlFor={lengthId}>{messages.lengthLabel}</FieldLabel>
          <Input
            id={lengthId}
            type="number"
            inputMode="numeric"
            min={16}
            max={256}
            step={1}
            value={lengthInput}
            onChange={(event) => {
              onLengthChange(event.target.value)
            }}
          />
          {lengthValid ? null : (
            <FieldError>{messages.lengthInvalidMessage}</FieldError>
          )}
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
