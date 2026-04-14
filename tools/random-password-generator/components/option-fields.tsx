import type { ChangeEvent } from "react"

import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"

import type { RandomPasswordGeneratorMessages } from "../types"

type WordsFieldsProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  wordsCountId: string
  wordsSeparatorId: string
  wordsCount: number
  wordsSeparator: string
  wordsCapitalize: boolean
  wordsIncludeNumber: boolean
  onWordsCountChange: (value: string) => void
  onWordsSeparatorChange: (value: string) => void
  onWordsCapitalizeChange: (checked: boolean) => void
  onWordsIncludeNumberChange: (checked: boolean) => void
}>

type PinFieldsProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  pinLengthId: string
  pinLength: number
  pinAllowLeadingZero: boolean
  onPinLengthChange: (value: string) => void
  onPinAllowLeadingZeroChange: (checked: boolean) => void
}>

function WordsModeFields({
  messages,
  wordsCountId,
  wordsSeparatorId,
  wordsCount,
  wordsSeparator,
  wordsCapitalize,
  wordsIncludeNumber,
  onWordsCountChange,
  onWordsSeparatorChange,
  onWordsCapitalizeChange,
  onWordsIncludeNumberChange,
}: WordsFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={wordsCountId}>
          {messages.wordsCountLabel}
        </FieldLabel>
        <Input
          id={wordsCountId}
          type="number"
          inputMode="numeric"
          min={2}
          max={12}
          step={1}
          value={wordsCount}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onWordsCountChange(event.target.value)
          }}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={wordsSeparatorId}>
          {messages.separatorLabel}
        </FieldLabel>
        <Input
          id={wordsSeparatorId}
          maxLength={3}
          value={wordsSeparator}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onWordsSeparatorChange(event.target.value)
          }}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field className="gap-3">
          <FieldLabel htmlFor={`${wordsCountId}-capitalize`}>
            {messages.capitalizeWordsLabel}
          </FieldLabel>
          <Switch
            id={`${wordsCountId}-capitalize`}
            checked={wordsCapitalize}
            onCheckedChange={(checked: boolean) => {
              onWordsCapitalizeChange(checked)
            }}
          />
        </Field>

        <Field className="gap-3">
          <FieldLabel htmlFor={`${wordsCountId}-number`}>
            {messages.includeNumberLabel}
          </FieldLabel>
          <Switch
            id={`${wordsCountId}-number`}
            checked={wordsIncludeNumber}
            onCheckedChange={(checked: boolean) => {
              onWordsIncludeNumberChange(checked)
            }}
          />
        </Field>
      </div>
    </>
  )
}

function PinModeFields({
  messages,
  pinLengthId,
  pinLength,
  pinAllowLeadingZero,
  onPinLengthChange,
  onPinAllowLeadingZeroChange,
}: PinFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={pinLengthId}>{messages.pinLengthLabel}</FieldLabel>
        <Input
          id={pinLengthId}
          type="number"
          inputMode="numeric"
          min={1}
          max={12}
          step={1}
          value={pinLength}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onPinLengthChange(event.target.value)
          }}
        />
      </Field>

      <Field className="gap-3">
        <FieldLabel htmlFor={`${pinLengthId}-leading-zero`}>
          {messages.allowLeadingZeroLabel}
        </FieldLabel>
        <Switch
          id={`${pinLengthId}-leading-zero`}
          checked={pinAllowLeadingZero}
          onCheckedChange={(checked: boolean) => {
            onPinAllowLeadingZeroChange(checked)
          }}
        />
      </Field>
    </>
  )
}

export { PinModeFields, WordsModeFields }
