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
  FieldGroup,
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

import { ARGON2_OPTIONS } from "../client/constants"
import type { Argon2HashPasswordPageMessages } from "../client/types"
import type { Argon2Algorithm } from "../core/argon2"

type ConfigurationCardProps = Readonly<{
  passwordId: string
  secretId: string
  algorithm: Argon2Algorithm
  password: string
  secret: string
  messages: Argon2HashPasswordPageMessages
  onAlgorithmChange: (value: Argon2Algorithm) => void
  onPasswordChange: (value: string) => void
  onSecretChange: (value: string) => void
}>

function ConfigurationCard({
  passwordId,
  secretId,
  algorithm,
  password,
  secret,
  messages,
  onAlgorithmChange,
  onPasswordChange,
  onSecretChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field className="grid gap-2">
            <FieldLabel htmlFor={passwordId}>
              {messages.passwordLabel}
            </FieldLabel>
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
            <FieldLabel>{messages.algorithmLabel}</FieldLabel>
            <Select
              value={algorithm}
              onValueChange={(value) => {
                onAlgorithmChange(value as Argon2Algorithm)
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
                  {ARGON2_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field className="grid gap-2 sm:col-span-2">
            <FieldLabel htmlFor={secretId}>{messages.secretLabel}</FieldLabel>
            <Input
              id={secretId}
              name="secret"
              type="password"
              value={secret}
              placeholder={messages.secretPlaceholder}
              autoComplete="off"
              onChange={(event) => {
                onSecretChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.secretDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
