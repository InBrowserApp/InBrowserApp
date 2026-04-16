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
import { BadgeCheck, FileText, TriangleAlert } from "@workspace/ui/icons"

import type {
  IBANValidationAnalysis,
  IBANValidatorMessages,
} from "../client/types"

type IbanInputCardProps = Readonly<{
  inputId: string
  messages: IBANValidatorMessages
  iban: string
  validation: IBANValidationAnalysis | null
  feedbackMessage: string | null
  onIBANChange: (value: string) => void
}>

function IbanInputCard({
  inputId,
  messages,
  iban,
  validation,
  feedbackMessage,
  onIBANChange,
}: IbanInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.iban}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.iban}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <FileText />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="text"
                name="iban"
                dir="ltr"
                autoCapitalize="characters"
                spellCheck={false}
                value={iban}
                aria-invalid={validation ? !validation.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onIBANChange(event.target.value)
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

export { IbanInputCard }
