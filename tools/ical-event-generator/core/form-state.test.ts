import { afterEach, describe, expect, test, vi } from "vitest"

import {
  createBlankFormState,
  createReminder,
  generateUid,
  restoreFormState,
} from "./form-state"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("form state helpers", () => {
  test("generates ids and reminders with crypto support", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "fixed-uuid",
    } as unknown as Crypto)

    expect(generateUid()).toBe("fixed-uuid@inbrowser.app")
    expect(createReminder()).toEqual({
      id: "fixed-uuid@inbrowser.app",
      amount: 15,
      unit: "minutes",
    })
    expect(createReminder("hours", 2)).toEqual({
      id: "fixed-uuid@inbrowser.app",
      amount: 2,
      unit: "hours",
    })
  })

  test("falls back to Math.random when crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined)
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000)

    expect(generateUid()).toBe("4fzzzxjylrx-1700000000000@inbrowser.app")
  })

  test("uses the selected time zone for timed defaults", () => {
    const state = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 0, 0),
      "UTC",
      "uid"
    )

    expect(state.timeZone).toBe("UTC")
    expect(state.startDate).toBe("2026-04-21")
    expect(state.startTime).toBe("16:00")
    expect(state.endDate).toBe("2026-04-21")
    expect(state.endTime).toBe("17:00")
    expect(state.recurrenceWeekdays).toEqual(["TU"])
    expect(state.recurrenceMonthDay).toBe(21)
    expect(state.recurrenceMonth).toBe(4)
    expect(state.recurrenceUntilDate).toBe("2026-04-21")
    expect(state.recurrenceUntilTime).toBe("17:00")
  })

  test("rounds forward and falls back to UTC for unsupported time zones", () => {
    const state = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 31, 45),
      "Mars/Olympus",
      "uid"
    )

    expect(state.timeZone).toBe("UTC")
    expect(state.startDate).toBe("2026-04-21")
    expect(state.startTime).toBe("17:00")
    expect(state.endTime).toBe("18:00")
  })

  test("rounds partial hours up to the next half hour", () => {
    const state = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 7, 45),
      "UTC",
      "uid"
    )

    expect(state.startTime).toBe("16:30")
    expect(state.endTime).toBe("17:30")
  })

  test("derives recurrence defaults from the zoned calendar day", () => {
    const state = createBlankFormState(
      Date.UTC(2026, 3, 22, 1, 0, 0),
      "America/Los_Angeles",
      "uid"
    )

    expect(state.startDate).toBe("2026-04-21")
    expect(state.startTime).toBe("18:00")
    expect(state.recurrenceWeekdays).toEqual(["TU"])
    expect(state.recurrenceMonthDay).toBe(21)
    expect(state.recurrenceMonth).toBe(4)
  })

  test("returns the fallback state for non-object persisted values", () => {
    const fallback = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 0, 0),
      "UTC"
    )

    expect(restoreFormState(null, fallback)).toBe(fallback)
  })

  test("sanitizes malformed persisted values and preserves fallback defaults", () => {
    const fallback = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 0, 0),
      "UTC"
    )

    const restored = restoreFormState(
      {
        title: 42,
        location: "Room 5",
        url: false,
        description: "Saved note",
        uid: "",
        isAllDay: "yes",
        timeZone: "Mars/Olympus",
        outputMode: "invalid",
        startDate: "2026-04-22",
        startTime: 900,
        endDate: "2026-04-23",
        endTime: null,
        recurrenceFrequency: "invalid",
        recurrenceInterval: Number.POSITIVE_INFINITY,
        recurrenceWeekdays: "MO",
        recurrenceMonthDay: 32,
        recurrenceMonth: 0,
        recurrenceEndMode: "invalid",
        recurrenceCount: 0,
        recurrenceUntilDate: 0,
        recurrenceUntilTime: 0,
        remindersEnabled: "true",
        reminders: [null],
      },
      fallback
    )

    expect(restored).toMatchObject({
      title: fallback.title,
      location: "Room 5",
      url: fallback.url,
      description: "Saved note",
      uid: fallback.uid,
      isAllDay: fallback.isAllDay,
      timeZone: fallback.timeZone,
      outputMode: fallback.outputMode,
      startDate: "2026-04-22",
      startTime: fallback.startTime,
      endDate: "2026-04-23",
      endTime: fallback.endTime,
      recurrenceFrequency: fallback.recurrenceFrequency,
      recurrenceInterval: fallback.recurrenceInterval,
      recurrenceWeekdays: fallback.recurrenceWeekdays,
      recurrenceMonthDay: fallback.recurrenceMonthDay,
      recurrenceMonth: fallback.recurrenceMonth,
      recurrenceEndMode: fallback.recurrenceEndMode,
      recurrenceCount: fallback.recurrenceCount,
      recurrenceUntilDate: fallback.recurrenceUntilDate,
      recurrenceUntilTime: fallback.recurrenceUntilTime,
      remindersEnabled: fallback.remindersEnabled,
      reminders: fallback.reminders,
    })
  })

  test("falls back for missing string fields and empty weekday filters", () => {
    const fallback = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 0, 0),
      "UTC"
    )
    const restored = restoreFormState(
      {
        location: 42,
        description: false,
        startDate: 5,
        endDate: null,
        recurrenceWeekdays: ["BAD"],
        reminders: "invalid",
      },
      fallback
    )

    expect(restored.location).toBe(fallback.location)
    expect(restored.description).toBe(fallback.description)
    expect(restored.startDate).toBe(fallback.startDate)
    expect(restored.endDate).toBe(fallback.endDate)
    expect(restored.recurrenceWeekdays).toEqual(fallback.recurrenceWeekdays)
    expect(restored.reminders).toEqual(fallback.reminders)
  })

  test("restores valid values and sanitizes reminder entries", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "generated-uid",
    } as unknown as Crypto)

    const fallback = createBlankFormState(
      Date.UTC(2026, 3, 21, 16, 0, 0),
      "UTC"
    )
    const restored = restoreFormState(
      {
        title: "Launch review",
        location: "Studio A",
        url: "https://example.com",
        description: "Agenda",
        uid: "saved@inbrowser.app",
        isAllDay: true,
        timeZone: "Europe/Paris",
        outputMode: "tzid",
        startDate: "2026-04-21",
        startTime: "09:00",
        endDate: "2026-04-21",
        endTime: "10:00",
        recurrenceFrequency: "weekly",
        recurrenceInterval: 2.4,
        recurrenceWeekdays: ["WE", "INVALID"],
        recurrenceMonthDay: 12.6,
        recurrenceMonth: 7.4,
        recurrenceEndMode: "until",
        recurrenceCount: 4.6,
        recurrenceUntilDate: "2026-05-01",
        recurrenceUntilTime: "11:30",
        remindersEnabled: true,
        reminders: [
          { id: "", amount: "bad", unit: "lightyears" },
          { id: "keep", amount: 2.2, unit: "hours" },
        ],
      },
      fallback
    )

    expect(restored).toMatchObject({
      title: "Launch review",
      location: "Studio A",
      url: "https://example.com",
      description: "Agenda",
      uid: "saved@inbrowser.app",
      isAllDay: true,
      timeZone: "Europe/Paris",
      outputMode: "tzid",
      startDate: "2026-04-21",
      startTime: "09:00",
      endDate: "2026-04-21",
      endTime: "10:00",
      recurrenceFrequency: "weekly",
      recurrenceInterval: 2,
      recurrenceWeekdays: ["WE"],
      recurrenceMonthDay: 13,
      recurrenceMonth: 7,
      recurrenceEndMode: "until",
      recurrenceCount: 5,
      recurrenceUntilDate: "2026-05-01",
      recurrenceUntilTime: "11:30",
      remindersEnabled: true,
    })
    expect(restored.reminders).toEqual([
      {
        id: "generated-uid@inbrowser.app",
        amount: 15,
        unit: "minutes",
      },
      {
        id: "keep",
        amount: 2,
        unit: "hours",
      },
    ])
  })
})
