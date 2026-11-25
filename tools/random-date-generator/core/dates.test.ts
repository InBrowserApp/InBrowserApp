import { simpleFaker } from "@faker-js/faker"
import { describe, expect, it } from "vitest"

import { generateDates } from "./dates"

describe("generateDates", () => {
  it("can pick both endpoints and the leap day in an inclusive range", () => {
    simpleFaker.seed(42)
    const dates = generateDates({
      start: "2024-02-28",
      end: "2024-03-01",
      format: "iso",
      count: 100,
      lang: "en",
    })

    expect(dates).toHaveLength(100)
    expect([...new Set(dates)].sort()).toEqual([
      "2024-02-28",
      "2024-02-29",
      "2024-03-01",
    ])
  })

  it.each(["0001-01-01", "2024-02-29", "9999-12-31"])(
    "keeps %s when both endpoints are the same",
    (date) => {
      expect(
        generateDates({
          start: date,
          end: date,
          format: "iso",
          count: 3,
          lang: "ar",
        })
      ).toEqual([date, date, date])
    }
  )

  it.each([
    ["en", "Feb 29, 2024"],
    ["de", "29.02.2024"],
    ["zh-TW", "2024年2月29日"],
  ])("formats the same calendar day for %s", (lang, expected) => {
    expect(
      generateDates({
        start: "2024-02-29",
        end: "2024-02-29",
        format: "localized",
        count: 5,
        lang,
      })
    ).toEqual(Array(5).fill(expected))
  })
})
