import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"
import { RefreshCcw, Sparkles } from "@workspace/ui/icons"

import type { IcalEventGeneratorMessages } from "../types"
import type { IcalEventFormState } from "../core/form-state"

type EventOverviewHeroProps = Readonly<{
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
  messages,
  formState,
  onUseSample,
  onReset,
}: EventOverviewHeroProps) {
  const title = formState.title.trim()
  const description = formState.description.trim()
  const location = formState.location.trim()
  const displayUrl = getDisplayUrl(formState.url)
  const summaryItems = [
    {
      label: messages.schedule.startDateLabel,
      value: formState.startDate,
      detail: formState.isAllDay
        ? messages.schedule.allDayLabel
        : formState.startTime,
    },
    {
      label: messages.schedule.endDateLabel,
      value: formState.endDate,
      detail: formState.isAllDay
        ? messages.schedule.allDayLabel
        : formState.endTime,
    },
    {
      label: messages.schedule.timeZoneLabel,
      value: formState.timeZone,
      detail: messages.schedule.title,
    },
    {
      label: messages.schedule.outputModeLabel,
      value: getOutputModeLabel(messages, formState),
      detail: messages.output.title,
    },
  ] as const

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border bg-linear-to-br from-primary/12 via-background via-55% to-sky-500/12 p-5 sm:p-6">
      <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-[-4rem] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-end">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {formState.isAllDay
                  ? messages.schedule.allDayLabel
                  : getOutputModeLabel(messages, formState)}
              </Badge>
              <Badge variant="outline">
                {getFrequencyBadgeLabel(messages, formState)}
              </Badge>
              <Badge variant="outline">{formState.timeZone}</Badge>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                {messages.meta.name}
              </p>
              <h2
                className={cn(
                  "font-heading text-2xl tracking-[var(--tracking-display)] text-balance sm:text-3xl",
                  !title && "text-muted-foreground"
                )}
              >
                {title || messages.details.summaryPlaceholder}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {description || messages.meta.description}
              </p>
            </div>

            {location || displayUrl ? (
              <div className="flex flex-wrap gap-2">
                {location ? (
                  <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm shadow-xs backdrop-blur">
                    <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                      {messages.details.locationLabel}
                    </span>
                    <span className="truncate">{location}</span>
                  </div>
                ) : null}
                {displayUrl ? (
                  <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm shadow-xs backdrop-blur">
                    <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                      {messages.details.urlLabel}
                    </span>
                    <span className="truncate">{displayUrl}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
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

        <div className="grid gap-3 rounded-[1.35rem] border bg-background/80 p-3 shadow-sm backdrop-blur sm:grid-cols-2">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.05rem] border bg-linear-to-br from-background to-muted/30 p-4"
            >
              <p className="text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-medium sm:text-base">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { EventOverviewHero }
