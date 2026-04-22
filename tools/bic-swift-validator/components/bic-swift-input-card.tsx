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
  BICSwiftValidatorMessages,
  BICValidationAnalysis,
} from "../client/types"

type BicSwiftInputCardProps = Readonly<{
  inputId: string
  messages: BICSwiftValidatorMessages
  bic: string
  validation: BICValidationAnalysis | null
  feedbackMessage: string | null
  onBICChange: (value: string) => void
}>

function BicSwiftInputCard({
  inputId,
  messages,
  bic,
  validation,
  feedbackMessage,
  onBICChange,
}: BicSwiftInputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.bic}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.bic}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <FileText />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type="text"
                name="bic"
                dir="ltr"
                autoCapitalize="characters"
                spellCheck={false}
                value={bic}
                aria-invalid={validation ? !validation.isValid : undefined}
                placeholder={messages.placeholder}
                className="font-mono text-base"
                onChange={(event) => {
                  onBICChange(event.target.value)
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

export { BicSwiftInputCard }
