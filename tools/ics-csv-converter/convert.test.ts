import { describe, expect, it } from "vitest"
import { readCalendar } from "@workspace/icalendar"
import { csvToIcs, icsToCsv } from "./convert"

function calendar(events: string[], timeZone = "") {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InBrowser.App//Test//EN",
    timeZone,
    ...events.map((event, index) =>
      [
        "BEGIN:VEVENT",
        `UID:event-${index}@example.com`,
        "DTSTAMP:20260501T000000Z",
        event,
        "END:VEVENT",
      ].join("\r\n")
    ),
    "END:VCALENDAR",
    "",
  ]
    .filter(Boolean)
    .join("\r\n")
}

describe("ICS and CSV conversion", () => {
  it("round-trips a titleless event and preserves exclusive all-day ends", () => {
    const source = calendar([
      "DTSTART;VALUE=DATE:20260512\r\nDTEND;VALUE=DATE:20260514",
    ])
    const csv = icsToCsv(source)
    expect(csv.rows).toEqual([["", "2026-05-12", "2026-05-14", ""]])
    const converted = csvToIcs(csv.output).output
    expect(converted).not.toContain("SUMMARY:")
    expect(converted).toContain("DTEND;VALUE=DATE:20260514\r\n")
  })

  it("combines Google Calendar date and time columns and handles an optional end date", () => {
    const { output } = csvToIcs(
      [
        "Subject,Start Date,Start Time,End Date,End Time,All Day Event",
        "Final exam,05/30/2026,10:00 AM,,1:00 PM,False",
        "Workshop,05/30/2026,,05/31/2026,,True",
      ].join("\n")
    )
    expect(
      readCalendar(output).map(({ start, end }) => [start?.value, end?.value])
    ).toEqual([
      ["2026-05-30T10:00:00", "2026-05-30T13:00:00"],
      ["2026-05-30", "2026-06-01"],
    ])
  })

  it("uses the canonical exclusive End even when the spreadsheet has an all-day flag", () => {
    const { output } = csvToIcs(
      "Title,Start,End,All Day Event\nWorkshop,2026-05-30,2026-05-31,True"
    )
    expect(output).toContain("DTEND;VALUE=DATE:20260531\r\n")
  })

  it("preserves a custom time zone and recurring duration without duplicating the zone", () => {
    const zone = [
      "BEGIN:VTIMEZONE",
      "TZID:MyOffice",
      "BEGIN:STANDARD",
      "DTSTART:19700101T000000",
      "TZOFFSETFROM:+0345",
      "TZOFFSETTO:+0345",
      "END:STANDARD",
      "END:VTIMEZONE",
    ].join("\r\n")
    const source = calendar(
      [
        "SUMMARY:Lunch\r\nDTSTART;TZID=MyOffice:20260512T120000\r\nDURATION:PT45M\r\nRRULE:FREQ=WEEKLY;COUNT=4",
        "SUMMARY:Planning\r\nDTSTART;TZID=MyOffice:20260513T120000\r\nDTEND;TZID=MyOffice:20260513T130000",
      ],
      zone
    )
    const { output: csv } = icsToCsv(source)
    const { output } = csvToIcs(csv)
    expect(output.match(/BEGIN:VTIMEZONE/g)).toHaveLength(1)
    expect(output).toContain(zone)
    expect(output).toContain("DURATION:PT45M\r\n")
    expect(output).not.toContain("DTEND;TZID=MyOffice:20260512T124500")
    expect(output).toContain("RRULE:FREQ=WEEKLY;COUNT=4\r\n")
    expect(readCalendar(output)[0]?.end?.value).toBe("2026-05-12T12:45:00")
  })

  it("escapes punctuation and multiline Unicode text in ICS output", () => {
    const description = "Semicolon; comma, and line break\n下一行 😀"
    const csv = `Title,Start,Description\r\nName,2026-05-12,"${description}"`
    const { output } = csvToIcs(csv)
    expect(readCalendar(output)[0]?.description).toBe(description)
  })

  it("preserves the original date when an occurrence moves to a timed slot", () => {
    const csv = [
      "Title,Start,UID,Recurrence ID",
      "Rescheduled,2026-05-12T09:00:00,original@example.com,2026-05-11",
    ].join("\n")
    const { output } = csvToIcs(csv)
    expect(output).toContain("RECURRENCE-ID;VALUE=DATE:20260511\r\n")
    expect(output).toContain("DTSTART:20260512T090000\r\n")
  })

  it.each([
    ["date", "Title,Start\nWorkshop,2026-02-31"],
    ["end", "Title,Start,End\nWorkshop,2026-05-12,2026-05-11"],
    ["negative duration", "Title,Start,Duration\nWorkshop,2026-05-12,-P1D"],
    [
      "timed all-day duration",
      "Title,Start,Duration\nWorkshop,2026-05-12,PT1H",
    ],
    ["recurrence", "Title,Start,Recurrence\nWorkshop,2026-05-12,BYDAY=MO"],
    [
      "recurrence count",
      "Title,Start,Recurrence\nWorkshop,2026-05-12,FREQ=DAILY;COUNT=0",
    ],
    [
      "definitions",
      "Title,Start,Time Zone Definitions\nWorkshop,2026-05-12,{}",
    ],
  ])("reports the record containing an invalid %s", (_, csv) => {
    expect(() => csvToIcs(csv)).toThrow("Invalid CSV row 2")
  })
})
