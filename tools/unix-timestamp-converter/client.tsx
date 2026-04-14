import { useEffect, useEffectEvent, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Clock3 } from "@workspace/ui/icons"

import {
  formatDateTimeLocalInput,
  formatLocalDateTimeDisplay,
  formatRelativeTime,
  parseDateTimeLocalInput,
} from "./core/local-date"
import {
  convertTimestampUnit,
  countTimestampDigits,
  fromMilliseconds,
  parseTimestampInput,
  resolveTimestampUnit,
  toMilliseconds,
} from "./core/timestamp"

import type { TimestampUnit } from "./core/timestamp"
import type { UnixTimestampConverterClientProps } from "./types"

function UnixTimestampConverterClient({
  language,
  messages,
}: UnixTimestampConverterClientProps) {
  const [timestampInput, setTimestampInput] = useState(() => String(Date.now()))
  const [unit, setUnit] = useState<TimestampUnit>("auto")
  const [nowMs, setNowMs] = useState(() => Date.now())

  const tickNow = useEffectEvent(() => {
    setNowMs(Date.now())
  })

  useEffect(() => {
    tickNow()

    const intervalId = window.setInterval(() => {
      tickNow()
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const timestampNumber = parseTimestampInput(timestampInput)
  const isValidTimestamp = timestampNumber !== null
  const effectiveUnit = isValidTimestamp
    ? resolveTimestampUnit(unit, timestampNumber)
    : "milliseconds"
  const digitCount = isValidTimestamp
    ? countTimestampDigits(timestampNumber)
    : 0
  const dateValueMs = isValidTimestamp
    ? toMilliseconds(timestampNumber, effectiveUnit)
    : null
  const localDateDisplay =
    dateValueMs === null
      ? ""
      : formatLocalDateTimeDisplay(dateValueMs, language)
  const isoString =
    dateValueMs === null ? "" : new Date(dateValueMs).toISOString()
  const utcString =
    dateValueMs === null ? "" : new Date(dateValueMs).toUTCString()
  const relativeString =
    dateValueMs === null
      ? "\u2014"
      : formatRelativeTime(dateValueMs, nowMs, language)
  const dateInputValue =
    dateValueMs === null ? "" : formatDateTimeLocalInput(dateValueMs)
  const detailRows: ReadonlyArray<readonly [string, string, boolean]> = [
    [messages.iso8601Label, isoString, true],
    [messages.utcLabel, utcString, true],
    [messages.relativeLabel, relativeString, false],
  ]

  function getUnitLabel(value: TimestampUnit) {
    switch (value) {
      case "auto":
        return messages.autoLabel
      case "seconds":
        return messages.secondsLabel
      case "milliseconds":
        return messages.millisecondsLabel
      case "nanoseconds":
        return messages.nanosecondsLabel
    }
  }

  function handleSetNow() {
    setTimestampInput(String(fromMilliseconds(Date.now(), effectiveUnit)))
  }

  function handleUnitChange(nextUnit: TimestampUnit) {
    if (
      !isValidTimestamp ||
      nextUnit === unit ||
      nextUnit === "auto" ||
      unit === "auto"
    ) {
      setUnit(nextUnit)
      return
    }

    setTimestampInput(
      String(convertTimestampUnit(timestampNumber, unit, nextUnit))
    )
    setUnit(nextUnit)
  }

  function handleDateChange(nextValue: string) {
    if (!isValidTimestamp || nextValue.length === 0) {
      return
    }

    const parsed = parseDateTimeLocalInput(nextValue)

    if (parsed === null) {
      return
    }

    setTimestampInput(String(fromMilliseconds(parsed, effectiveUnit)))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.timestampLabel}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Label htmlFor="unix-timestamp-input">
            {messages.timestampLabel}
          </Label>
          <Input
            id="unix-timestamp-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!isValidTimestamp}
            value={timestampInput}
            onChange={(event) => {
              setTimestampInput(event.target.value)
            }}
            placeholder={messages.timestampPlaceholder}
            className="font-mono text-sm"
          />
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="flex flex-wrap items-center justify-between gap-3 border-t">
          <div className="flex flex-wrap gap-3">
            <ToolCopyButton
              value={timestampInput}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              disabled={!isValidTimestamp}
              variant="ghost"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSetNow}
            >
              <Clock3 data-icon="inline-start" />
              {messages.nowLabel}
            </Button>
          </div>
          {!isValidTimestamp ? (
            <p className="text-sm text-destructive">
              {messages.invalidTimestamp}
            </p>
          ) : null}
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.unitLabel}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={8}
            value={unit}
            aria-label={messages.unitLabel}
            className="flex w-full flex-wrap"
            onValueChange={(value) => {
              if (value) {
                handleUnitChange(value as TimestampUnit)
              }
            }}
          >
            <ToggleGroupItem value="auto">{messages.autoLabel}</ToggleGroupItem>
            <ToggleGroupItem value="seconds">
              {messages.secondsLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="milliseconds">
              {messages.millisecondsLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="nanoseconds">
              {messages.nanosecondsLabel}
            </ToggleGroupItem>
          </ToggleGroup>

          {unit === "auto" && isValidTimestamp ? (
            <p className="mt-auto text-sm text-muted-foreground">
              {messages.detectedLabel}: {getUnitLabel(effectiveUnit)} (
              {new Intl.NumberFormat(language).format(digitCount)}{" "}
              {messages.digitsLabel})
            </p>
          ) : (
            <p className="mt-auto text-sm text-muted-foreground">
              {getUnitLabel(unit)}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.dateTimeLabel}</CardTitle>
        </CardHeader>
        <ToolPanelCardContent className="gap-4">
          <Label htmlFor="unix-date-time-input">{messages.dateTimeLabel}</Label>
          <Input
            id="unix-date-time-input"
            type="datetime-local"
            step="0.001"
            disabled={!isValidTimestamp}
            value={dateInputValue}
            onChange={(event) => {
              handleDateChange(event.target.value)
            }}
          />
          <p className="min-h-12 text-sm text-muted-foreground">
            {localDateDisplay || "\u2014"}
          </p>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-end border-t">
          <ToolCopyButton
            value={localDateDisplay}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            disabled={!isValidTimestamp}
            variant="ghost"
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <ToolPanelCardContent className="gap-4 pt-4">
          {detailRows.map(([label, value, copyable]) => (
            <div
              key={label}
              className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-mono text-sm break-all text-foreground">
                  {value || "\u2014"}
                </p>
              </div>
              {copyable ? (
                <ToolCopyButton
                  value={value}
                  copyLabel={messages.copyLabel}
                  copiedLabel={messages.copiedLabel}
                  disabled={!isValidTimestamp}
                  variant="ghost"
                />
              ) : null}
            </div>
          ))}
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}

export default UnixTimestampConverterClient
