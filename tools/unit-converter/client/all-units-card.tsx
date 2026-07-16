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
  outOfRangeLabel: string
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
  outOfRangeLabel,
  precision,
  toUnit,
  unitNames,
}: AllUnitsCardProps) {
  return (
    <ul className="grid gap-1">
      {category.units.map((unit) => {
        const raw = conversions[unit.id]
        const isOutOfRange = raw !== undefined && !Number.isFinite(raw)
        const display =
          raw === undefined
            ? ""
            : isOutOfRange
              ? outOfRangeLabel
              : formatNumber(raw, precision)
        const copyValue = isOutOfRange ? "" : display
        const isActive = unit.id === toUnit

        return (
          <li
            key={unit.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 rounded-lg border border-transparent px-2 py-2 transition-colors focus-within:border-border focus-within:bg-muted/40 hover:border-border hover:bg-muted/40 data-[active=true]:border-border data-[active=true]:bg-muted/60 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            data-active={isActive}
          >
            <button
              type="button"
              aria-pressed={isActive}
              className="col-span-2 flex min-w-0 items-baseline gap-2 rounded-sm text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:col-span-1"
              onClick={() => {
                onSelectUnit(unit.id)
              }}
            >
              <span className="min-w-0 truncate text-sm">
                {unitNames[unit.id]}
              </span>
              <bdi
                dir="ltr"
                className="shrink-0 font-mono text-xs text-muted-foreground"
              >
                {unit.symbol}
              </bdi>
            </button>
            <span
              className="min-w-0 overflow-x-auto font-mono text-sm whitespace-nowrap tabular-nums [unicode-bidi:isolate] sm:text-end"
              dir={isOutOfRange ? undefined : "ltr"}
              translate={isOutOfRange ? undefined : "no"}
            >
              {display}
            </span>
            <ToolCopyButton
              value={copyValue}
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              ariaLabel={`${copyLabel}: ${unitNames[unit.id]}`}
              size="icon-sm"
              variant="ghost"
            />
          </li>
        )
      })}
    </ul>
  )
}

export { AllUnitsCard }
