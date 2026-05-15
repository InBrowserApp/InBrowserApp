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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Eye, EyeOff } from "@workspace/ui/icons"

import type { PgpKeyGeneratorMessages } from "./types"

type IdentityCardProps = Readonly<{
  comment: string
  email: string
  name: string
  passphrase: string
  passphraseVisible: boolean
  messages: PgpKeyGeneratorMessages
  ids: Readonly<{
    comment: string
    email: string
    name: string
    passphrase: string
  }>
  onCommentChange: (value: string) => void
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onPassphraseChange: (value: string) => void
  onTogglePassphrase: () => void
}>

function IdentityCard({
  comment,
  email,
  ids,
  messages,
  name,
  passphrase,
  passphraseVisible,
  onCommentChange,
  onEmailChange,
  onNameChange,
  onPassphraseChange,
  onTogglePassphrase,
}: IdentityCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.identityTitle}</CardTitle>
        <CardDescription>{messages.identityDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={ids.name}>{messages.nameLabel}</FieldLabel>
            <Input
              id={ids.name}
              name="name"
              value={name}
              autoComplete="name"
              placeholder={messages.namePlaceholder}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={ids.email}>{messages.emailLabel}</FieldLabel>
            <Input
              id={ids.email}
              name="email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder={messages.emailPlaceholder}
              spellCheck={false}
              onChange={(event) => onEmailChange(event.target.value)}
            />
            <FieldDescription>{messages.identityRequiredHint}</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={ids.comment}>
              {messages.commentLabel}
            </FieldLabel>
            <Input
              id={ids.comment}
              name="comment"
              value={comment}
              autoComplete="off"
              placeholder={messages.commentPlaceholder}
              onChange={(event) => onCommentChange(event.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={ids.passphrase}>
              {messages.passphraseLabel}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={ids.passphrase}
                name="passphrase"
                type={passphraseVisible ? "text" : "password"}
                value={passphrase}
                autoComplete="new-password"
                placeholder={messages.passphrasePlaceholder}
                spellCheck={false}
                onChange={(event) => onPassphraseChange(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-label={
                    passphraseVisible
                      ? messages.hideSecretLabel
                      : messages.showSecretLabel
                  }
                  onClick={onTogglePassphrase}
                >
                  {passphraseVisible ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              {messages.passphraseDescription}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { IdentityCard }
