import { useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ArrowLeftRight } from "@workspace/ui/icons"

import { UnitSelect } from "./unit-select"

import type { UnitCategory } from "../core/units"

type ConversionPairProps = Readonly<{
  category: UnitCategory
  copiedLabel: string
  copyLabel: string
  direction: "ltr" | "rtl"
  fromLabel: string
  fromUnit: string
  fromUnitLabel: string
  invalid: boolean
  invalidMessage: string
  language: string
  onFromUnitChange: (unitId: string) => void
  onSwap: () => void
  onToUnitChange: (unitId: string) => void
  onValueChange: (value: string) => void
  placeholder: string
  outOfRange: boolean
  outOfRangeMessage: string
  swapDisabled: boolean
  swapLabel: string
  toLabel: string
  toUnit: string
  toUnitLabel: string
  toValue: string
  unitNames: Readonly<Record<string, string>>
  value: string
}>

function ConversionPair(props: ConversionPairProps) {
  const fromId = useId()
  const toId = useId()
  const errorId = useId()
  const toLabelId = useId()
  const [hasBlurred, setHasBlurred] = useState(false)
  const showInvalid = props.invalid && hasBlurred
  const outputDisplay = props.outOfRange
    ? props.outOfRangeMessage
    : props.toValue
  const outputAnnouncement = outputDisplay
    ? `${props.unitNames[props.toUnit]}: ${outputDisplay}`
    : ""

  return (
    <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <Field data-invalid={showInvalid}>
        <div className="flex h-8 items-center">
          <FieldLabel htmlFor={fromId}>{props.fromLabel}</FieldLabel>
        </div>
        <Input
          id={fromId}
          name="source-value"
          value={props.value}
          lang={props.language}
          dir="ltr"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-describedby={showInvalid ? errorId : undefined}
          aria-errormessage={showInvalid ? errorId : undefined}
          aria-invalid={showInvalid || undefined}
          className="h-11 font-mono text-base [unicode-bidi:isolate]"
          placeholder={props.placeholder}
          onChange={(event) => {
            props.onValueChange(event.target.value)
          }}
          onBlur={() => {
            setHasBlurred(true)
          }}
        />
        <FieldError id={errorId}>
          {showInvalid ? props.invalidMessage : null}
        </FieldError>
        <UnitSelect
          ariaLabel={props.fromUnitLabel}
          category={props.category}
          direction={props.direction}
          unitNames={props.unitNames}
          value={props.fromUnit}
          onChange={props.onFromUnitChange}
        />
      </Field>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={props.swapLabel}
        title={props.swapLabel}
        disabled={props.swapDisabled}
        className="rotate-90 self-center justify-self-center sm:rotate-0"
        onClick={props.onSwap}
      >
        <ArrowLeftRight />
      </Button>

      <Field>
        <div className="flex h-8 items-center justify-between gap-3">
          <FieldLabel id={toLabelId} htmlFor={toId}>
            {props.toLabel}
          </FieldLabel>
          <ToolCopyButton
            value={props.toValue}
            copyLabel={props.copyLabel}
            copiedLabel={props.copiedLabel}
            variant="ghost"
          />
        </div>
        <output
          id={toId}
          role="status"
          aria-atomic="true"
          aria-labelledby={toLabelId}
          aria-live="polite"
          className="block h-11 min-w-0 overflow-x-auto rounded-lg border border-input bg-transparent px-2.5 py-2.5 font-mono text-base leading-5 whitespace-nowrap tabular-nums dark:bg-input/30"
        >
          <span className="sr-only">{outputAnnouncement}</span>
          <span
            aria-hidden="true"
            data-output-value
            className="[unicode-bidi:isolate]"
            dir={props.outOfRange ? props.direction : "ltr"}
            translate={props.outOfRange ? undefined : "no"}
          >
            {outputDisplay}
          </span>
        </output>
        <UnitSelect
          ariaLabel={props.toUnitLabel}
          category={props.category}
          direction={props.direction}
          unitNames={props.unitNames}
          value={props.toUnit}
          onChange={props.onToUnitChange}
        />
      </Field>
    </div>
  )
}

export { ConversionPair }
