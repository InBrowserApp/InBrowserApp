import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Input } from "@workspace/ui/components/ui/input"

type BaseFieldProps = Readonly<{
  copiedLabel: string
  copyLabel: string
  id: string
  invalidDescription: string
  isInvalid: boolean
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}>

function BaseField({
  copiedLabel,
  copyLabel,
  id,
  invalidDescription,
  isInvalid,
  label,
  onChange,
  placeholder,
  value,
}: BaseFieldProps) {
  return (
    <div className="grid gap-2 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
        </label>
        <ToolCopyButton
          copiedLabel={copiedLabel}
          copyLabel={copyLabel}
          value={value}
          variant="ghost"
        />
      </div>

      <Input
        aria-invalid={isInvalid}
        autoComplete="off"
        className="h-10 font-mono text-sm"
        id={id}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        placeholder={placeholder}
        spellCheck={false}
        value={value}
      />

      <p
        aria-live="polite"
        className={
          isInvalid
            ? "min-h-4 text-xs text-destructive"
            : "min-h-4 text-xs text-muted-foreground"
        }
      >
        {isInvalid ? invalidDescription : ""}
      </p>
    </div>
  )
}

export { BaseField }
