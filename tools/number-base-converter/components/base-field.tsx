import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

type BaseFieldProps = Readonly<{
  copyLabel: string
  copiedLabel: string
  errorMessage?: string
  id: string
  inputMode?: "decimal" | "numeric" | "text"
  invalid?: boolean
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}>

function BaseField({
  copyLabel,
  copiedLabel,
  errorMessage,
  id,
  inputMode = "text",
  invalid = false,
  label,
  onChange,
  placeholder,
  value,
}: BaseFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <ToolCopyButton
          value={value}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          variant="ghost"
        />
      </div>

      <Input
        id={id}
        value={value}
        inputMode={inputMode}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        aria-invalid={invalid || undefined}
        className="h-11 font-mono text-base"
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}

export { BaseField }
