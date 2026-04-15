import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { BadgeCheck, Binary, TriangleAlert } from "@workspace/ui/icons"

import type {
  IMEIValidationAnalysis,
  IMEIValidatorMessages,
} from "../client/types"

type IMEIInputCardProps = Readonly<{
  inputId: string
  messages: IMEIValidatorMessages
  imei: string
  validation: IMEIValidationAnalysis | null
  feedbackMessage: string | null
  onIMEIChange: (value: string) => void
}>

function IMEIInputCard({
  inputId,
  messages,
  imei,
  validation,
  feedbackMessage,
  onIMEIChange,
}: IMEIInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.imei}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.imei}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Binary />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="text"
                name="imei"
                autoComplete="off"
                spellCheck={false}
                value={imei}
                aria-invalid={validation ? !validation.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onIMEIChange(event.target.value)
                }}
              />
            </InputGroup>
          </FieldContent>
        </Field>

        {validation && feedbackMessage ? (
          <div aria-live="polite">
            {validation.isValid ? (
              <Alert>
                <BadgeCheck />
                <AlertTitle>{messages.valid}</AlertTitle>
                <AlertDescription>{feedbackMessage}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalid}</AlertTitle>
                <AlertDescription>{feedbackMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { IMEIInputCard }
