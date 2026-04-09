import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"

type JsonEditorCardProps = Readonly<{
  description: string
  errorMessage: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}>

function JsonEditorCard({
  description,
  errorMessage,
  label,
  placeholder,
  value,
  onChange,
}: JsonEditorCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup className="flex-1">
          <Field data-invalid={errorMessage.length > 0 || undefined}>
            <Textarea
              value={value}
              aria-label={label}
              aria-invalid={errorMessage.length > 0}
              spellCheck={false}
              onChange={(event) => {
                onChange(event.target.value)
              }}
              className="min-h-80 flex-1 resize-y font-mono text-sm"
              placeholder={placeholder}
            />
            <FieldError>{errorMessage}</FieldError>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { JsonEditorCard }
