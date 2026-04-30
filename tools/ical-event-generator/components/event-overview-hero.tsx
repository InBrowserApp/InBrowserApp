import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"
import { FileText, Globe, RefreshCcw, Sparkles } from "@workspace/ui/icons"

import type { IcalEventGeneratorMessages } from "../types"
import type { IcalEventFormState } from "../core/form-state"
import {
  formatDateLabel,
  formatDateParts,
  formatTimeLabel,
} from "./event-date-format"

type EventOverviewHeroProps = Readonly<{
  language: string
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  onUseSample: () => void
  onReset: () => void
}>

function getFrequencyBadgeLabel(
  messages: IcalEventGeneratorMessages,
  formState: IcalEventFormState
) {
  switch (formState.recurrenceFrequency) {
    case "daily":
      return messages.recurrence.dailyLabel
    case "weekly":
      return messages.recurrence.weeklyLabel
    case "monthly":
      return messages.recurrence.monthlyLabel
    case "yearly":
      return messages.recurrence.yearlyLabel
    case "none":
      return messages.recurrence.noneLabel
  }
}

function getOutputModeLabel(
  messages: IcalEventGeneratorMessages,
  formState: IcalEventFormState
) {
  return formState.outputMode === "utc"
    ? messages.schedule.outputUtcLabel
    : messages.schedule.outputTzidLabel
}

function getDisplayUrl(url: string) {
  if (!url.trim()) {
    return ""
  }

  try {
    return new URL(url).hostname.replace(/^www\./u, "")
  } catch {
    return url
  }
}

function EventOverviewHero({
  language,
  messages,
  formState,
  onUseSample,
  onReset,
}: EventOverviewHeroProps) {
  const title = formState.title.trim()
  const description = formState.description.trim()
  const location = formState.location.trim()
  const displayUrl = getDisplayUrl(formState.url)
  const startDate = formatDateLabel(formState.startDate, language)
  const endDate = formatDateLabel(formState.endDate, language)
  const startTime = formState.isAllDay
    ? messages.schedule.allDayLabel
    : formatTimeLabel(formState.startTime, language)
  const endTime = formState.isAllDay
    ? messages.schedule.allDayLabel
    : formatTimeLabel(formState.endTime, language)
  const dateParts = formatDateParts(formState.startDate, language)
  const metaItems = [
    {
      Icon: FileText,
      label: messages.schedule.outputModeLabel,
      shouldTranslate: true,
      value: getOutputModeLabel(messages, formState),
    },
    {
      Icon: RefreshCcw,
      label: messages.recurrence.frequencyLabel,
      shouldTranslate: true,
      value: getFrequencyBadgeLabel(messages, formState),
    },
    {
      Icon: Globe,
      label: messages.schedule.timeZoneLabel,
      shouldTranslate: false,
      value: formState.timeZone,
    },
  ] as const

  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(13rem,16rem)_minmax(0,1fr)]">
      <div className="rounded-[1.5rem] border bg-card p-4 shadow-xs">
        <p className="text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {messages.schedule.startDateLabel}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary uppercase">
              {dateParts.month}
            </p>
            <p className="font-heading text-6xl leading-none tracking-tight">
              {dateParts.day}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{dateParts.weekday}</p>
            <p>{dateParts.year}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2 rounded-[1.15rem] border bg-muted/20 p-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="size-2 rounded-full bg-primary" />
              <span className="h-10 w-px bg-border" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {messages.schedule.startTimeLabel}
              </p>
              <p className="mt-1 text-sm font-medium">{startTime}</p>
              <p className="truncate text-xs text-muted-foreground">
                {startDate}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex justify-center pt-1">
              <span className="size-2 rounded-full bg-sky-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {messages.schedule.endTimeLabel}
              </p>
              <p className="mt-1 text-sm font-medium">{endTime}</p>
              <p className="truncate text-xs text-muted-foreground">
                {endDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-5 rounded-[1.5rem] border bg-card p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              {messages.meta.name}
            </p>
            <h2
              className={cn(
                "font-heading text-2xl tracking-[var(--tracking-display)] text-balance sm:text-3xl",
                "[overflow-wrap:anywhere] break-words",
                !title && "text-muted-foreground"
              )}
            >
              {title || messages.details.summaryPlaceholder}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {description || messages.meta.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={onUseSample}>
              <Sparkles data-icon="inline-start" />
              {messages.actions.useSample}
            </Button>
            <Button type="button" variant="ghost" onClick={onReset}>
              <RefreshCcw data-icon="inline-start" />
              {messages.actions.reset}
            </Button>
          </div>
        </div>

        {location || displayUrl ? (
          <div className="flex flex-wrap gap-2">
            {location ? (
              <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border bg-muted/25 px-3 py-1.5 text-sm">
                <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {messages.details.locationLabel}
                </span>
                <span className="truncate">{location}</span>
              </div>
            ) : null}
            {displayUrl ? (
              <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border bg-muted/25 px-3 py-1.5 text-sm">
                <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {messages.details.urlLabel}
                </span>
                <span className="truncate">{displayUrl}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-3">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-[1rem] border bg-muted/20 p-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <item.Icon className="size-3.5" />
                <p className="truncate text-[0.68rem] font-medium tracking-[0.18em] uppercase">
                  {item.label}
                </p>
              </div>
              <p
                className="mt-2 truncate text-sm font-medium"
                title={item.value}
                translate={item.shouldTranslate ? undefined : "no"}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { EventOverviewHero }
