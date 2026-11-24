import { expect, test } from "vitest"
import { calendarExample } from "./example"
import { isCalendarDate, readCalendar, shiftDate } from "./index"

const wrap = (body: string) =>
  "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n" + body + "\r\nEND:VCALENDAR"
const event = (body: string) => "BEGIN:VEVENT\r\n" + body + "\r\nEND:VEVENT"

test("keeps source time zones, recurrence and exclusive all-day end dates", () => {
  const [meeting, workshop] = readCalendar(calendarExample)
  expect(meeting).toMatchObject({
    start: { value: "2026-05-12T09:00:00", zone: "America/New_York" },
    recurrence: "FREQ=WEEKLY;COUNT=3",
  })
  expect(workshop?.end?.value).toBe("2026-05-17")
  expect(shiftDate(workshop!.end!.value, -1)).toBe("2026-05-16")
})

test("handles a DST transition using the embedded time zone", () => {
  const zone = [
    "BEGIN:VTIMEZONE",
    "TZID:America/New_York",
    "BEGIN:STANDARD",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
  ].join("\r\n")
  const calendar = wrap(
    zone +
      "\r\n" +
      event("DTSTART;TZID=America/New_York:20260308T013000\r\nDURATION:PT2H")
  )
  expect(readCalendar(calendar)[0]).toMatchObject({
    start: { value: "2026-03-08T01:30:00", zone: "America/New_York" },
    end: { value: "2026-03-08T04:30:00", zone: "America/New_York" },
    duration: "PT2H",
    timeZones: [expect.stringContaining("TZID:America/New_York")],
  })
})

test("rejects malformed dates and mismatched value types before rendering", () => {
  expect(isCalendarDate("2026-02-31")).toBe(false)
  expect(readCalendar(wrap("")).length).toBe(0)
  expect(() =>
    readCalendar(wrap(event("DTSTART;VALUE=DATE:20260231")))
  ).toThrow("Invalid iCalendar date")
  expect(() =>
    readCalendar(
      wrap(event("DTSTART;VALUE=DATE:20260501\r\nDTEND:20260502T120000Z"))
    )
  ).toThrow("iCalendar start and end must have the same value type")
  expect(() =>
    readCalendar(wrap(event("DTSTART:20260502T120000Z\r\nDURATION:-PT2H")))
  ).toThrow("Invalid iCalendar event duration")
})
