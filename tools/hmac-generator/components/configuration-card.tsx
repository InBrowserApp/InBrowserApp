import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
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

import { HMAC_ALGORITHM_OPTIONS } from "../client/constants"
import type { HmacGeneratorPageMessages } from "../client/types"
import type { HmacAlgorithm } from "../core/hmac"

type ConfigurationCardProps = Readonly<{
  secretKeyId: string
  secretKey: string
  algorithm: HmacAlgorithm
  messages: HmacGeneratorPageMessages
  onSecretKeyChange: (value: string) => void
  onAlgorithmChange: (value: HmacAlgorithm) => void
}>

function ConfigurationCard({
  secretKeyId,
  secretKey,
  algorithm,
  messages,
  onSecretKeyChange,
  onAlgorithmChange,
}: ConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.configurationLabel}</CardTitle>
        <CardDescription>{messages.configurationDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field className="grid gap-2">
          <FieldLabel htmlFor={secretKeyId}>
            {messages.secretKeyLabel}
          </FieldLabel>
          <Input
            id={secretKeyId}
            type="password"
            value={secretKey}
            placeholder={messages.secretKeyPlaceholder}
            autoComplete="off"
            onChange={(event) => {
              onSecretKeyChange(event.target.value)
            }}
          />
        </Field>

        <Field className="grid gap-2">
          <FieldLabel>{messages.algorithmLabel}</FieldLabel>
          <Select
            value={algorithm}
            onValueChange={(value) => {
              onAlgorithmChange(value as HmacAlgorithm)
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
                {HMAC_ALGORITHM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  )
}

export { ConfigurationCard }
