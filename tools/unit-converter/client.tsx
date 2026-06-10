import { useEffect, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FileText, Trash2, TriangleAlert } from "@workspace/ui/icons"

import { AllUnitsCard } from "./client/all-units-card"
import { CategorySelector } from "./client/category-selector"
import {
  createDefaultUnits,
  DEFAULT_CATEGORY,
  DEFAULT_PRECISION,
  SAMPLE,
  STORAGE_KEYS,
} from "./client/constants"
import { ConversionPair } from "./client/conversion-pair"
import { PrecisionControl } from "./client/precision-control"
import { convertByIds, convertToAll } from "./core/convert"
import { formatNumber, PRECISION_OPTIONS } from "./core/format"
import { parseNumber } from "./core/parse"
import { DEFAULT_PAIRS, getCategory } from "./core/units"

import type { PrecisionOption, StoredUnits } from "./client/constants"
import type { UnitCategoryId } from "./core/units"
import type { UnitConverterMessages } from "./types"

function readStored(): Partial<{
  category: UnitCategoryId
  units: StoredUnits
  value: string
  precision: PrecisionOption
}> {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return {}
  }

  const parsed: ReturnType<typeof readStored> = {}
  const category = window.localStorage.getItem(STORAGE_KEYS.category)

  if (category && getCategory(category)) {
    parsed.category = category as UnitCategoryId
  }

  const value = window.localStorage.getItem(STORAGE_KEYS.value)

  if (value !== null) {
    parsed.value = value
  }

  const precision = window.localStorage.getItem(STORAGE_KEYS.precision)

  if (precision && PRECISION_OPTIONS.includes(precision as PrecisionOption)) {
    parsed.precision = precision as PrecisionOption
  }

  const units = window.localStorage.getItem(STORAGE_KEYS.units)

  if (units) {
    try {
      parsed.units = { ...createDefaultUnits(), ...JSON.parse(units) }
    } catch {
      /* v8 ignore next */
      parsed.units = undefined
    }
  }

  return parsed
}

function UnitConverterClient({
  messages,
}: Readonly<{ messages: UnitConverterMessages }>) {
  const [categoryId, setCategoryId] = useState<UnitCategoryId>(DEFAULT_CATEGORY)
  const [units, setUnits] = useState<StoredUnits>(createDefaultUnits)
  const [inputValue, setInputValue] = useState<string>(SAMPLE.value)
  const [precision, setPrecision] = useState<PrecisionOption>(DEFAULT_PRECISION)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    const stored = readStored()

    if (stored.category) {
      setCategoryId(stored.category)
    }
    if (stored.units) {
      setUnits(stored.units)
    }
    if (stored.value !== undefined) {
      setInputValue(stored.value)
    }
    if (stored.precision) {
      setPrecision(stored.precision)
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.category, categoryId)
    window.localStorage.setItem(STORAGE_KEYS.units, JSON.stringify(units))
    window.localStorage.setItem(STORAGE_KEYS.value, inputValue)
    window.localStorage.setItem(STORAGE_KEYS.precision, precision)
  }, [categoryId, units, inputValue, precision, hasLoadedStorage])

  const category = getCategory(categoryId)!
  const { from: fromUnit, to: toUnit } = units[categoryId]
  const parseResult = parseNumber(inputValue)
  const value = parseResult.kind === "valid" ? parseResult.value : undefined
  const invalid = parseResult.kind === "invalid"

  const toRaw =
    value === undefined
      ? undefined
      : convertByIds(categoryId, fromUnit, toUnit, value)
  const toValue = toRaw === undefined ? "" : formatNumber(toRaw, precision)
  const conversions =
    value === undefined ? {} : convertToAll(category, fromUnit, value)

  function patchUnits(patch: Readonly<{ from?: string; to?: string }>) {
    setUnits((current) => ({
      ...current,
      [categoryId]: { ...current[categoryId], ...patch },
    }))
  }

  function handleCategoryChange(next: UnitCategoryId) {
    setCategoryId(next)
  }

  function handleSwap() {
    patchUnits({ from: toUnit, to: fromUnit })

    if (toRaw !== undefined) {
      setInputValue(formatNumber(toRaw, "max"))
    }
  }

  function handleLoadSample() {
    setCategoryId(SAMPLE.category)
    setUnits((current) => ({
      ...current,
      [SAMPLE.category]: { ...DEFAULT_PAIRS[SAMPLE.category] },
    }))
    setInputValue(SAMPLE.value)
    setPrecision(DEFAULT_PRECISION)
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.converterTitle}</CardTitle>
        <CardDescription>{messages.converterDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <CategorySelector
          label={messages.categoryLabel}
          names={messages.categories}
          value={categoryId}
          onChange={handleCategoryChange}
        />

        <ConversionPair
          category={category}
          fromLabel={messages.fromLabel}
          toLabel={messages.toLabel}
          fromUnitLabel={messages.fromUnitLabel}
          toUnitLabel={messages.toUnitLabel}
          swapLabel={messages.swapLabel}
          placeholder={messages.valuePlaceholder}
          copyLabel={messages.copyValueLabel}
          copiedLabel={messages.copiedLabel}
          unitNames={messages.units}
          value={inputValue}
          toValue={toValue}
          fromUnit={fromUnit}
          toUnit={toUnit}
          invalid={invalid}
          onValueChange={setInputValue}
          onFromUnitChange={(next) => patchUnits({ from: next })}
          onToUnitChange={(next) => patchUnits({ to: next })}
          onSwap={handleSwap}
        />

        <PrecisionControl
          label={messages.precisionLabel}
          optionLabels={messages.precisionOptions}
          value={precision}
          onChange={setPrecision}
        />

        {invalid ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{messages.invalidValueMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-2 rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium">{messages.allUnitsTitle}</p>
            <p className="text-sm text-muted-foreground">
              {messages.allUnitsDescription}
            </p>
          </div>
          <AllUnitsCard
            category={category}
            conversions={conversions}
            precision={precision}
            toUnit={toUnit}
            unitNames={messages.units}
            copyLabel={messages.copyValueLabel}
            copiedLabel={messages.copiedLabel}
            onSelectUnit={(next) => patchUnits({ to: next })}
          />
        </div>
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-start gap-3 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLoadSample}
        >
          <FileText data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setInputValue("")
          }}
        >
          <Trash2 data-icon="inline-start" />
          {messages.clearAllLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export default UnitConverterClient
