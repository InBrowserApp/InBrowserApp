import { describe, expect, it } from "vitest"
import type { CSL } from "@citation-js/core"
import { findDuplicates } from "./duplicates"

const base: CSL = {
  id: "reference",
  type: "article-journal",
  title: "Field notes: a first look",
  issued: { "date-parts": [[2024]] },
  author: [{ family: "García", given: "Ana" }],
}

describe("findDuplicates", () => {
  it("normalizes DOI values and DOI resolver URLs even when titles differ", () => {
    expect(
      findDuplicates([
        { ...base, title: undefined, DOI: " DOI: 10.1234/PAPER " },
        {
          ...base,
          title: "Another title",
          DOI: "https://dx.doi.org/10.1234/paper",
        },
        {
          ...base,
          URL: "https://doi.org/10.1234/paper",
          title: "A third title",
        },
        { ...base, DOI: "10.1234/different" },
      ])
    ).toEqual([{ entries: [1, 2, 3], reason: "doi", title: "Another title" }])
  })

  it("matches normalized title, year and first author when a DOI is missing", () => {
    expect(
      findDuplicates([
        { ...base, DOI: "10.1234/main" },
        {
          ...base,
          title: "<i>Ｆield notes</i> — A first look",
          author: [{ family: "Garci\u0301a", given: "A." }],
          issued: { "date-parts": [["2024", 10]] },
          URL: "https://example.com/10.1234/main",
        },
      ])
    ).toEqual([{ entries: [1, 2], reason: "metadata", title: base.title }])
  })

  it("matches literal organization names without depending on an identifier", () => {
    const organization = {
      ...base,
      author: [{ literal: "Example Research Group" }],
    }
    expect(
      findDuplicates([organization, { ...organization, DOI: "invalid" }])
    ).toMatchObject([{ entries: [1, 2], reason: "metadata" }])
  })

  it("does not merge conflicting DOIs, double-report exact DOI matches, or match on incomplete metadata", () => {
    expect(
      findDuplicates([
        { ...base, DOI: "10.1234/first" },
        { ...base, DOI: "10.1234/first" },
        { ...base, DOI: "10.1234/second" },
        base,
        { ...base, title: "Different title" },
        { ...base, issued: {} },
        { ...base, author: [{ family: "García" }] },
        {
          ...base,
          author: [{ family: "García", given: "Ana" }],
          title: undefined,
        },
      ])
    ).toEqual([{ entries: [1, 2], reason: "doi", title: base.title }])
    expect(
      findDuplicates([
        { ...base, DOI: "10.1234/first" },
        { ...base, DOI: "10.1234/first" },
      ])
    ).toHaveLength(1)
  })

  it("lists groups in input order", () => {
    expect(
      findDuplicates([
        base,
        { ...base, DOI: "10.1234/second", title: "Different title" },
        base,
        { ...base, DOI: "10.1234/second", title: "Same DOI" },
      ]).map((group) => group.entries)
    ).toEqual([
      [1, 3],
      [2, 4],
    ])
  })
})
