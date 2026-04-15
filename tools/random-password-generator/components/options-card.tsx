import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { PinModeFields, WordsModeFields } from "./option-fields"
import { RandomModeFields, SeparatorModeFields } from "./random-group-fields"

import type {
  CharsetOption,
  PasswordMode,
  RandomPasswordGeneratorMessages,
} from "../types"

type OptionsCardProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
  mode: PasswordMode
  randomLengthId: string
  wordsCountId: string
  wordsSeparatorId: string
  separatorBlockLengthId: string
  separatorBlockCountId: string
  separatorBlockSeparatorId: string
  pinLengthId: string
  randomLength: number
  randomCharsets: readonly CharsetOption[]
  randomExcludeSimilar: boolean
  wordsCount: number
  wordsSeparator: string
  wordsCapitalize: boolean
  wordsIncludeNumber: boolean
  separatorCharsets: readonly CharsetOption[]
  separatorExcludeSimilar: boolean
  separatorBlockLength: number
  separatorBlockCount: number
  separatorBlockSeparator: string
  pinLength: number
  pinAllowLeadingZero: boolean
  onModeChange: (value: PasswordMode) => void
  onRandomLengthChange: (value: string) => void
  onRandomCharsetToggle: (value: CharsetOption) => void
  onRandomExcludeSimilarChange: (checked: boolean) => void
  onWordsCountChange: (value: string) => void
  onWordsSeparatorChange: (value: string) => void
  onWordsCapitalizeChange: (checked: boolean) => void
  onWordsIncludeNumberChange: (checked: boolean) => void
  onSeparatorCharsetToggle: (value: CharsetOption) => void
  onSeparatorExcludeSimilarChange: (checked: boolean) => void
  onSeparatorBlockLengthChange: (value: string) => void
  onSeparatorBlockCountChange: (value: string) => void
  onSeparatorBlockSeparatorChange: (value: string) => void
  onPinLengthChange: (value: string) => void
  onPinAllowLeadingZeroChange: (checked: boolean) => void
}>

const MODE_ITEMS = [
  { value: "random", labelKey: "randomTabLabel" },
  { value: "words", labelKey: "wordsTabLabel" },
  { value: "separator", labelKey: "separatorTabLabel" },
  { value: "pin", labelKey: "pinTabLabel" },
] as const

function OptionsCard({
  messages,
  mode,
  randomLengthId,
  wordsCountId,
  wordsSeparatorId,
  separatorBlockLengthId,
  separatorBlockCountId,
  separatorBlockSeparatorId,
  pinLengthId,
  randomLength,
  randomCharsets,
  randomExcludeSimilar,
  wordsCount,
  wordsSeparator,
  wordsCapitalize,
  wordsIncludeNumber,
  separatorCharsets,
  separatorExcludeSimilar,
  separatorBlockLength,
  separatorBlockCount,
  separatorBlockSeparator,
  pinLength,
  pinAllowLeadingZero,
  onModeChange,
  onRandomLengthChange,
  onRandomCharsetToggle,
  onRandomExcludeSimilarChange,
  onWordsCountChange,
  onWordsSeparatorChange,
  onWordsCapitalizeChange,
  onWordsIncludeNumberChange,
  onSeparatorCharsetToggle,
  onSeparatorExcludeSimilarChange,
  onSeparatorBlockLengthChange,
  onSeparatorBlockCountChange,
  onSeparatorBlockSeparatorChange,
  onPinLengthChange,
  onPinAllowLeadingZeroChange,
}: OptionsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel>{messages.modeLabel}</FieldLabel>
            <FieldContent>
              <ToggleGroup
                type="single"
                value={mode}
                variant="outline"
                size="sm"
                spacing={0}
                className="w-full [&>[data-slot=toggle-group-item]]:flex-1"
                onValueChange={(value: string) => {
                  if (
                    value === "random" ||
                    value === "words" ||
                    value === "separator" ||
                    value === "pin"
                  ) {
                    onModeChange(value)
                  }
                }}
              >
                {MODE_ITEMS.map((item) => (
                  <ToggleGroupItem key={item.value} value={item.value}>
                    {messages[item.labelKey]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldContent>
          </Field>

          {mode === "random" ? (
            <RandomModeFields
              messages={messages}
              randomLengthId={randomLengthId}
              randomLength={randomLength}
              randomCharsets={randomCharsets}
              randomExcludeSimilar={randomExcludeSimilar}
              onRandomLengthChange={onRandomLengthChange}
              onRandomCharsetToggle={onRandomCharsetToggle}
              onRandomExcludeSimilarChange={onRandomExcludeSimilarChange}
            />
          ) : null}

          {mode === "words" ? (
            <WordsModeFields
              messages={messages}
              wordsCountId={wordsCountId}
              wordsSeparatorId={wordsSeparatorId}
              wordsCount={wordsCount}
              wordsSeparator={wordsSeparator}
              wordsCapitalize={wordsCapitalize}
              wordsIncludeNumber={wordsIncludeNumber}
              onWordsCountChange={onWordsCountChange}
              onWordsSeparatorChange={onWordsSeparatorChange}
              onWordsCapitalizeChange={onWordsCapitalizeChange}
              onWordsIncludeNumberChange={onWordsIncludeNumberChange}
            />
          ) : null}

          {mode === "separator" ? (
            <SeparatorModeFields
              messages={messages}
              separatorBlockLengthId={separatorBlockLengthId}
              separatorBlockCountId={separatorBlockCountId}
              separatorBlockSeparatorId={separatorBlockSeparatorId}
              separatorCharsets={separatorCharsets}
              separatorExcludeSimilar={separatorExcludeSimilar}
              separatorBlockLength={separatorBlockLength}
              separatorBlockCount={separatorBlockCount}
              separatorBlockSeparator={separatorBlockSeparator}
              onSeparatorCharsetToggle={onSeparatorCharsetToggle}
              onSeparatorExcludeSimilarChange={onSeparatorExcludeSimilarChange}
              onSeparatorBlockLengthChange={onSeparatorBlockLengthChange}
              onSeparatorBlockCountChange={onSeparatorBlockCountChange}
              onSeparatorBlockSeparatorChange={onSeparatorBlockSeparatorChange}
            />
          ) : null}

          {mode === "pin" ? (
            <PinModeFields
              messages={messages}
              pinLengthId={pinLengthId}
              pinLength={pinLength}
              pinAllowLeadingZero={pinAllowLeadingZero}
              onPinLengthChange={onPinLengthChange}
              onPinAllowLeadingZeroChange={onPinAllowLeadingZeroChange}
            />
          ) : null}
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OptionsCard }
