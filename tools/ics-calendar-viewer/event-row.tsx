import {
  shiftDate,
  type CalendarDate,
  type CalendarEvent,
} from "@workspace/icalendar"
import { CalendarDays, ChevronDown, MapPin } from "@workspace/ui/icons"

import type catalog from "./messages/en.json"

type Messages = typeof catalog

export function dateFormatters(language: string) {
  return {
    day: new Intl.DateTimeFormat(language, {
      timeZone: "UTC",
      dateStyle: "medium",
    }),
    dateTime: new Intl.DateTimeFormat(language, {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    }),
    time: new Intl.DateTimeFormat(language, {
      timeZone: "UTC",
      timeStyle: "short",
    }),
  }
}

function wallTime(value: string) {
  // UTC is used only to preserve the source clock and date while formatting.
  if (value.length === 10) return new Date(value + "T00:00:00Z")
  return new Date(value.endsWith("Z") ? value : value + "Z")
}

function eventDates(
  { start, end }: CalendarEvent,
  formats: ReturnType<typeof dateFormatters>,
  m: Messages
) {
  if (!start) return ""
  const startTime = wallTime(start.value)
  if (start.value.length === 10) {
    const lastDay = end ? shiftDate(end.value, -1) : start.value
    const span =
      lastDay > start.value
        ? formats.day.formatRange(startTime, wallTime(lastDay))
        : formats.day.format(startTime)
    return (
      <>
        {span} · {m.allDay}
      </>
    )
  }
  const zone = (value: CalendarDate) =>
    value.zone || (value.value.endsWith("Z") ? "UTC" : m.floating)
  const startLabel = formats.dateTime.format(startTime)
  if (!end)
    return (
      <>
        {startLabel} · <bdi>{zone(start)}</bdi>
      </>
    )
  const endTime = wallTime(end.value)
  if (zone(start) !== zone(end)) {
    return (
      <>
        {startLabel} · <bdi>{zone(start)}</bdi>
        {" – "}
        {formats.dateTime.format(endTime)} · <bdi>{zone(end)}</bdi>
      </>
    )
  }
  const sameDay = start.value.slice(0, 10) === end.value.slice(0, 10)
  const endLabel = (sameDay ? formats.time : formats.dateTime).format(endTime)
  return (
    <>
      {startLabel} – {endLabel} · <bdi>{zone(start)}</bdi>
    </>
  )
}

export function EventRow({
  event,
  dates,
  messages: m,
}: {
  event: CalendarEvent
  dates: ReturnType<typeof dateFormatters>
  messages: Messages
}) {
  const summary = (
    <span className="flex min-w-0 flex-1 items-start gap-3">
      <CalendarDays
        className="mt-0.5 size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 space-y-1">
        <span dir="auto" className="block font-medium wrap-anywhere">
          {event.title || m.untitled}
        </span>
        {event.start && (
          <span className="block text-sm wrap-anywhere text-muted-foreground">
            {eventDates(event, dates, m)}
          </span>
        )}
        {event.location && (
          <span className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span dir="auto" className="min-w-0 wrap-anywhere">
              {event.location}
            </span>
          </span>
        )}
        {(event.recurrence || event.recurrenceId) && (
          <span className="block text-xs font-medium text-muted-foreground">
            {event.recurrenceId ? m.occurrence : m.recurring}
          </span>
        )}
      </span>
    </span>
  )

  if (!event.description && !event.recurrence)
    return <div className="px-4 py-3">{summary}</div>

  return (
    <details className="group">
      <summary className="flex cursor-pointer items-start gap-2 px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          className="mt-1 size-4 shrink-0 text-muted-foreground group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-2 px-4 ps-12 pb-4 text-sm">
        {event.description && (
          <p dir="auto" className="wrap-anywhere whitespace-pre-wrap">
            {event.description}
          </p>
        )}
        {event.recurrence && (
          <p
            dir="ltr"
            className="font-mono text-xs break-all text-muted-foreground"
          >
            {event.recurrence}
          </p>
        )}
      </div>
    </details>
  )
}
