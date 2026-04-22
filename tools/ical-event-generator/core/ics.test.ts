import { describe, expect, test } from "vitest"

import {
  buildIcsCalendar,
  buildRrule,
  escapeIcsText,
  foldLine,
  formatIcsDate,
  formatIcsDateTime,
  formatTrigger,
  formatUtcDateTime,
} from "./ics"

describe("ics helpers", () => {
  test("escapes calendar text values", () => {
    expect(escapeIcsText("Line 1\nLine 2; With, commas")).toBe(
      "Line 1\\nLine 2\\; With\\, commas"
    )
  })

  test("folds long lines with RFC-style continuations", () => {
    expect(foldLine("Short line", 20)).toBe("Short line")
    expect(foldLine("A".repeat(80), 20)).toBe(
      "AAAAAAAAAAAAAAAAAAAA\r\n AAAAAAAAAAAAAAAAAAA\r\n AAAAAAAAAAAAAAAAAAA\r\n AAAAAAAAAAAAAAAAAAA\r\n AAA"
    )
  })

  test("formats date and date-time values", () => {
    expect(formatIcsDate({ year: 2026, month: 4, day: 21 })).toBe("20260421")
    expect(
      formatIcsDateTime({
        year: 2026,
        month: 4,
        day: 21,
        hour: 9,
        minute: 5,
        second: 7,
      })
    ).toBe("20260421T090507")
  })

  test("formats UTC timestamps and reminder triggers", () => {
    expect(formatUtcDateTime(Date.UTC(2026, 3, 21, 16, 15, 0))).toBe(
      "20260421T161500Z"
    )
    expect(formatTrigger(15, "minutes")).toBe("-PT15M")
    expect(formatTrigger(2, "hours")).toBe("-PT2H")
    expect(formatTrigger(3, "days")).toBe("-P3D")
    expect(formatTrigger(1, "weeks")).toBe("-P1W")
    expect(formatTrigger(0, "minutes")).toBe("")
  })

  test("builds recurrence rules for weekly and yearly events", () => {
    expect(
      buildRrule({
        frequency: "WEEKLY",
        interval: 2,
        byDay: ["MO", "WE"],
        count: 8,
      })
    ).toBe("FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=8")

    expect(
      buildRrule({
        frequency: "YEARLY",
        byMonthDay: 21,
        byMonth: 4,
        until: "20260430T000000Z",
      })
    ).toBe("FREQ=YEARLY;BYMONTHDAY=21;BYMONTH=4;UNTIL=20260430T000000Z")
  })

  test("builds minimal calendars for date-only and plain date-time events", () => {
    const dateOnly = buildIcsCalendar({
      uid: "date-only@inbrowser.app",
      dtstamp: "20260421T160000Z",
      dtstart: {
        type: "date",
        value: "20260421",
      },
    })

    expect(dateOnly).toContain("DTSTART;VALUE=DATE:20260421")
    expect(dateOnly).not.toContain("DTEND:")

    const alarmOnly = buildIcsCalendar({
      uid: "plain@inbrowser.app",
      dtstamp: "20260421T160000Z",
      dtstart: {
        type: "date-time",
        value: "20260421T160000Z",
      },
      alarms: [{ trigger: "-PT30M" }],
    })

    expect(alarmOnly).toContain("DTSTART:20260421T160000Z")
    expect(alarmOnly).toContain("BEGIN:VALARM")
    expect(alarmOnly).not.toContain("DESCRIPTION:")
  })

  test("builds complete calendar output", () => {
    const result = buildIcsCalendar(
      {
        uid: "event@inbrowser.app",
        dtstamp: "20260421T160000Z",
        summary: "Team sync",
        description: "Agenda review",
        location: "Studio A",
        url: "https://example.com",
        dtstart: {
          type: "date-time",
          value: "20260421T090000",
          tzid: "America/Los_Angeles",
        },
        dtend: {
          type: "date-time",
          value: "20260421T100000",
          tzid: "America/Los_Angeles",
        },
        rrule: "FREQ=WEEKLY;BYDAY=TU",
        alarms: [{ trigger: "-PT15M", description: "Reminder" }],
      },
      {
        name: "Planning",
        timeZone: "America/Los_Angeles",
      }
    )

    expect(result).toContain("BEGIN:VCALENDAR")
    expect(result).toContain("X-WR-CALNAME:Planning")
    expect(result).toContain("X-WR-TIMEZONE:America/Los_Angeles")
    expect(result).toContain("SUMMARY:Team sync")
    expect(result).toContain("RRULE:FREQ=WEEKLY;BYDAY=TU")
    expect(result).toContain("TRIGGER:-PT15M")
    expect(result.endsWith("\r\n")).toBe(true)
  })
})
