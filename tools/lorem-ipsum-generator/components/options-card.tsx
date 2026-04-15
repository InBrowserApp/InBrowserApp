import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { LOREM_IPSUM_MAX_COUNT, LOREM_IPSUM_MIN_COUNT } from "../core/lorem"
import type { LoremIpsumLocale, LoremIpsumMode } from "../core/lorem"
import type { LoremIpsumMessages } from "../types"

type LoremIpsumOptionsCardProps = Readonly<{
  messages: LoremIpsumMessages
  countId: string
  localeId: string
  mode: LoremIpsumMode
  count: number
  locale: LoremIpsumLocale
  localeOptions: readonly {
    value: LoremIpsumLocale
    label: string
  }[]
  onModeChange: (value: LoremIpsumMode) => void
  onCountChange: (value: string) => void
  onLocaleChange: (value: LoremIpsumLocale) => void
}>

function LoremIpsumOptionsCard({
  messages,
  countId,
  localeId,
  mode,
  count,
  locale,
  localeOptions,
  onModeChange,
  onCountChange,
  onLocaleChange,
}: LoremIpsumOptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2">
          <ToggleGroup
            type="single"
            value={mode}
            spacing={0}
            variant="outline"
            className="w-full"
            onValueChange={(value) => {
              if (
                value === "words" ||
                value === "sentences" ||
                value === "paragraphs"
              ) {
                onModeChange(value)
              }
            }}
          >
            <ToggleGroupItem value="words" className="flex-1">
              {messages.wordsLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="sentences" className="flex-1">
              {messages.sentencesLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="paragraphs" className="flex-1">
              {messages.paragraphsLabel}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={localeId}>{messages.localeLabel}</FieldLabel>
            <Select
              value={locale}
              onValueChange={(value) => {
                onLocaleChange(value as LoremIpsumLocale)
              }}
            >
              <SelectTrigger
                id={localeId}
                aria-label={messages.localeLabel}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {localeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={countId}>{messages.countLabel}</FieldLabel>
            <Input
              id={countId}
              type="number"
              inputMode="numeric"
              min={LOREM_IPSUM_MIN_COUNT}
              max={LOREM_IPSUM_MAX_COUNT}
              value={count}
              onChange={(event) => {
                onCountChange(event.target.value)
              }}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}

export { LoremIpsumOptionsCard }
