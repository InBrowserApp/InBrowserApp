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
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { BadgeCheck, FileText, TriangleAlert } from "@workspace/ui/icons"

import type {
  PRCIdValidationAnalysis,
  PRCIdValidatorMessages,
} from "../client/types"

type PRCIdInputCardProps = Readonly<{
  inputId: string
  messages: PRCIdValidatorMessages
  residentId: string
  validation: PRCIdValidationAnalysis | null
  feedbackMessage: string | null
  onResidentIdChange: (value: string) => void
}>

function PRCIdInputCard({
  inputId,
  messages,
  residentId,
  validation,
  feedbackMessage,
  onResidentIdChange,
}: PRCIdInputCardProps) {
  const showAlert =
    validation !== null &&
    feedbackMessage !== null &&
    (validation.isValid || validation.hasFormatIssue || !validation.isPartial)

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.residentIdNumber}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>
              {messages.residentIdNumber}
            </FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <FileText />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="text"
                name="resident-id"
                dir="ltr"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={residentId}
                aria-invalid={
                  validation &&
                  (validation.hasFormatIssue || !validation.isPartial)
                    ? !validation.isValid
                    : undefined
                }
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onResidentIdChange(event.target.value)
                }}
              />
            </InputGroup>
          </FieldContent>
        </Field>

        {showAlert ? (
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

export { PRCIdInputCard }
