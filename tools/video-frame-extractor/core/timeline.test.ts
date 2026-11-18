import { describe, expect, it } from "vitest"
import { FRAME_LIMIT, formatTime, planFrames } from "./timeline"
import type { Timing } from "./timeline"

const timing: Timing = {
  mode: "timestamps",
  timestamps: "0",
  interval: "1",
  start: "0",
  end: "",
}

describe("planFrames", () => {
  it("sorts and deduplicates seconds and timecodes across separators", () => {
    expect(
      planFrames(
        {
          ...timing,
          timestamps: "01:02:03.004، 1.25，0; .5\n01:23、00:01.250",
        },
        4000
      )
    ).toEqual({ times: [0, 500, 1250, 83_000, 3_723_004] })
  })

  it("allows the exact end as a requested timestamp", () => {
    expect(planFrames({ ...timing, timestamps: "6" }, 6)).toEqual({
      times: [6000],
    })
  })

  it.each([
    "",
    "-1",
    "random",
    "0.0001",
    "6.001",
    "00:60",
    "1:60:00",
    "1:0:0:0",
    "1m:10",
  ])("rejects invalid or out-of-range timestamps (%s)", (timestamps) => {
    expect(planFrames({ ...timing, timestamps }, 6)).toEqual({
      error: "timestampError",
    })
  })

  it("limits the number of distinct timestamps", () => {
    const timestamps = Array.from(
      { length: FRAME_LIMIT + 1 },
      (_, i) => i
    ).join(" ")
    expect(planFrames({ ...timing, timestamps }, 200)).toEqual({
      error: "limitError",
    })
  })

  it("samples decimal intervals without cumulative rounding or an extra frame at the video end", () => {
    expect(
      planFrames(
        { ...timing, mode: "interval", start: "0.1", interval: "0.3" },
        1
      )
    ).toEqual({
      times: [100, 400, 700],
    })
    expect(
      planFrames({ ...timing, mode: "interval", end: "1" }, 1.0005)
    ).toEqual({ times: [0, 1000] })
  })

  it("includes the user-selected end when inside the video and on the interval", () => {
    expect(
      planFrames(
        { ...timing, mode: "interval", interval: "5", start: "10", end: "20" },
        25
      )
    ).toEqual({
      times: [10_000, 15_000, 20_000],
    })
  })

  it.each([
    { interval: "0" },
    { interval: "invalid" },
    { interval: "9".repeat(500) },
    { start: "-1" },
    { start: "2", end: "2" },
    { end: "7" },
  ])("rejects invalid interval settings (%j)", (updates) => {
    expect(planFrames({ ...timing, mode: "interval", ...updates }, 6)).toEqual({
      error: "intervalError",
    })
  })

  it("rejects huge schedules before allocating a frame list", () => {
    expect(
      planFrames({ ...timing, mode: "interval", interval: "0.001" }, 10_000)
    ).toEqual({
      error: "limitError",
    })
  })
})

it("formats millisecond timestamps consistently", () => {
  expect(formatTime(0)).toBe("00:00.000")
  expect(formatTime(3_723_004)).toBe("62:03.004")
})
