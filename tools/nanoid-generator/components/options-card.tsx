import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
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
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  NANOID_MAX_COUNT,
  NANOID_MAX_LENGTH,
  type NanoidAlphabetPreset,
} from "../core/nanoid"
import type { NanoidMessages } from "../types"

type AlphabetMetrics = Readonly<{
  uniqueCount: number
  duplicates: readonly string[]
}>

type NanoidOptionsCardProps = Readonly<{
  messages: NanoidMessages
  countId: string
  lengthId: string
  customAlphabetId: string
  count: number
  length: number
  alphabetPreset: NanoidAlphabetPreset
  customAlphabet: string
  alphabetMetrics: AlphabetMetrics
  alphabetError: string
  presetOptions: readonly NanoidAlphabetPreset[]
  onCountChange: (value: string) => void
  onLengthChange: (value: string) => void
  onAlphabetPresetChange: (value: string) => void
  onCustomAlphabetChange: (value: string) => void
}>

function getPresetLabel(
  preset: NanoidAlphabetPreset,
  messages: NanoidMessages
) {
  switch (preset) {
    case "url-safe":
      return messages.presetUrlSafe
    case "alphanumeric":
      return messages.presetAlphanumeric
    case "lowercase":
      return messages.presetLowercase
    case "uppercase":
      return messages.presetUppercase
    case "numbers":
      return messages.presetNumbers
    case "hex-lowercase":
      return messages.presetHexLowercase
    case "hex-uppercase":
      return messages.presetHexUppercase
    case "custom":
      return messages.presetCustom
  }
}

function NanoidOptionsCard({
  messages,
  countId,
  lengthId,
  customAlphabetId,
  count,
  length,
  alphabetPreset,
  customAlphabet,
  alphabetMetrics,
  alphabetError,
  presetOptions,
  onCountChange,
  onLengthChange,
  onAlphabetPresetChange,
  onCustomAlphabetChange,
}: NanoidOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              min={1}
              max={NANOID_MAX_COUNT}
              value={count}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={lengthId}>{messages.lengthLabel}</FieldLabel>
            <Input
              id={lengthId}
              type="number"
              inputMode="numeric"
              min={1}
              max={NANOID_MAX_LENGTH}
              value={length}
              onChange={(event) => {
                onLengthChange(event.target.value)
              }}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>{messages.alphabetPresetLabel}</FieldLabel>
          <Select
            value={alphabetPreset}
            onValueChange={(value) => {
              onAlphabetPresetChange(value)
            }}
          >
            <SelectTrigger
              aria-label={messages.alphabetPresetLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {presetOptions.map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {getPresetLabel(preset, messages)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {alphabetPreset === "custom" ? (
          <Field>
            <FieldLabel htmlFor={customAlphabetId}>
              {messages.customAlphabetLabel}
            </FieldLabel>
            <Input
              id={customAlphabetId}
              value={customAlphabet}
              onChange={(event) => {
                onCustomAlphabetChange(event.target.value)
              }}
              placeholder={messages.customAlphabetPlaceholder}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </Field>
        ) : null}

        {alphabetPreset === "custom" ? (
          <div className="grid gap-4 rounded-xl border border-dashed border-border/80 bg-muted/30 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {messages.alphabetUniqueLabel}
              </p>
              <p className="font-mono text-2xl leading-none">
                {alphabetMetrics.uniqueCount}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {messages.alphabetDuplicatesLabel}
              </p>
              <p className="font-mono text-sm leading-6 break-all">
                {alphabetMetrics.duplicates.length > 0
                  ? alphabetMetrics.duplicates.join(" ")
                  : messages.alphabetNoDuplicatesLabel}
              </p>
            </div>
          </div>
        ) : null}

        {alphabetError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{alphabetError}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { NanoidOptionsCard }
