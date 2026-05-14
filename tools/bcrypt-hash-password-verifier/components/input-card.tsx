import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { LoaderCircle, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import { SecretInputField } from "./secret-input-field"
import type { BcryptHashPasswordVerifierMessages } from "../client/types"

type InputCardProps = Readonly<{
  messages: BcryptHashPasswordVerifierMessages
  password: string
  hash: string
  passwordVisible: boolean
  hashVisible: boolean
  hashInvalid: boolean
  isVerifying: boolean
  canVerify: boolean
  onPasswordChange: (value: string) => void
  onHashChange: (value: string) => void
  onTogglePasswordVisibility: () => void
  onToggleHashVisibility: () => void
  onReset: () => void
  onUseSample: () => void
}>

function InputCard({
  messages,
  password,
  hash,
  passwordVisible,
  hashVisible,
  hashInvalid,
  isVerifying,
  canVerify,
  onPasswordChange,
  onHashChange,
  onTogglePasswordVisibility,
  onToggleHashVisibility,
  onReset,
  onUseSample,
}: InputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <SecretInputField
            label={messages.passwordLabel}
            placeholder={messages.passwordPlaceholder}
            value={password}
            name="password"
            visible={passwordVisible}
            showLabel={messages.show}
            hideLabel={messages.hide}
            onChange={onPasswordChange}
            onToggleVisibility={onTogglePasswordVisibility}
          />
          <SecretInputField
            label={messages.hashLabel}
            description={messages.hashDescription}
            placeholder={messages.hashPlaceholder}
            value={hash}
            name="bcrypt-hash"
            visible={hashVisible}
            invalid={hashInvalid}
            showLabel={messages.show}
            hideLabel={messages.hide}
            onChange={onHashChange}
            onToggleVisibility={onToggleHashVisibility}
          />
        </FieldGroup>
        <p className="text-sm leading-6 text-muted-foreground">
          {messages.privacyHint}
        </p>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex-wrap justify-between gap-3 border-t">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUseSample}
          >
            <Sparkles data-icon="inline-start" />
            {messages.sampleLabel}
          </Button>
        </div>
        <Button type="submit" size="sm" disabled={!canVerify || isVerifying}>
          {isVerifying ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {isVerifying ? messages.verifyingLabel : messages.verifyLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { InputCard }
