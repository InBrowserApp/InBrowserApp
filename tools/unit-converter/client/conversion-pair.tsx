import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { ArrowLeftRight } from "@workspace/ui/icons"

import { UnitSelect } from "./unit-select"

import type { UnitCategory } from "../core/units"

type ConversionPairProps = Readonly<{
  category: UnitCategory
  copiedLabel: string
  copyLabel: string
  fromLabel: string
  fromUnit: string
  fromUnitLabel: string
  invalid: boolean
  onFromUnitChange: (unitId: string) => void
  onSwap: () => void
  onToUnitChange: (unitId: string) => void
  onValueChange: (value: string) => void
  placeholder: string
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

  return (
    <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
      <div className="grid gap-2">
        <Label htmlFor={fromId}>{props.fromLabel}</Label>
        <Input
          id={fromId}
          value={props.value}
          inputMode="decimal"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-invalid={props.invalid || undefined}
          className="h-11 font-mono text-base"
          placeholder={props.placeholder}
          onChange={(event) => {
            props.onValueChange(event.target.value)
          }}
        />
        <UnitSelect
          ariaLabel={props.fromUnitLabel}
          category={props.category}
          unitNames={props.unitNames}
          value={props.fromUnit}
          onChange={props.onFromUnitChange}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={props.swapLabel}
        title={props.swapLabel}
        className="mb-1 self-center sm:self-end"
        onClick={props.onSwap}
      >
        <ArrowLeftRight />
      </Button>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={toId}>{props.toLabel}</Label>
          <ToolCopyButton
            value={props.toValue}
            copyLabel={props.copyLabel}
            copiedLabel={props.copiedLabel}
            variant="ghost"
          />
        </div>
        <Input
          id={toId}
          value={props.toValue}
          readOnly
          className="h-11 font-mono text-base"
        />
        <UnitSelect
          ariaLabel={props.toUnitLabel}
          category={props.category}
          unitNames={props.unitNames}
          value={props.toUnit}
          onChange={props.onToUnitChange}
        />
      </div>
    </div>
  )
}

export { ConversionPair }
