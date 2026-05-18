import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { TriangleAlert } from "@workspace/ui/icons"

type UuidFieldCardProps = Readonly<{
  copyLabel: string
  copiedLabel: string
  copyValue: string
  description: string
  errorMessage: string | null
  id: string
  label: string
  name: string
  onChange: (value: string) => void
  placeholder: string
  title: string
  value: string
}>

function UuidFieldCard({
  copyLabel,
  copiedLabel,
  copyValue,
  description,
  errorMessage,
  id,
  label,
  name,
  onChange,
  placeholder,
  title,
  value,
}: UuidFieldCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Field data-invalid={errorMessage ? true : undefined}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            id={id}
            name={name}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="h-12 font-mono text-sm md:text-base"
            spellCheck={false}
            value={value}
            placeholder={placeholder}
            aria-invalid={errorMessage ? true : undefined}
            onChange={(event) => {
              onChange(event.target.value)
            }}
          />
        </Field>

        {errorMessage ? (
          <div aria-live="polite">
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        ) : null}
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-end border-t">
        <ToolCopyButton
          value={copyValue}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UuidFieldCard }
