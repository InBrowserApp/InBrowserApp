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
import { BadgeCheck, CreditCard, TriangleAlert } from "@workspace/ui/icons"

import type {
  CreditCardValidationAnalysis,
  CreditCardValidatorMessages,
} from "../client/types"

type CreditCardInputCardProps = Readonly<{
  inputId: string
  messages: CreditCardValidatorMessages
  cardNumber: string
  validation: CreditCardValidationAnalysis | null
  feedbackMessage: string | null
  onCardNumberChange: (value: string) => void
}>

function CreditCardInputCard({
  inputId,
  messages,
  cardNumber,
  validation,
  feedbackMessage,
  onCardNumberChange,
}: CreditCardInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.cardNumber}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.cardNumber}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <CreditCard />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="text"
                name="card-number"
                dir="ltr"
                inputMode="numeric"
                autoComplete="cc-number"
                spellCheck={false}
                value={cardNumber}
                aria-invalid={validation ? !validation.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onCardNumberChange(event.target.value)
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

export { CreditCardInputCard }
