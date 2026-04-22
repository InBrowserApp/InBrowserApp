import { describe, expect, test } from "vitest"

import { createBlankFormState } from "./form-state"
import { buildIcalEventOutput } from "./ical-event"
import type { IcalEventFormState } from "./form-state"

function createState(
  overrides: Partial<IcalEventFormState> = {}
): IcalEventFormState {
  return {
    ...createBlankFormState(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC", "uid"),
    ...overrides,
  }
}

describe("buildIcalEventOutput", () => {
  test("builds a timed UTC calendar event with recurrence and reminders", () => {
    const formState = {
      ...createState(),
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
      expect(result.icsContent).toContain("DTSTART:20260421T160000Z")
      expect(result.icsContent).toContain("DTEND:20260421T170000Z")
      expect(result.icsContent).toContain(
        "RRULE:FREQ=WEEKLY;BYDAY=TU,TH;COUNT=6"
      )
      expect(result.icsContent).toContain("BEGIN:VALARM")
    }
  })

  test("builds inclusive all-day ranges as exclusive ICS end dates", () => {
    const formState = {
      ...createState(),
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
      ...createState(),
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
      ...createState(),
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

  test("builds a timed TZID event and drops invalid reminders", () => {
    const formState = createState({
      title: " ",
      timeZone: "America/Los_Angeles",
      outputMode: "tzid",
      startDate: "2026-05-10",
      startTime: "09:00",
      endDate: "2026-05-10",
      endTime: "10:00",
      remindersEnabled: true,
      reminders: [
        { id: "skip", amount: 0, unit: "minutes" },
        { id: "keep", amount: 2, unit: "hours" },
      ],
    })

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 4, 10, 12, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.fileName).toBe("ical-event.ics")
      expect(result.icsContent).toContain(
        "DTSTART;TZID=America/Los_Angeles:20260510T090000"
      )
      expect(result.icsContent).toContain(
        "DTEND;TZID=America/Los_Angeles:20260510T100000"
      )
      expect(result.icsContent).toContain("DESCRIPTION:Reminder")
      expect(result.icsContent.match(/BEGIN:VALARM/g)).toHaveLength(1)
    }
  })

  test("builds an all-day monthly recurrence with an until date", () => {
    const formState = createState({
      title: "Conference",
      isAllDay: true,
      startDate: "2026-04-21",
      endDate: "2026-04-21",
      recurrenceFrequency: "monthly",
      recurrenceInterval: 0,
      recurrenceMonthDay: 21,
      recurrenceEndMode: "until",
      recurrenceUntilDate: "2026-07-21",
    })

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 3, 20, 0, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.icsContent).toContain(
        "RRULE:FREQ=MONTHLY;BYMONTHDAY=21;UNTIL=20260721"
      )
    }
  })

  test("coerces recurrence counts below one to a single occurrence", () => {
    const formState = createState({
      title: "Sync",
      recurrenceFrequency: "weekly",
      recurrenceWeekdays: ["TU"],
      recurrenceEndMode: "count",
      recurrenceCount: 0,
    })

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 3, 21, 17, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.icsContent).toContain("RRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=1")
    }
  })

  test("builds a yearly UTC recurrence with an until timestamp", () => {
    const formState = createState({
      title: "Anniversary",
      recurrenceFrequency: "yearly",
      recurrenceMonth: 7,
      recurrenceMonthDay: 14,
      recurrenceEndMode: "until",
      recurrenceUntilDate: "2028-07-14",
      recurrenceUntilTime: "18:00",
      startDate: "2026-07-14",
      startTime: "18:00",
      endDate: "2026-07-14",
      endTime: "19:00",
    })

    const result = buildIcalEventOutput(
      formState,
      Date.UTC(2026, 6, 14, 17, 0, 0)
    )

    expect(result.state).toBe("ready")

    if (result.state === "ready") {
      expect(result.icsContent).toContain(
        "RRULE:FREQ=YEARLY;BYMONTHDAY=14;BYMONTH=7;UNTIL=20280714T180000Z"
      )
    }
  })

  test("returns recurrence validation errors for malformed dates", () => {
    expect(
      buildIcalEventOutput(
        createState({
          startDate: "bad-date",
          recurrenceFrequency: "weekly",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-start-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          recurrenceFrequency: "daily",
          recurrenceEndMode: "until",
          recurrenceUntilDate: "bad-date",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-until-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })
  })

  test("returns all-day validation errors for malformed or reversed dates", () => {
    expect(
      buildIcalEventOutput(
        createState({
          isAllDay: true,
          startDate: "bad-date",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-start-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          isAllDay: true,
          endDate: "bad-date",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-end-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          isAllDay: true,
          startDate: "2026-04-23",
          endDate: "2026-04-21",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "end-before-start",
      icsContent: "",
      fileName: "ical-event.ics",
    })
  })

  test("returns timed validation errors for malformed start and end inputs", () => {
    expect(
      buildIcalEventOutput(
        createState({
          startDate: "bad-date",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-start-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          startTime: "bad-time",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-start-time",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          endDate: "bad-date",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-end-date",
      icsContent: "",
      fileName: "ical-event.ics",
    })

    expect(
      buildIcalEventOutput(
        createState({
          endTime: "bad-time",
        }),
        Date.now()
      )
    ).toEqual({
      state: "error",
      errorKey: "invalid-end-time",
      icsContent: "",
      fileName: "ical-event.ics",
    })
  })
})
