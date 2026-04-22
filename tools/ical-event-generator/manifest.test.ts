import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("ical-event-generator manifest", () => {
  test("declares the expected category, icon, and tags", () => {
    expect(tool).toEqual({
      category: "time",
      icon: "clock3",
      tags: [
        "calendar",
        "event",
        "generator",
        "ical",
        "ics",
        "reminder",
        "time",
      ],
    })
  })
})
