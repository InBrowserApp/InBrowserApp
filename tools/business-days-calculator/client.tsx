import { useEffect, useMemo, useState } from "react"

import { RulesCard } from "./components/rules-card"
import { RangeCard } from "./components/range-card"
import { OffsetCard } from "./components/offset-card"
import {
  addDays,
  countBusinessDays,
  normalizeWeekdayList,
  parseHolidayList,
  parseISODateInput,
  shiftBusinessDays,
  startOfLocalDay,
  toISODate,
  weekdayOrder,
} from "./core/business-days"
import {
  STORAGE_KEYS,
  readStoredBoolean,
  readStoredString,
  readStoredWeekdayMode,
  readStoredWeekendDays,
} from "./client/storage"

import type { WeekdayIndex } from "./core/business-days"
import type { BusinessDaysCalculatorMessages } from "./types"

type BusinessDaysCalculatorClientProps = Readonly<{
  messages: BusinessDaysCalculatorMessages
}>

function parseNonNegativeInteger(value: string) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return Math.trunc(parsed)
}

function BusinessDaysCalculatorClient({
  messages,
}: BusinessDaysCalculatorClientProps) {
  const [hasRestoredState, setHasRestoredState] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [baseDate, setBaseDate] = useState("")
  const [dayOffset, setDayOffset] = useState("5")
  const [includeEndpoints, setIncludeEndpoints] = useState(true)
  const [includeStart, setIncludeStart] = useState(false)
  const [weekdayMode, setWeekdayMode] = useState<"weekend" | "working">(
    "weekend"
  )
  const [weekendDays, setWeekendDays] = useState<WeekdayIndex[]>([0, 6])
  const [holidayInput, setHolidayInput] = useState("")

  useEffect(() => {
    const today = startOfLocalDay(new Date())
    const defaultStartDate = toISODate(today)
    const defaultEndDate = toISODate(addDays(today, 14))

    setStartDate(readStoredString(STORAGE_KEYS.startDate, defaultStartDate))
    setEndDate(readStoredString(STORAGE_KEYS.endDate, defaultEndDate))
    setBaseDate(readStoredString(STORAGE_KEYS.baseDate, defaultStartDate))
    setDayOffset(readStoredString(STORAGE_KEYS.dayOffset, "5"))
    setIncludeEndpoints(readStoredBoolean(STORAGE_KEYS.includeEndpoints, true))
    setIncludeStart(readStoredBoolean(STORAGE_KEYS.includeStart, false))
    setWeekdayMode(readStoredWeekdayMode("weekend"))
    setWeekendDays(readStoredWeekendDays([0, 6]))
    setHolidayInput(readStoredString(STORAGE_KEYS.holidayInput, ""))
    setHasRestoredState(true)
  }, [])

  useEffect(() => {
    if (!hasRestoredState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.startDate, startDate)
    window.localStorage.setItem(STORAGE_KEYS.endDate, endDate)
    window.localStorage.setItem(STORAGE_KEYS.baseDate, baseDate)
    window.localStorage.setItem(STORAGE_KEYS.dayOffset, dayOffset)
    window.localStorage.setItem(
      STORAGE_KEYS.includeEndpoints,
      String(includeEndpoints)
    )
    window.localStorage.setItem(STORAGE_KEYS.includeStart, String(includeStart))
    window.localStorage.setItem(STORAGE_KEYS.weekdayMode, weekdayMode)
    window.localStorage.setItem(
      STORAGE_KEYS.weekendDays,
      JSON.stringify(weekendDays)
    )
    window.localStorage.setItem(STORAGE_KEYS.holidayInput, holidayInput)
  }, [
    baseDate,
    dayOffset,
    endDate,
    hasRestoredState,
    holidayInput,
    includeEndpoints,
    includeStart,
    startDate,
    weekdayMode,
    weekendDays,
  ])

  const normalizedWeekendDays = useMemo(
    () => normalizeWeekdayList(weekendDays),
    [weekendDays]
  )
  const weekendSet = useMemo(
    () => new Set<number>(normalizedWeekendDays),
    [normalizedWeekendDays]
  )
  const workingDayCount = 7 - normalizedWeekendDays.length
  const hasWorkingDays = workingDayCount > 0
  const selectedDays = useMemo(
    () =>
      weekdayMode === "weekend"
        ? normalizedWeekendDays
        : weekdayOrder.filter((day) => !weekendSet.has(day)),
    [normalizedWeekendDays, weekdayMode, weekendSet]
  )
  const holidayParse = useMemo(
    () => parseHolidayList(holidayInput),
    [holidayInput]
  )
  const startDateValue = useMemo(
    () => parseISODateInput(startDate),
    [startDate]
  )
  const endDateValue = useMemo(() => parseISODateInput(endDate), [endDate])
  const baseDateValue = useMemo(() => parseISODateInput(baseDate), [baseDate])
  const offsetValue = parseNonNegativeInteger(dayOffset)

  const countResult = useMemo(() => {
    if (!startDateValue || !endDateValue) {
      return null
    }

    return countBusinessDays(startDateValue, endDateValue, {
      weekendDays: weekendSet,
      holidays: holidayParse.dates,
      includeEndpoints,
    })
  }, [
    endDateValue,
    holidayParse.dates,
    includeEndpoints,
    startDateValue,
    weekendSet,
  ])

  const addDate = useMemo(() => {
    if (!baseDateValue || !hasWorkingDays) {
      return ""
    }

    const result = shiftBusinessDays(baseDateValue, offsetValue, {
      weekendDays: weekendSet,
      holidays: holidayParse.dates,
      includeStart,
    })

    return result ? toISODate(result) : ""
  }, [
    baseDateValue,
    hasWorkingDays,
    holidayParse.dates,
    includeStart,
    offsetValue,
    weekendSet,
  ])
  const subtractDate = useMemo(() => {
    if (!baseDateValue || !hasWorkingDays) {
      return ""
    }

    const result = shiftBusinessDays(baseDateValue, -offsetValue, {
      weekendDays: weekendSet,
      holidays: holidayParse.dates,
      includeStart,
    })

    return result ? toISODate(result) : ""
  }, [
    baseDateValue,
    hasWorkingDays,
    holidayParse.dates,
    includeStart,
    offsetValue,
    weekendSet,
  ])

  function handleSelectedDaysChange(values: WeekdayIndex[]) {
    const normalized = normalizeWeekdayList(values)

    setWeekendDays(
      weekdayMode === "weekend"
        ? normalized
        : weekdayOrder.filter((day) => !normalized.includes(day))
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <RulesCard
        messages={messages}
        weekdayMode={weekdayMode}
        selectedDays={selectedDays}
        holidayInput={holidayInput}
        holidayInvalidCount={holidayParse.invalid.length}
        hasWorkingDays={hasWorkingDays}
        workingDayCount={workingDayCount}
        holidayCount={holidayParse.dates.size}
        onWeekdayModeChange={setWeekdayMode}
        onSelectedDaysChange={handleSelectedDaysChange}
        onHolidayInputChange={setHolidayInput}
      />

      <div className="grid gap-6">
        <RangeCard
          messages={messages}
          startDate={startDate}
          endDate={endDate}
          includeEndpoints={includeEndpoints}
          result={countResult}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onIncludeEndpointsChange={setIncludeEndpoints}
        />

        <OffsetCard
          messages={messages}
          baseDate={baseDate}
          dayOffset={dayOffset}
          includeStart={includeStart}
          hasWorkingDays={hasWorkingDays}
          addDate={addDate}
          subtractDate={subtractDate}
          onBaseDateChange={setBaseDate}
          onDayOffsetChange={setDayOffset}
          onIncludeStartChange={setIncludeStart}
        />
      </div>
    </div>
  )
}

export default BusinessDaysCalculatorClient
