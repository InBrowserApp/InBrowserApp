import type { ChangeEvent } from "react"

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Check } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { CharsetOption, RandomPasswordGeneratorMessages } from "../types"

type CharsetSelectorProps = Readonly<{
  label: string
  selectedCharsets: readonly CharsetOption[]
  onToggle: (value: CharsetOption) => void
  messages: RandomPasswordGeneratorMessages
}>

type RandomFieldsProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  randomLengthId: string
  randomLength: number
  randomCharsets: readonly CharsetOption[]
  randomExcludeSimilar: boolean
  onRandomLengthChange: (value: string) => void
  onRandomCharsetToggle: (value: CharsetOption) => void
  onRandomExcludeSimilarChange: (checked: boolean) => void
}>

type SeparatorFieldsProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  separatorBlockLengthId: string
  separatorBlockCountId: string
  separatorBlockSeparatorId: string
  separatorCharsets: readonly CharsetOption[]
  separatorExcludeSimilar: boolean
  separatorBlockLength: number
  separatorBlockCount: number
  separatorBlockSeparator: string
  onSeparatorCharsetToggle: (value: CharsetOption) => void
  onSeparatorExcludeSimilarChange: (checked: boolean) => void
  onSeparatorBlockLengthChange: (value: string) => void
  onSeparatorBlockCountChange: (value: string) => void
  onSeparatorBlockSeparatorChange: (value: string) => void
}>

const CHARSET_ITEMS = [
  { value: "upper", labelKey: "uppercaseLabel" },
  { value: "lower", labelKey: "lowercaseLabel" },
  { value: "digits", labelKey: "digitsLabel" },
  { value: "symbols", labelKey: "symbolsLabel" },
] as const

function CharsetSelector({
  label,
  selectedCharsets,
  onToggle,
  messages,
}: CharsetSelectorProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          spacing={0}
          value={[...selectedCharsets]}
          className="w-full [&>[data-slot=toggle-group-item]]:min-w-0 [&>[data-slot=toggle-group-item]]:flex-1"
          aria-label={label}
          onValueChange={(value) => {
            const previous = new Set(selectedCharsets)
            const next = new Set(value as CharsetOption[])

            for (const option of CHARSET_ITEMS) {
              if (previous.has(option.value) !== next.has(option.value)) {
                onToggle(option.value)
              }
            }
          }}
        >
          {CHARSET_ITEMS.map((item) => {
            const isSelected = selectedCharsets.includes(item.value)

            return (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className="justify-start"
              >
                <Check
                  data-icon="inline-start"
                  className={cn(isSelected ? "opacity-100" : "opacity-0")}
                />
                {messages[item.labelKey]}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </FieldContent>
    </Field>
  )
}

function RandomModeFields({
  messages,
  randomLengthId,
  randomLength,
  randomCharsets,
  randomExcludeSimilar,
  onRandomLengthChange,
  onRandomCharsetToggle,
  onRandomExcludeSimilarChange,
}: RandomFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={randomLengthId}>
          {messages.randomLengthLabel}
        </FieldLabel>
        <Input
          id={randomLengthId}
          type="number"
          inputMode="numeric"
          min={4}
          max={128}
          step={1}
          value={randomLength}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onRandomLengthChange(event.target.value)
          }}
        />
      </Field>

      <CharsetSelector
        label={messages.characterSetLabel}
        selectedCharsets={randomCharsets}
        onToggle={onRandomCharsetToggle}
        messages={messages}
      />

      <Field className="gap-3">
        <FieldLabel htmlFor={`${randomLengthId}-similar`}>
          {messages.excludeSimilarLabel}
        </FieldLabel>
        <Switch
          id={`${randomLengthId}-similar`}
          checked={randomExcludeSimilar}
          onCheckedChange={(checked: boolean) => {
            onRandomExcludeSimilarChange(checked)
          }}
        />
      </Field>
    </>
  )
}

function SeparatorModeFields({
  messages,
  separatorBlockLengthId,
  separatorBlockCountId,
  separatorBlockSeparatorId,
  separatorCharsets,
  separatorExcludeSimilar,
  separatorBlockLength,
  separatorBlockCount,
  separatorBlockSeparator,
  onSeparatorCharsetToggle,
  onSeparatorExcludeSimilarChange,
  onSeparatorBlockLengthChange,
  onSeparatorBlockCountChange,
  onSeparatorBlockSeparatorChange,
}: SeparatorFieldsProps) {
  return (
    <>
      <CharsetSelector
        label={messages.characterSetLabel}
        selectedCharsets={separatorCharsets}
        onToggle={onSeparatorCharsetToggle}
        messages={messages}
      />

      <Field className="gap-3">
        <FieldLabel htmlFor={`${separatorBlockLengthId}-similar`}>
          {messages.excludeSimilarLabel}
        </FieldLabel>
        <Switch
          id={`${separatorBlockLengthId}-similar`}
          checked={separatorExcludeSimilar}
          onCheckedChange={(checked: boolean) => {
            onSeparatorExcludeSimilarChange(checked)
          }}
        />
      </Field>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={separatorBlockLengthId}>
            {messages.blockLengthLabel}
          </FieldLabel>
          <Input
            id={separatorBlockLengthId}
            type="number"
            inputMode="numeric"
            min={1}
            max={16}
            step={1}
            value={separatorBlockLength}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSeparatorBlockLengthChange(event.target.value)
            }}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={separatorBlockCountId}>
            {messages.blockCountLabel}
          </FieldLabel>
          <Input
            id={separatorBlockCountId}
            type="number"
            inputMode="numeric"
            min={2}
            max={10}
            step={1}
            value={separatorBlockCount}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSeparatorBlockCountChange(event.target.value)
            }}
          />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor={separatorBlockSeparatorId}>
          {messages.blockSeparatorLabel}
        </FieldLabel>
        <Input
          id={separatorBlockSeparatorId}
          maxLength={3}
          value={separatorBlockSeparator}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onSeparatorBlockSeparatorChange(event.target.value)
          }}
        />
      </Field>
    </>
  )
}

export { RandomModeFields, SeparatorModeFields }
