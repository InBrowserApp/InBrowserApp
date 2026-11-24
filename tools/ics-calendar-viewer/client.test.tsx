import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { calendarExample } from "@workspace/icalendar/example"

import Client from "./client"
import m from "./messages/en.json"

afterEach(cleanup)

function calendar(lines: string[]) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InBrowser.App//Test//EN",
    ...lines,
    "END:VCALENDAR",
  ].join("\r\n")
}

function event(summary: string, ...properties: string[]) {
  return [
    "BEGIN:VEVENT",
    "DTSTAMP:20260501T120000Z",
    "UID:" + summary,
    "SUMMARY:" + summary,
    ...properties,
    "END:VEVENT",
  ]
}

function paste(text: string) {
  fireEvent.change(screen.getByLabelText(m.input), { target: { value: text } })
  fireEvent.click(screen.getByRole("button", { name: m.view }))
}

test("inspects the example and searches event content without transferring expanded details", () => {
  render(<Client messages={m} language="en" />)
  expect(screen.getByText(m.empty)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.sample }))

  expect(screen.getByText("Events: 2")).toBeTruthy()
  expect(screen.getByText("America/New_York")).toBeTruthy()
  expect(screen.getByText(m.recurring)).toBeTruthy()
  const allDay = screen.getByText(/All day/)
  expect(allDay.textContent).toMatch(/15.*16/)
  expect(allDay.textContent).not.toContain("17")

  const planning = screen.getByText("Project planning").closest("details")!
  const workshop = screen.getByText("Design workshop").closest("details")!
  planning.open = true
  const search = screen.getByRole("searchbox", { name: m.search })
  fireEvent.change(search, { target: { value: "  SKETCHES  " } })
  expect(screen.queryByText("Project planning")).toBeNull()
  expect(screen.getByText("Design workshop").closest("details")).toBe(workshop)
  expect(workshop.open).toBe(false)
  expect(screen.getByText("Events: 1")).toBeTruthy()
  fireEvent.change(search, { target: { value: "No such event" } })
  expect(screen.getByText(m.noMatches)).toBeTruthy()
})

test("reads a file, reports a failed read, and recovers with another file", async () => {
  const { container } = render(<Client messages={m} language="en" />)
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const click = vi.spyOn(input, "click")
  fireEvent.click(screen.getByRole("button", { name: m.openFile }))
  expect(click).toHaveBeenCalledOnce()

  const unreadable = new File(["ignored"], "unreadable.ics")
  vi.spyOn(unreadable, "text").mockRejectedValue(new Error("file removed"))
  fireEvent.change(input, { target: { files: [unreadable] } })
  expect(await screen.findByRole("alert")).toHaveProperty(
    "textContent",
    m.readError
  )

  const valid = new File([calendarExample], "agenda.ics")
  fireEvent.change(input, { target: { files: [valid] } })
  expect(await screen.findByText("agenda.ics")).toBeTruthy()
  expect(screen.getByText("Project planning")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()

  fireEvent.click(screen.getByText(m.paste))
  fireEvent.change(screen.getByLabelText(m.input), {
    target: { value: calendar(event("Pasted event")) },
  })
  const slower = new File([calendarExample], "slow.ics")
  let finish!: (value: string) => void
  vi.spyOn(slower, "text").mockReturnValue(
    new Promise((resolve) => {
      finish = resolve
    })
  )
  fireEvent.change(input, { target: { files: [slower] } })
  fireEvent.click(screen.getByRole("button", { name: m.view }))
  await act(async () => finish(calendarExample))
  expect(screen.getByText("Pasted event")).toBeTruthy()
  expect(screen.queryByText("slow.ics")).toBeNull()
})

test("preserves invalid pasted input and shows empty and corrected calendars", () => {
  render(<Client messages={m} language="en" />)
  const source = screen.getByLabelText(m.input)
  expect(
    screen.getByRole("button", { name: m.view, hidden: true })
  ).toHaveProperty("disabled", true)
  fireEvent.click(screen.getByText(m.paste))

  paste("BEGIN:VCALENDAR")
  expect(screen.getByRole("alert")).toHaveProperty("textContent", m.invalid)
  expect(source).toHaveProperty("value", "BEGIN:VCALENDAR")

  paste(calendar([]))
  expect(screen.getByText(m.noEvents)).toBeTruthy()

  paste(
    calendar([
      ...event("", "DTSTART:20260512T090000"),
      ...event(
        "Flight",
        "DTSTART;TZID=America/New_York:20260512T090000",
        "DTEND;TZID=Europe/Paris:20260512T223000"
      ),
      ...event(
        "Two days",
        "DTSTART:20260512T090000Z",
        "DTEND:20260513T090000Z"
      ),
      ...event(
        "Edited",
        "DTSTART;VALUE=DATE:20260514",
        "RECURRENCE-ID;VALUE=DATE:20260513"
      ),
      ...event("Undated"),
    ])
  )
  expect(screen.getByText(m.untitled)).toBeTruthy()
  expect(screen.getByText(m.floating)).toBeTruthy()
  expect(screen.getByText("Europe/Paris")).toBeTruthy()
  expect(screen.getByText("UTC")).toBeTruthy()
  expect(screen.getByText(m.occurrence)).toBeTruthy()
  expect(screen.getByText("Undated")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()
})
