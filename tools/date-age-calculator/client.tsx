import { useEffect, useState } from "react"

import {
  calendarDayDifference,
  parseISODateInput,
  shiftCalendarDays,
  toISODate,
  toLocalISODate,
} from "@workspace/calendar-date"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"

import { CalendarField, CalendarResult } from "./components"
import { ageInFullYears, parseDayCount } from "./core/date-age"

import type { DateAgeMessages } from "./messages"
import type { ReactNode } from "react"

type CalculatorProps = Readonly<{
  lang: string
  messages: DateAgeMessages
}>

type PanelProps = Readonly<{
  mode: string
  hint: string
  children: ReactNode
  results: ReactNode
}>

const modes = [
  ["difference", "differenceTab"],
  ["offset", "offsetTab"],
  ["age", "ageTab"],
] as const

function CalculationPanel({ mode, hint, children, results }: PanelProps) {
  return (
    <TabsContent value={mode}>
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">{children}</div>
          <p className="text-sm text-muted-foreground">{hint}</p>
          <div className="grid gap-3 sm:auto-cols-fr sm:grid-flow-col">
            {results}
          </div>
        </ToolPanelCardContent>
      </ToolPanelCard>
    </TabsContent>
  )
}

function DateAgeCalculator({ lang, messages }: CalculatorProps) {
  const [today, setToday] = useState("")
  const [startInput, setStart] = useState<string>()
  const [endInput, setEnd] = useState<string>()
  const [baseInput, setBase] = useState<string>()
  const [dayCount, setDayCount] = useState("7")
  const [birthDate, setBirthDate] = useState("")

  useEffect(() => {
    function updateToday() {
      setToday(toLocalISODate(new Date()))
    }

    updateToday()
    const timer = window.setInterval(updateToday, 60_000)
    window.addEventListener("focus", updateToday)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener("focus", updateToday)
    }
  }, [])

  const todayDate = parseISODateInput(today)
  const defaultEnd = todayDate ? shiftCalendarDays(todayDate, 7) : null
  const start = startInput ?? today
  const end = endInput ?? (defaultEnd ? toISODate(defaultEnd) : today)
  const base = baseInput ?? today
  const startDate = parseISODateInput(start)
  const endDate = parseISODateInput(end)
  const baseDate = parseISODateInput(base)
  const birth = parseISODateInput(birthDate)
  const days = parseDayCount(dayCount)

  const difference =
    startDate && endDate ? calendarDayDifference(startDate, endDate) : null
  const offsets =
    baseDate && days !== null
      ? {
          after: shiftCalendarDays(baseDate, days),
          before: shiftCalendarDays(baseDate, -days),
        }
      : null
  const age = birth && todayDate ? ageInFullYears(birth, todayDate) : null
  const birthDateError =
    birthDate && !birth
      ? messages.invalidDate
      : birth && todayDate && age === null
        ? messages.futureBirthDate
        : undefined
  return (
    <Tabs
      defaultValue="difference"
      dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
      className="gap-3"
    >
      <TabsList
        aria-label={messages.modeLabel}
        className="grid w-full grid-cols-3 group-data-[orientation=horizontal]/tabs:h-auto"
      >
        {modes.map(([value, label]) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-full min-h-11 min-w-0 px-1.5 py-2 text-center break-words whitespace-normal sm:px-3"
          >
            {messages[label]}
          </TabsTrigger>
        ))}
      </TabsList>

      <CalculationPanel
        mode="difference"
        hint={messages.differenceHint}
        results={
          <CalendarResult
            label={messages.differenceResult}
            value={difference}
            lang={lang}
            messages={messages}
          />
        }
      >
        <CalendarField
          label={messages.startDate}
          value={start}
          onChange={setStart}
          error={start && !startDate ? messages.invalidDate : undefined}
        />
        <CalendarField
          label={messages.endDate}
          value={end}
          onChange={setEnd}
          error={end && !endDate ? messages.invalidDate : undefined}
        />
      </CalculationPanel>

      <CalculationPanel
        mode="offset"
        hint={messages.offsetHint}
        results={
          <>
            <CalendarResult
              label={messages.afterResult}
              value={offsets?.after ? toISODate(offsets.after) : null}
              lang={lang}
              unavailable={
                offsets && !offsets.after ? messages.outOfRange : undefined
              }
              messages={messages}
            />
            <CalendarResult
              label={messages.beforeResult}
              value={offsets?.before ? toISODate(offsets.before) : null}
              lang={lang}
              unavailable={
                offsets && !offsets.before ? messages.outOfRange : undefined
              }
              messages={messages}
            />
          </>
        }
      >
        <CalendarField
          label={messages.baseDate}
          value={base}
          onChange={setBase}
          error={base && !baseDate ? messages.invalidDate : undefined}
        />
        <CalendarField
          label={messages.dayCount}
          type="days"
          value={dayCount}
          onChange={setDayCount}
          error={
            dayCount && days === null ? messages.invalidDayCount : undefined
          }
        />
      </CalculationPanel>

      <CalculationPanel
        mode="age"
        hint={messages.ageHint}
        results={
          <CalendarResult
            label={messages.ageResult}
            value={age}
            lang={lang}
            messages={messages}
          />
        }
      >
        <CalendarField
          label={messages.birthDate}
          value={birthDate}
          onChange={setBirthDate}
          max={today || undefined}
          error={birthDateError}
        />
        <CalendarField label={messages.today} value={today} />
      </CalculationPanel>
    </Tabs>
  )
}

export default DateAgeCalculator
