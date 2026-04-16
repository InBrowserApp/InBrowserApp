import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
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
import { FileText, Trash2 } from "@workspace/ui/icons"

import type { RomanNumeralConverterMessagesCatalog } from "../types"

type InputCardProps = Readonly<{
  arabicInput: string
  arabicInputId: string
  messages: RomanNumeralConverterMessagesCatalog
  romanInput: string
  romanInputId: string
  onArabicInputChange: (value: string) => void
  onClear: () => void
  onLoadSample: () => void
  onRomanInputChange: (value: string) => void
}>

function InputCard({
  arabicInput,
  arabicInputId,
  messages,
  romanInput,
  romanInputId,
  onArabicInputChange,
  onClear,
  onLoadSample,
  onRomanInputChange,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.converterTitle}</CardTitle>
        <CardDescription>{messages.converterDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Field>
          <FieldLabel htmlFor={arabicInputId}>
            {messages.arabicNumber}
          </FieldLabel>
          <FieldContent>
            <Input
              id={arabicInputId}
              value={arabicInput}
              inputMode="numeric"
              placeholder={messages.arabicPlaceholder}
              className="h-11 font-mono text-base"
              onChange={(event) => {
                onArabicInputChange(event.target.value)
              }}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor={romanInputId}>
            {messages.romanNumeral}
          </FieldLabel>
          <FieldContent>
            <Input
              id={romanInputId}
              value={romanInput}
              spellCheck={false}
              autoCapitalize="characters"
              autoCorrect="off"
              placeholder={messages.romanPlaceholder}
              className="h-11 font-mono text-base uppercase"
              onChange={(event) => {
                onRomanInputChange(event.target.value)
              }}
            />
          </FieldContent>
        </Field>

        <div className="grid gap-2 rounded-xl border border-dashed border-border/80 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p>{messages.rangeHint}</p>
          <p>{messages.notationHint}</p>
        </div>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-start gap-3 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <FileText data-icon="inline-start" />
          {messages.loadSample}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 data-icon="inline-start" />
          {messages.clearLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
