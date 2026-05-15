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
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { RefreshCcw } from "@workspace/ui/icons"

import type { Argon2HashPasswordPageMessages } from "../client/types"
import type { SaltValidation } from "../core/argon2"

type SaltCardProps = Readonly<{
  saltId: string
  salt: string
  saltValidation: SaltValidation
  messages: Argon2HashPasswordPageMessages
  onSaltChange: (value: string) => void
  onGenerateSalt: () => void
}>

function SaltCard({
  saltId,
  salt,
  saltValidation,
  messages,
  onSaltChange,
  onGenerateSalt,
}: SaltCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.saltLabel}</CardTitle>
        <CardDescription>{messages.saltDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Field className="grid gap-2" data-invalid={saltValidation !== ""}>
          <FieldLabel htmlFor={saltId}>{messages.saltLabel}</FieldLabel>
          <Input
            id={saltId}
            name="salt"
            value={salt}
            placeholder={messages.saltLabel}
            autoComplete="off"
            spellCheck={false}
            className="font-mono text-sm"
            aria-invalid={saltValidation !== ""}
            onChange={(event) => {
              onSaltChange(event.target.value)
            }}
          />
          {saltValidation === "base64" ? (
            <FieldError>{messages.saltInvalidBase64Message}</FieldError>
          ) : null}
          {saltValidation === "tooShort" ? (
            <FieldError>{messages.saltTooShortMessage}</FieldError>
          ) : null}
        </Field>
      </CardContent>
      <CardFooter className="justify-start border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onGenerateSalt}
        >
          <RefreshCcw data-icon="inline-start" />
          {messages.generateSaltLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { SaltCard }
