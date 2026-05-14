import { useId } from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
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

type SecretInputFieldProps = Readonly<{
  label: string
  description?: string
  placeholder: string
  value: string
  name: string
  visible: boolean
  invalid?: boolean
  showLabel: string
  hideLabel: string
  onChange: (value: string) => void
  onToggleVisibility: () => void
}>

function SecretInputField({
  label,
  description,
  placeholder,
  value,
  name,
  visible,
  invalid = false,
  showLabel,
  hideLabel,
  onChange,
  onToggleVisibility,
}: SecretInputFieldProps) {
  const inputId = useId()
  const visibilityLabel = visible ? hideLabel : showLabel

  return (
    <Field data-invalid={invalid}>
      <FieldContent>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        <InputGroup className="h-11">
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Lock />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id={inputId}
            name={name}
            type={visible ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            value={value}
            placeholder={placeholder}
            aria-invalid={invalid}
            className="font-mono text-sm"
            onChange={(event) => {
              onChange(event.target.value)
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label={visibilityLabel}
              aria-pressed={visible}
              title={visibilityLabel}
              onClick={onToggleVisibility}
            >
              {visible ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </FieldContent>
    </Field>
  )
}

export { SecretInputField }
