import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
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
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { BadgeCheck, TriangleAlert } from "@workspace/ui/icons"

import type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
} from "../client/types"

type UuidInputCardProps = Readonly<{
  inputId: string
  messages: UuidValidatorMessages
  uuid: string
  analysis: UuidValidationAnalysis | null
  feedbackMessage: string | null
  onUuidChange: (value: string) => void
}>

function UuidInputCard({
  inputId,
  messages,
  uuid,
  analysis,
  feedbackMessage,
  onUuidChange,
}: UuidInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field data-invalid={analysis ? !analysis.isValid : undefined}>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.uuidLabel}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupInput
                id={inputId}
                type="text"
                name="uuid"
                dir="ltr"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                value={uuid}
                aria-invalid={analysis ? !analysis.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onUuidChange(event.target.value)
                }}
              />
            </InputGroup>
          </FieldContent>
        </Field>

        {analysis && feedbackMessage ? (
          <div aria-live="polite">
            {analysis.isValid ? (
              <Alert>
                <BadgeCheck />
                <AlertTitle>{messages.validTitle}</AlertTitle>
                <AlertDescription>{feedbackMessage}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidTitle}</AlertTitle>
                <AlertDescription>{feedbackMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { UuidInputCard }
