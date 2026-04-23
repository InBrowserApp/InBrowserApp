import { BaseField } from "./base-field"

import type { BaseFieldId } from "../core/number-base"

type BaseSectionItem = Readonly<{
  field: BaseFieldId
  id: string
  inputMode?: "decimal" | "numeric" | "text"
  label: string
  placeholder: string
}>

type BaseSectionProps = Readonly<{
  copyLabel: string
  copiedLabel: string
  description: string
  invalidField?: BaseFieldId
  items: readonly BaseSectionItem[]
  onChange: (field: BaseFieldId, value: string) => void
  title: string
  values: Record<BaseFieldId, string>
}>

function BaseSection({
  copyLabel,
  copiedLabel,
  description,
  invalidField,
  items,
  onChange,
  title,
  values,
}: BaseSectionProps) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <BaseField
            key={item.field}
            id={item.id}
            label={item.label}
            placeholder={item.placeholder}
            value={values[item.field]}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            inputMode={item.inputMode}
            invalid={invalidField === item.field}
            onChange={(value) => {
              onChange(item.field, value)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export { BaseSection }
export type { BaseSectionItem }
