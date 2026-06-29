import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"

import { formatNumber } from "../core/format"

import type { PrecisionOption } from "../core/format"
import type { AllConversions } from "../core/convert"
import type { UnitCategory } from "../core/units"

type AllUnitsCardProps = Readonly<{
  category: UnitCategory
  conversions: AllConversions
  copiedLabel: string
  copyLabel: string
  onSelectUnit: (unitId: string) => void
  precision: PrecisionOption
  toUnit: string
  unitNames: Readonly<Record<string, string>>
}>

function AllUnitsCard({
  category,
  conversions,
  copiedLabel,
  copyLabel,
  onSelectUnit,
  precision,
  toUnit,
  unitNames,
}: AllUnitsCardProps) {
  return (
    <ul className="grid gap-1">
      {category.units.map((unit) => {
        const raw = conversions[unit.id]
        const display = raw === undefined ? "" : formatNumber(raw, precision)
        const isActive = unit.id === toUnit

        return (
          <li
            key={unit.id}
            className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/40 data-[active=true]:border-border data-[active=true]:bg-muted/60"
            data-active={isActive}
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-baseline gap-2 text-left"
              onClick={() => {
                onSelectUnit(unit.id)
              }}
            >
              <span className="min-w-0 truncate text-sm">
                {unitNames[unit.id]}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {unit.symbol}
              </span>
            </button>
            <span className="font-mono text-sm tabular-nums">{display}</span>
            <ToolCopyButton
              value={display}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              variant="ghost"
            />
          </li>
        )
      })}
    </ul>
  )
}

export { AllUnitsCard }
