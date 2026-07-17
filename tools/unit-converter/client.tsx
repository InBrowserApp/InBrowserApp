import { useEffect, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FileText, Trash2 } from "@workspace/ui/icons"

import { AllUnitsCard } from "./client/all-units-card"
import { CategorySelector } from "./client/category-selector"
import {
  createDefaultUnits,
  DEFAULT_CATEGORY,
  DEFAULT_PRECISION,
  SAMPLE,
} from "./client/constants"
import { ConversionPair } from "./client/conversion-pair"
import { PrecisionControl } from "./client/precision-control"
import { readStoredState, writeStoredState } from "./client/storage"
import { convertByIds, convertToAll } from "./core/convert"
import { formatNumber } from "./core/format"
import { parseNumber } from "./core/parse"
import { DEFAULT_PAIRS, getCategory } from "./core/units"

import type { PrecisionOption, StoredUnits } from "./client/constants"
import type { UnitCategoryId } from "./core/units"
import type { UnitConverterMessages } from "./types"

function UnitConverterClient({
  messages,
  language,
  direction,
}: Readonly<{
  messages: UnitConverterMessages
  language: string
  direction: "ltr" | "rtl"
}>) {
  const [categoryId, setCategoryId] = useState<UnitCategoryId>(DEFAULT_CATEGORY)
  const [units, setUnits] = useState<StoredUnits>(createDefaultUnits)
  const [inputValue, setInputValue] = useState<string>(SAMPLE.value)
  const [precision, setPrecision] = useState<PrecisionOption>(DEFAULT_PRECISION)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)

  useEffect(() => {
    const stored = readStoredState(language)

    if (stored) {
      setCategoryId(stored.category)
      setUnits(stored.units)
      setInputValue(stored.value)
      setPrecision(stored.precision)
    }

    setHasLoadedStorage(true)
  }, [language])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    writeStoredState({
      category: categoryId,
      locale: language,
      units,
      value: inputValue,
      precision,
    })
  }, [categoryId, units, inputValue, precision, hasLoadedStorage, language])

  const category = getCategory(categoryId)!
  const { from: fromUnit, to: toUnit } = units[categoryId]
  const parseResult = parseNumber(inputValue, language)
  const value = parseResult.kind === "valid" ? parseResult.value : undefined
  const invalid = parseResult.kind === "invalid"

  const toRaw =
    value === undefined
      ? undefined
      : convertByIds(categoryId, fromUnit, toUnit, value)
  const outOfRange = toRaw !== undefined && !Number.isFinite(toRaw)
  const toValue =
    toRaw === undefined || outOfRange
      ? ""
      : formatNumber(toRaw, precision, language)
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
    if (outOfRange) {
      return
    }

    patchUnits({ from: toUnit, to: fromUnit })

    if (toRaw !== undefined && Number.isFinite(toRaw)) {
      setInputValue(formatNumber(toRaw, "max", language))
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
    <div className="grid gap-6">
      <ToolPanelCard className="min-w-0">
        <CardHeader className="border-b">
          <CardTitle>{messages.converterTitle}</CardTitle>
          <CardDescription>{messages.converterDescription}</CardDescription>
        </CardHeader>

        <ToolPanelCardContent className="gap-6 py-4">
          <CategorySelector
            direction={direction}
            label={messages.categoryLabel}
            names={messages.categories}
            value={categoryId}
            onChange={handleCategoryChange}
          />

          <ConversionPair
            category={category}
            direction={direction}
            language={language}
            fromLabel={messages.fromLabel}
            toLabel={messages.toLabel}
            fromUnitLabel={messages.fromUnitLabel}
            toUnitLabel={messages.toUnitLabel}
            swapLabel={messages.swapLabel}
            placeholder={messages.valuePlaceholder}
            copyLabel={messages.copyValueLabel}
            copiedLabel={messages.copiedLabel}
            invalidMessage={messages.invalidValueMessage}
            outOfRangeMessage={messages.outOfRangeMessage}
            unitNames={messages.units}
            value={inputValue}
            toValue={toValue}
            fromUnit={fromUnit}
            toUnit={toUnit}
            invalid={invalid}
            outOfRange={outOfRange}
            swapDisabled={outOfRange}
            onValueChange={setInputValue}
            onFromUnitChange={(next) => patchUnits({ from: next })}
            onToUnitChange={(next) => patchUnits({ to: next })}
            onSwap={handleSwap}
          />

          <PrecisionControl
            direction={direction}
            label={messages.precisionLabel}
            optionLabels={messages.precisionOptions}
            value={precision}
            onChange={setPrecision}
          />
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

      <ToolPanelCard className="min-w-0">
        <CardHeader className="border-b">
          <CardTitle>{messages.allUnitsTitle}</CardTitle>
          <CardDescription>{messages.allUnitsDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="py-3">
          <AllUnitsCard
            category={category}
            conversions={conversions}
            language={language}
            precision={precision}
            toUnit={toUnit}
            unitNames={messages.units}
            copyLabel={messages.copyValueLabel}
            copiedLabel={messages.copiedLabel}
            outOfRangeLabel={messages.outOfRangeMessage}
            onSelectUnit={(next) => patchUnits({ to: next })}
          />
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}

export default UnitConverterClient
