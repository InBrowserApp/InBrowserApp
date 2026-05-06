import { useId } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { cn } from "@workspace/ui/lib/utils"

import {
  formatCronField,
  getCronFieldConfig,
  normalizeCronFieldState,
  type CronFieldMode,
  type CronFieldName,
  type CronFieldState,
} from "../core/cron"
import {
  formatCronFieldSummary,
  getFieldLabel,
  getFieldOptions,
} from "./format"

import type { CronExpressionGeneratorMessages } from "../types"

type CronFieldCardProps = Readonly<{
  fieldName: CronFieldName
  messages: CronExpressionGeneratorMessages
  state: CronFieldState
  onChange: (state: CronFieldState) => void
}>

const MODE_VALUES: CronFieldMode[] = ["every", "interval", "specific", "range"]

function CronFieldCard({
  fieldName,
  messages,
  state,
  onChange,
}: CronFieldCardProps) {
  const modeId = useId()
  const intervalId = useId()
  const config = getCronFieldConfig(fieldName)
  const normalized = normalizeCronFieldState(fieldName, state)
  const options = getFieldOptions(messages, fieldName)
  const fieldLabel = getFieldLabel(messages, fieldName)
  const summary = formatCronFieldSummary(messages, fieldName, normalized)

  function updateField(patch: Partial<CronFieldState>) {
    onChange(
      normalizeCronFieldState(fieldName, {
        ...normalized,
        ...patch,
      })
    )
  }

  function setSpecificValue(value: number, checked: boolean) {
    const values = new Set(normalized.specificValues)

    if (checked) {
      values.add(value)
    } else {
      values.delete(value)
    }

    updateField({ specificValues: [...values] })
  }

  return (
    <>
      <CardHeader className="border-b">
        <CardTitle className="flex flex-wrap items-center gap-2">
          {fieldLabel}
          <Badge variant="outline" className="font-mono">
            {formatCronField(fieldName, normalized)}
          </Badge>
        </CardTitle>
        <CardDescription>
          {messages.fields.descriptions[fieldName]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">
              {messages.fields.modeLabel}
            </FieldLegend>
            <ToggleGroup
              id={modeId}
              type="single"
              variant="outline"
              value={normalized.mode}
              className="w-full"
              onValueChange={(value) => {
                if (MODE_VALUES.includes(value as CronFieldMode)) {
                  updateField({ mode: value as CronFieldMode })
                }
              }}
            >
              {MODE_VALUES.map((mode) => (
                <ToggleGroupItem
                  key={mode}
                  value={mode}
                  aria-label={messages.fields[mode]}
                  className="min-w-0 flex-1 basis-0 overflow-hidden"
                >
                  <span className="min-w-0 truncate">
                    {messages.fields[mode]}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldDescription>{summary}</FieldDescription>
          </FieldSet>

          {normalized.mode === "interval" ? (
            <Field>
              <FieldLabel htmlFor={intervalId}>
                {messages.fields.intervalPrefix}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id={intervalId}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={config.max - config.min + 1}
                  value={normalized.interval}
                  className="max-w-28"
                  onChange={(event) => {
                    updateField({ interval: Number(event.target.value) })
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {messages.fields.units[config.unit]}
                </span>
              </div>
            </Field>
          ) : null}

          {normalized.mode === "specific" ? (
            <FieldSet>
              <FieldLegend variant="label">{fieldLabel}</FieldLegend>
              <div className={cn("grid gap-2", config.gridColumns)}>
                {options.map((option) => {
                  const checkboxId = `${fieldName}-${option.value}`
                  const checked = normalized.specificValues.includes(
                    option.value
                  )

                  return (
                    <label
                      key={option.value}
                      htmlFor={checkboxId}
                      className={cn(
                        "flex h-8 min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2 text-sm transition-colors",
                        checked && "border-primary/40 bg-primary/5"
                      )}
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={(value) => {
                          setSpecificValue(option.value, value === true)
                        }}
                      />
                      <span className="min-w-0 truncate">{option.label}</span>
                    </label>
                  )
                })}
              </div>
              {normalized.specificValues.length === 0 ? (
                <FieldDescription>
                  {messages.fields.specificEmpty}
                </FieldDescription>
              ) : null}
            </FieldSet>
          ) : null}

          {normalized.mode === "range" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <RangeSelect
                label={messages.fields.rangeStartLabel}
                value={normalized.rangeStart}
                options={options}
                onChange={(rangeStart) => {
                  updateField({ rangeStart })
                }}
              />
              <RangeSelect
                label={messages.fields.rangeEndLabel}
                value={normalized.rangeEnd}
                options={options}
                onChange={(rangeEnd) => {
                  updateField({ rangeEnd })
                }}
              />
            </div>
          ) : null}
        </FieldGroup>
      </CardContent>
    </>
  )
}

type RangeSelectProps = Readonly<{
  label: string
  value: number
  options: Array<{ value: number; label: string }>
  onChange: (value: number) => void
}>

function RangeSelect({ label, value, options, onChange }: RangeSelectProps) {
  const selectId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={selectId}>{label}</FieldLabel>
      <Select
        value={String(value)}
        onValueChange={(nextValue) => {
          onChange(Number(nextValue))
        }}
      >
        <SelectTrigger id={selectId} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export { CronFieldCard }
