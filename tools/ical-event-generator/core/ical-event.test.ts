import { describe, expect, test } from "vitest"

import { createBlankFormState } from "./form-state"
import { buildIcalEventOutput } from "./ical-event"

describe("buildIcalEventOutput", () => {
  test("builds a timed UTC calendar event with recurrence and reminders", () => {
    const formState = {
      ...createBlankFormState(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC", "uid"),
      title: "Planning Session",
      location: "Conference Room",
      description: "Review goals",
      recurrenceFrequency: "weekly" as const,
      recurrenceWeekdays: ["TU", "TH"],
      recurrenceEndMode: "count" as const,
      recurrenceCount: 6,
      remindersEnabled: true,
    }

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 3, 21, 15, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.fileName).toBe("planning-session.ics")
      expect(result.icsContent).toContain("SUMMARY:Planning Session")
      expect(result.icsContent).toContain("DTSTART:20260421T090000Z")
      expect(result.icsContent).toContain(
        "RRULE:FREQ=WEEKLY;BYDAY=TU,TH;COUNT=6"
      )
      expect(result.icsContent).toContain("BEGIN:VALARM")
    }
  })

  test("builds inclusive all-day ranges as exclusive ICS end dates", () => {
    const formState = {
      ...createBlankFormState(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC", "uid"),
      isAllDay: true,
      startDate: "2026-04-21",
      endDate: "2026-04-23",
      title: "Conference",
    }

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 3, 20, 0, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.icsContent).toContain("DTSTART;VALUE=DATE:20260421")
      expect(result.icsContent).toContain("DTEND;VALUE=DATE:20260424")
    }
  })

  test("returns validation errors for invalid timed ranges", () => {
    const formState = {
      ...createBlankFormState(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC", "uid"),
      startDate: "2026-04-21",
      startTime: "11:00",
      endDate: "2026-04-21",
      endTime: "10:00",
    }

    expect(buildIcalEventOutput(formState, Date.now())).toEqual({
      state: "error",
      errorKey: "end-before-start",
      icsContent: "",
      fileName: "ical-event.ics",
    })
  })

  test("validates recurrence until values", () => {
    const formState = {
      ...createBlankFormState(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC", "uid"),
      recurrenceFrequency: "daily" as const,
      recurrenceEndMode: "until" as const,
      recurrenceUntilDate: "2026-04-30",
      recurrenceUntilTime: "bad",
    }

    expect(buildIcalEventOutput(formState, Date.now())).toEqual({
      state: "error",
      errorKey: "invalid-until-time",
      icsContent: "",
      fileName: "ical-event.ics",
    })
  })
})
