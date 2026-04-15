import { useId } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
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
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import { Eye, EyeOff, Lock } from "@workspace/ui/icons"

import type { PasswordStrengthCheckerMessages } from "../client/types"

type PasswordInputCardProps = Readonly<{
  messages: PasswordStrengthCheckerMessages
  password: string
  showPassword: boolean
  onPasswordChange: (value: string) => void
  onToggleVisibility: () => void
}>

function PasswordInputCard({
  messages,
  password,
  showPassword,
  onPasswordChange,
  onToggleVisibility,
}: PasswordInputCardProps) {
  const inputId = useId()
  const visibilityLabel = showPassword ? messages.hide : messages.show

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.passwordLabel}</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Lock />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={inputId}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                spellCheck={false}
                value={password}
                placeholder={messages.passwordPlaceholder}
                className="text-base"
                onChange={(event) => {
                  onPasswordChange(event.target.value)
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  aria-label={visibilityLabel}
                  aria-pressed={showPassword}
                  title={visibilityLabel}
                  onClick={onToggleVisibility}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>
        </Field>

        <p className="text-sm leading-6 text-muted-foreground">
          {messages.privacyHint}
        </p>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PasswordInputCard }
