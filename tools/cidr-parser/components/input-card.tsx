import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { CidrParserMessages } from "../types"

type InputCardProps = Readonly<{
  inputId: string
  value: string
  messages: CidrParserMessages
  onChange: (value: string) => void
}>

function InputCard({ inputId, value, messages, onChange }: InputCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-4">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor={inputId}>{messages.inputLabel}</FieldLabel>
            <Input
              id={inputId}
              name="cidr"
              autoComplete="off"
              spellCheck={false}
              value={value}
              placeholder={messages.inputPlaceholder}
              className="h-11 font-mono text-base"
              onChange={(event) => {
                onChange(event.target.value)
              }}
            />
          </FieldContent>
        </Field>

        <div className="rounded-xl border border-dashed border-border/70 bg-transparent p-4">
          <p className="text-sm text-muted-foreground">{messages.inputHint}</p>
          <div className="mt-3 grid gap-2">
            <code className="rounded-md border border-border/70 bg-muted/10 px-3 py-2 font-mono text-sm text-foreground">
              10.24.8.19/21
            </code>
            <code className="rounded-md border border-border/70 bg-muted/10 px-3 py-2 font-mono text-sm text-foreground">
              2001:db8:abcd::123/64
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { InputCard }
