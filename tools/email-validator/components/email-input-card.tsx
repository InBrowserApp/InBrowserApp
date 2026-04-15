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
import { AtSign, BadgeCheck, TriangleAlert } from "@workspace/ui/icons"

import type {
  EmailValidationAnalysis,
  EmailValidatorMessages,
} from "../client/types"

type EmailInputCardProps = Readonly<{
  inputId: string
  messages: EmailValidatorMessages
  email: string
  validation: EmailValidationAnalysis | null
  feedbackMessage: string | null
  onEmailChange: (value: string) => void
}>

function EmailInputCard({
  inputId,
  messages,
  email,
  validation,
  feedbackMessage,
  onEmailChange,
}: EmailInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.email}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.email}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <AtSign />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="email"
                name="email"
                dir="ltr"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                value={email}
                aria-invalid={validation ? !validation.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onEmailChange(event.target.value)
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

export { EmailInputCard }
