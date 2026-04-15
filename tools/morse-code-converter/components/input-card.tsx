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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, Trash2 } from "@workspace/ui/icons"

import type { MorseCodeConverterMessagesCatalog } from "../types"

type InputCardProps = Readonly<{
  morseInput: string
  morseInputId: string
  messages: MorseCodeConverterMessagesCatalog & {
    meta: {
      name: string
      description: string
    }
  }
  textInput: string
  textInputId: string
  onClear: () => void
  onLoadSample: () => void
  onMorseInputChange: (value: string) => void
  onTextInputChange: (value: string) => void
}>

function InputCard({
  morseInput,
  morseInputId,
  messages,
  textInput,
  textInputId,
  onClear,
  onLoadSample,
  onMorseInputChange,
  onTextInputChange,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.meta.name}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <Field>
          <FieldLabel htmlFor={textInputId}>{messages.textLabel}</FieldLabel>
          <FieldContent>
            <Textarea
              id={textInputId}
              rows={6}
              value={textInput}
              className="min-h-32 resize-y font-mono text-sm"
              placeholder={messages.textPlaceholder}
              onChange={(event) => {
                onTextInputChange(event.target.value)
              }}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor={morseInputId}>
            {messages.morseCodeLabel}
          </FieldLabel>
          <FieldContent>
            <Textarea
              id={morseInputId}
              rows={6}
              value={morseInput}
              spellCheck={false}
              className="min-h-32 resize-y font-mono text-sm"
              placeholder={messages.morsePlaceholder}
              onChange={(event) => {
                onMorseInputChange(event.target.value)
              }}
            />
          </FieldContent>
        </Field>
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
