import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
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

function EventOverviewHero({
  messages,
  formState,
  onUseSample,
  onReset,
}: EventOverviewHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border bg-linear-to-br from-primary/10 via-background to-sky-500/10 p-5 sm:p-6">
      <div className="absolute inset-y-0 right-0 hidden w-48 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_60%)] md:block" />
      <div className="relative flex flex-col gap-5">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formState.isAllDay
                ? messages.schedule.allDayLabel
                : formState.outputMode === "utc"
                  ? messages.schedule.outputUtcLabel
                  : messages.schedule.outputTzidLabel}
            </Badge>
            <Badge variant="outline">
              {getFrequencyBadgeLabel(messages, formState)}
            </Badge>
            <Badge variant="outline">{formState.timeZone}</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              {messages.meta.name}
            </p>
            <h2 className="font-heading text-2xl tracking-[var(--tracking-display)] text-balance sm:text-3xl">
              {formState.title.trim() || messages.meta.description}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {messages.meta.description}
            </p>
          </div>
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
    </section>
  )
}

export { EventOverviewHero }
