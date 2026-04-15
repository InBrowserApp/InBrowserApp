import type { ReactNode } from "react"

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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import { WORD_COUNTS, type Bip39Tab } from "../core/bip39"

import type { Bip39OptionsCardProps } from "../types"

function SelectField({
  children,
  label,
  value,
  onValueChange,
}: Readonly<{
  children: ReactNode
  label: string
  value: string
  onValueChange: (value: string) => void
}>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {children}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

const TAB_ITEMS = [
  { key: "generate", messageKey: "generateTabLabel" },
  { key: "validate", messageKey: "validateTabLabel" },
  { key: "convert", messageKey: "convertTabLabel" },
] as const

function OptionsCard({
  activeTab,
  conversionMnemonic,
  conversionMnemonicId,
  entropyInput,
  entropyInputId,
  messages,
  strengthBits,
  validationMnemonic,
  validationMnemonicId,
  wordCount,
  wordlist,
  wordlistOptions,
  onActiveTabChange,
  onConversionMnemonicChange,
  onEntropyInputChange,
  onValidationMnemonicChange,
  onWordCountChange,
  onWordlistChange,
}: Bip39OptionsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6">
        <Field>
          <FieldLabel>{messages.modeLabel}</FieldLabel>
          <FieldContent>
            <ToggleGroup
              type="single"
              value={activeTab}
              variant="outline"
              size="sm"
              spacing={0}
              aria-label={messages.modeLabel}
              className="w-full [&>[data-slot=toggle-group-item]]:flex-1"
              onValueChange={(value) => {
                if (
                  value === "generate" ||
                  value === "validate" ||
                  value === "convert"
                ) {
                  onActiveTabChange(value as Bip39Tab)
                }
              }}
            >
              {TAB_ITEMS.map((item) => (
                <ToggleGroupItem key={item.key} value={item.key}>
                  {messages[item.messageKey]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FieldContent>
        </Field>

        <SelectField
          label={messages.wordlistLabel}
          value={wordlist}
          onValueChange={onWordlistChange}
        >
          {wordlistOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectField>

        {activeTab === "generate" ? (
          <>
            <SelectField
              label={messages.wordCountLabel}
              value={String(wordCount)}
              onValueChange={onWordCountChange}
            >
              {WORD_COUNTS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectField>

            <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
              <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {messages.entropyBitsLabel.replace(
                  "{bits}",
                  String(strengthBits)
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {messages.generatedPlaceholder}
              </p>
            </div>
          </>
        ) : null}

        {activeTab === "validate" ? (
          <Field>
            <FieldLabel htmlFor={validationMnemonicId}>
              {messages.validationMnemonicLabel}
            </FieldLabel>
            <Textarea
              id={validationMnemonicId}
              value={validationMnemonic}
              rows={6}
              placeholder={messages.validationMnemonicLabel}
              className="min-h-36 resize-y font-mono text-sm"
              onChange={(event) => {
                onValidationMnemonicChange(event.target.value)
              }}
            />
          </Field>
        ) : null}

        {activeTab === "convert" ? (
          <>
            <Field>
              <FieldLabel htmlFor={entropyInputId}>
                {messages.entropyInputLabel}
              </FieldLabel>
              <Input
                id={entropyInputId}
                value={entropyInput}
                placeholder={messages.entropyInputLabel}
                spellCheck={false}
                className="font-mono text-sm"
                onChange={(event) => {
                  onEntropyInputChange(event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={conversionMnemonicId}>
                {messages.conversionMnemonicLabel}
              </FieldLabel>
              <Textarea
                id={conversionMnemonicId}
                value={conversionMnemonic}
                rows={6}
                placeholder={messages.conversionMnemonicLabel}
                className="min-h-36 resize-y font-mono text-sm"
                onChange={(event) => {
                  onConversionMnemonicChange(event.target.value)
                }}
              />
            </Field>
          </>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OptionsCard }
