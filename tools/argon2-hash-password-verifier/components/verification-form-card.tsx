import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Eye, EyeOff, LoaderCircle, Lock } from "@workspace/ui/icons"

import type { Argon2HashPasswordVerifierPageMessages } from "../client/types"

type VerificationFormCardProps = Readonly<{
  passwordId: string
  hashId: string
  secretId: string
  password: string
  hash: string
  secret: string
  canVerify: boolean
  loading: boolean
  messages: Argon2HashPasswordVerifierPageMessages
  onPasswordChange: (value: string) => void
  onHashChange: (value: string) => void
  onSecretChange: (value: string) => void
  onReset: () => void
}>

function VerificationFormCard({
  passwordId,
  hashId,
  secretId,
  password,
  hash,
  secret,
  canVerify,
  loading,
  messages,
  onPasswordChange,
  onHashChange,
  onSecretChange,
  onReset,
}: VerificationFormCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.formLabel}</CardTitle>
        <CardDescription>{messages.formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <SecretField
            id={passwordId}
            name="argon2-password-candidate"
            label={messages.passwordLabel}
            description={messages.passwordDescription}
            placeholder={messages.passwordPlaceholder}
            value={password}
            visible={showPassword}
            showLabel={messages.showPasswordLabel}
            hideLabel={messages.hidePasswordLabel}
            onValueChange={onPasswordChange}
            onVisibilityChange={() => {
              setShowPassword((currentValue) => !currentValue)
            }}
          />

          <Field>
            <FieldLabel htmlFor={hashId}>{messages.hashLabel}</FieldLabel>
            <Textarea
              id={hashId}
              name="argon2-encoded-hash"
              value={hash}
              placeholder={messages.hashPlaceholder}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="min-h-32 resize-y font-mono text-xs"
              onChange={(event) => {
                onHashChange(event.target.value)
              }}
            />
            <FieldDescription>{messages.hashDescription}</FieldDescription>
          </Field>

          <SecretField
            id={secretId}
            name="argon2-secret"
            label={messages.secretLabel}
            description={messages.secretDescription}
            placeholder={messages.secretPlaceholder}
            value={secret}
            visible={showSecret}
            showLabel={messages.showSecretLabel}
            hideLabel={messages.hideSecretLabel}
            onValueChange={onSecretChange}
            onVisibilityChange={() => {
              setShowSecret((currentValue) => !currentValue)
            }}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading || (!password && !hash && !secret)}
          onClick={onReset}
        >
          {messages.resetButtonLabel}
        </Button>
        <Button type="submit" disabled={!canVerify}>
          {loading ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : (
            <Lock data-icon="inline-start" />
          )}
          {loading ? messages.verifyingButtonLabel : messages.verifyButtonLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

type SecretFieldProps = Readonly<{
  id: string
  name: string
  label: string
  description: string
  placeholder: string
  value: string
  visible: boolean
  showLabel: string
  hideLabel: string
  onValueChange: (value: string) => void
  onVisibilityChange: () => void
}>

function SecretField({
  id,
  name,
  label,
  description,
  placeholder,
  value,
  visible,
  showLabel,
  hideLabel,
  onValueChange,
  onVisibilityChange,
}: SecretFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => {
            onValueChange(event.target.value)
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? hideLabel : showLabel}
            onClick={onVisibilityChange}
          >
            {visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}

export { VerificationFormCard }
