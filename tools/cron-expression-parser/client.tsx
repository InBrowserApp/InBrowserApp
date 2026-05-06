import { useEffect, useMemo, useState } from "react"

import { CronInputCard } from "./components/cron-input-card"
import { CronResultsCard } from "./components/cron-results-card"
import {
  getCronDescription,
  getNextRunTimes,
  parseCronFields,
  validateCronExpression,
} from "./core/cron"

import type { CronExpressionParserClientProps } from "./types"

const DEFAULT_EXPRESSION = "*/5 * * * *"
const STORAGE_KEY = "tools:cron-expression-parser:expression"
const RUN_TIME_COUNT = 10

function getBrowserTimeZoneLabel() {
  if (typeof window === "undefined") {
    return "local time"
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || "local time"
}

function CronExpressionParserClient({
  language,
  messages,
}: CronExpressionParserClientProps) {
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [timeZoneLabel, setTimeZoneLabel] = useState("local time")

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedExpression = window.localStorage.getItem(STORAGE_KEY)

    if (storedExpression !== null) {
      setExpression(storedExpression)
    }

    setTimeZoneLabel(getBrowserTimeZoneLabel())
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, expression)
  }, [expression])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now())
    }, 30_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const validation = validateCronExpression(expression)
  const isValid = validation.state === "valid"
  const description = isValid ? getCronDescription(expression, language) : ""
  const fields = isValid ? parseCronFields(expression) : []
  const runTimes = useMemo(
    () =>
      isValid
        ? getNextRunTimes(expression, {
            count: RUN_TIME_COUNT,
            referenceDate: new Date(nowMs),
          })
        : [],
    [expression, isValid, nowMs]
  )
  const statusText =
    validation.state === "empty"
      ? messages.input.empty
      : validation.state === "invalid"
        ? validation.error
        : messages.input.valid

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <CronInputCard
        expression={expression}
        isValid={isValid}
        messages={messages}
        statusText={statusText}
        onExpressionChange={setExpression}
        onReset={() => {
          setExpression(DEFAULT_EXPRESSION)
        }}
      />
      <CronResultsCard
        description={description}
        fields={fields}
        isValid={isValid}
        language={language}
        messages={messages}
        nowMs={nowMs}
        runTimes={runTimes}
        timeZoneLabel={timeZoneLabel}
        validation={validation}
      />
    </div>
  )
}

export default CronExpressionParserClient
