import { describe, expect, test } from "vitest"

import { buildLapCsv, buildLapRows } from "./laps"

describe("buildLapRows", () => {
  test("builds lap rows from cumulative totals", () => {
    expect(buildLapRows([1200, 2600, 5100])).toEqual([
      { key: 1, index: 1, lapTime: 1200, totalTime: 1200 },
      { key: 2, index: 2, lapTime: 1400, totalTime: 2600 },
      { key: 3, index: 3, lapTime: 2500, totalTime: 5100 },
    ])
  })

  test("sanitizes negative and decimal values", () => {
    expect(buildLapRows([-5, 1000.9])).toEqual([
      { key: 1, index: 1, lapTime: 0, totalTime: 0 },
      { key: 2, index: 2, lapTime: 1000, totalTime: 1000 },
    ])
  })
})

describe("buildLapCsv", () => {
  const labels = {
    lap: "Lap",
    total: "Total",
    lapMilliseconds: "Lap (ms)",
    totalMilliseconds: "Total (ms)",
  } as const

  test("returns an empty string when there are no rows", () => {
    expect(buildLapCsv([], labels)).toBe("")
  })

  test("builds a csv file with a bom and escaped values", () => {
    const csv = buildLapCsv(buildLapRows([1200, 2600]), labels)

    expect(csv.startsWith("﻿#,Lap,Total,Lap (ms),Total (ms)\n")).toBe(true)
    expect(csv).toContain("1,00:00:01.20,00:00:01.20,1200,1200")
    expect(csv).toContain("2,00:00:01.40,00:00:02.60,1400,2600")
  })

  test("escapes quoted and multiline labels", () => {
    const csv = buildLapCsv(buildLapRows([1200]), {
      lap: 'Lap "split"',
      total: "Total",
      lapMilliseconds: "Lap\n(ms)",
      totalMilliseconds: "Total (ms)",
    })

    expect(csv).toContain('"Lap ""split"""')
    expect(csv).toContain('"Lap\n(ms)"')
  })
})
