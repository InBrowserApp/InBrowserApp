import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
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
import {
  FileText,
  Play,
  Square,
  Trash2,
  TriangleAlert,
} from "@workspace/ui/icons"

import type { MorseCodeConverterMessagesCatalog, ResultStatus } from "../types"

type InputCardProps = Readonly<{
  errorMessage: string | null
  isPlaying: boolean
  morseInput: string
  morseInputId: string
  messages: MorseCodeConverterMessagesCatalog & {
    meta: {
      name: string
      description: string
    }
  }
  status: ResultStatus
  textInput: string
  textInputId: string
  onClear: () => void
  onLoadSample: () => void
  onMorseInputChange: (value: string) => void
  onPlay: () => void
  onStop: () => void
  onTextInputChange: (value: string) => void
}>

function InputCard({
  errorMessage,
  isPlaying,
  morseInput,
  morseInputId,
  messages,
  status,
  textInput,
  textInputId,
  onClear,
  onLoadSample,
  onMorseInputChange,
  onPlay,
  onStop,
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FieldLabel htmlFor={textInputId}>{messages.textLabel}</FieldLabel>
            <ToolCopyButton
              value={textInput}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              variant="ghost"
            />
          </div>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FieldLabel htmlFor={morseInputId}>
              {messages.morseCodeLabel}
            </FieldLabel>
            <div className="flex flex-wrap items-center gap-2">
              {status === "valid" && morseInput.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={isPlaying ? onStop : onPlay}
                >
                  {isPlaying ? (
                    <Square data-icon="inline-start" />
                  ) : (
                    <Play data-icon="inline-start" />
                  )}
                  {isPlaying ? messages.stop : messages.play}
                </Button>
              ) : null}
              <ToolCopyButton
                value={morseInput}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
                variant="ghost"
              />
            </div>
          </div>
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

        {status === "valid" && morseInput.length > 0 ? (
          <div className="flex items-center">
            <Badge variant="secondary">{messages.validLabel}</Badge>
          </div>
        ) : null}

        {status === "invalid" && errorMessage ? (
          <Alert variant="destructive">
            <TriangleAlert />
            {errorMessage !== messages.invalidMorseCode ? (
              <AlertTitle>{messages.invalidLabel}</AlertTitle>
            ) : null}
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
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
