import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import IcalEventGeneratorClient from "./client"

const messages = {
  meta: {
    name: "iCal Event Generator",
    description: "Create .ics calendar events with time zones and reminders.",
  },
  actions: {
    useSample: "Use sample",
    reset: "Reset",
    copy: "Copy .ics",
    copied: "Copied",
    download: "Download .ics",
    regenerateUid: "Regenerate UID",
    addReminder: "Add reminder",
    removeReminder: "Remove",
  },
  sample: {
    title: "Launch review",
    location: "Studio A",
    description: "Check timing, owners, and follow-up tasks.",
  },
  details: {
    title: "Event details",
    description: "Fill in the event metadata that appears in calendar apps.",
    summaryLabel: "Summary",
    summaryPlaceholder: "Quarterly planning session",
    locationLabel: "Location",
    urlLabel: "Reference URL",
    notesLabel: "Notes",
    notesPlaceholder: "Agenda or instructions",
    uidLabel: "UID",
  },
  schedule: {
    title: "Schedule",
    description: "Pick the event range, time zone, and output mode.",
    allDayLabel: "All day",
    timeZoneLabel: "Time zone",
    outputModeLabel: "Output mode",
    outputUtcLabel: "UTC date-time",
    outputTzidLabel: "TZID date-time",
    startDateLabel: "Start date",
    startTimeLabel: "Start time",
    endDateLabel: "End date",
    endTimeLabel: "End time",
    allDayHint: "All-day end dates stay inclusive in the form.",
  },
  recurrence: {
    title: "Recurrence",
    description: "Repeat the event daily, weekly, monthly, or yearly.",
    frequencyLabel: "Frequency",
    noneLabel: "Does not repeat",
    dailyLabel: "Daily",
    weeklyLabel: "Weekly",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    intervalLabel: "Every",
    weekdaysLabel: "Weekdays",
    monthDayLabel: "Day of month",
    monthLabel: "Month",
    endsLabel: "Ends",
    neverLabel: "Never",
    afterCountLabel: "After count",
    onDateLabel: "On date",
    countLabel: "Occurrences",
    untilDateLabel: "Until date",
    untilTimeLabel: "Until time",
  },
  reminders: {
    title: "Reminders",
    description: "Attach one or more display alerts before the event starts.",
    enabledLabel: "Enable reminders",
    leadTimeLabel: "Lead time",
    minutesLabel: "Minutes",
    hoursLabel: "Hours",
    daysLabel: "Days",
    weeksLabel: "Weeks",
  },
  output: {
    title: "ICS output",
    description: "Preview the calendar file exactly as it will be downloaded.",
    validation: {
      invalidStartDate: "Enter a valid start date.",
      invalidEndDate: "Enter a valid end date.",
      invalidStartTime: "Enter a valid start time.",
      invalidEndTime: "Enter a valid end time.",
      endBeforeStart: "The end must be after the start.",
      invalidUntilDate: "Enter a valid recurrence end date.",
      invalidUntilTime: "Enter a valid recurrence end time.",
    },
  },
} as const

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-04-21T17:00:00.000Z"))
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:ical-event")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("IcalEventGeneratorClient", () => {
  test("loads the sample event and renders downloadable output", async () => {
    render(<IcalEventGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByText("Use sample"))

    await waitFor(() => {
      expect(screen.getByDisplayValue("Launch review")).toBeTruthy()
    })

    expect(screen.getByDisplayValue(/BEGIN:VCALENDAR/)).toBeTruthy()
    expect(screen.getByDisplayValue("Studio A")).toBeTruthy()
    expect(screen.getAllByText("Weekly").length).toBeGreaterThan(0)
    expect(screen.getByText("Download .ics")).toBeTruthy()
  })

  test("shows validation feedback when the end is before the start", async () => {
    render(<IcalEventGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Start time"), {
      target: { value: "11:00" },
    })
    fireEvent.change(screen.getByLabelText("End time"), {
      target: { value: "10:00" },
    })

    await waitFor(() => {
      expect(screen.getByText("The end must be after the start.")).toBeTruthy()
    })
  })

  test("writes all-day events using inclusive end dates", async () => {
    render(<IcalEventGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByText("Use sample"))
    fireEvent.click(screen.getByLabelText("All day"))
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-04-21" },
    })
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-04-23" },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue(/DTEND;VALUE=DATE:20260424/)).toBeTruthy()
    })
  })

  test("restores persisted form state from local storage", async () => {
    window.localStorage.setItem(
      "tools:ical-event-generator:form-state",
      JSON.stringify({
        title: "Saved event",
        location: "Room 5",
        url: "",
        description: "",
        uid: "saved@inbrowser.app",
        isAllDay: false,
        timeZone: "UTC",
        outputMode: "utc",
        startDate: "2026-04-21",
        startTime: "09:00",
        endDate: "2026-04-21",
        endTime: "10:00",
        recurrenceFrequency: "none",
        recurrenceInterval: 1,
        recurrenceWeekdays: ["TU"],
        recurrenceMonthDay: 21,
        recurrenceMonth: 4,
        recurrenceEndMode: "never",
        recurrenceCount: 10,
        recurrenceUntilDate: "2026-04-21",
        recurrenceUntilTime: "10:00",
        remindersEnabled: false,
        reminders: [{ id: "one", amount: 15, unit: "minutes" }],
      })
    )

    render(<IcalEventGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue("Saved event")).toBeTruthy()
    })

    expect(screen.getByDisplayValue("saved@inbrowser.app")).toBeTruthy()
    expect(screen.getByDisplayValue(/SUMMARY:Saved event/)).toBeTruthy()
  })
})
