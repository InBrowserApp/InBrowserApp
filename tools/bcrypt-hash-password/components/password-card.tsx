import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Eye, EyeOff, LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import { MAX_COST, MIN_COST } from "../client/constants"
import type { BcryptHashPasswordMessages } from "../client/types"

type PasswordCardProps = Readonly<{
  passwordId: string
  costId: string
  password: string
  showPassword: boolean
  costInput: string
  costValue: number
  costValid: boolean
  generating: boolean
  messages: BcryptHashPasswordMessages
  onPasswordChange: (value: string) => void
  onCostInputChange: (value: string) => void
  onCostSliderChange: (value: number) => void
  onTogglePassword: () => void
  onReset: () => void
}>

function PasswordCard({
  passwordId,
  costId,
  password,
  showPassword,
  costInput,
  costValue,
  costValid,
  generating,
  messages,
  onPasswordChange,
  onCostInputChange,
  onCostSliderChange,
  onTogglePassword,
  onReset,
}: PasswordCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={passwordId}>
              {messages.passwordLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                autoCapitalize="none"
                spellCheck={false}
                value={password}
                placeholder={messages.passwordPlaceholder}
                onChange={(event) => {
                  onPasswordChange(event.target.value)
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label={
                    showPassword
                      ? messages.hidePasswordLabel
                      : messages.showPasswordLabel
                  }
                  onClick={onTogglePassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>{messages.privacyNote}</FieldDescription>
          </Field>

          <Field data-invalid={!costValid}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor={costId}>{messages.costLabel}</FieldLabel>
              <Input
                id={costId}
                type="number"
                inputMode="numeric"
                min={MIN_COST}
                max={MAX_COST}
                step={1}
                className="w-20 text-right"
                value={costInput}
                aria-invalid={!costValid}
                onChange={(event) => {
                  onCostInputChange(event.target.value)
                }}
              />
            </div>
            <Slider
              aria-label={messages.costLabel}
              min={MIN_COST}
              max={MAX_COST}
              step={1}
              value={[costValue]}
              onValueChange={(value) => {
                onCostSliderChange(value[0] ?? costValue)
              }}
            />
            <FieldDescription>{messages.costDescription}</FieldDescription>
            {costValid ? null : (
              <FieldError>{messages.costInvalidMessage}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-between border-t">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={generating || !costValid || password.length === 0}
        >
          {generating ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {generating ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { PasswordCard }
