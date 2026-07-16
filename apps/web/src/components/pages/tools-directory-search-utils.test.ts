import type { MouseEvent } from "react"
import { beforeEach, describe, expect, it } from "vitest"

import type { ToolDirectoryEntry } from "@/lib/tools-directory"

import {
  isPlainLeftClick,
  normalizeQuery,
  rankEntries,
  readLocationState,
} from "./tools-directory-search-utils"

const ENTRIES = [
  {
    description: "Exact description",
    icon: "one",
    name: "Needle",
    slug: "exact",
  },
  {
    description: "Starts description",
    icon: "two",
    name: "Needlework",
    slug: "starts",
  },
  {
    description: "Contains description",
    icon: "three",
    name: "A Needle Tool",
    slug: "contains",
  },
  {
    description: "Find a needle here",
    icon: "four",
    name: "Description match",
    slug: "description",
  },
] as const satisfies readonly ToolDirectoryEntry[]

describe("tools directory search helpers", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/tools/")
  })

  it("normalizes surrounding and repeated whitespace", () => {
    expect(normalizeQuery("  needle\n\t tool  ")).toBe("needle tool")
  })

  it("ranks exact, prefix, name, and description matches in that order", () => {
    expect(
      rankEntries(ENTRIES, "needle", "en").map(({ slug }) => slug)
    ).toEqual(["exact", "starts", "contains", "description"])
  })

  it("requires every query token and preserves the input for no query", () => {
    expect(rankEntries(ENTRIES, "needle exact", "en")).toEqual([ENTRIES[0]])
    expect(rankEntries(ENTRIES, "missing token", "en")).toEqual([])
    expect(rankEntries(ENTRIES, "", "en")).toBe(ENTRIES)
  })

  it("reads a normalized query and valid search result page from the URL", () => {
    window.history.replaceState(
      null,
      "",
      "/tools/page/2/?query=%20needle%20%20tool%20&page=3"
    )

    expect(readLocationState(2)).toEqual({
      pageNumber: 3,
      query: "needle tool",
    })
  })

  it("uses page one for an invalid search page and the fallback otherwise", () => {
    window.history.replaceState(null, "", "/tools/?query=needle&page=-2")
    expect(readLocationState(4)).toEqual({
      pageNumber: 1,
      query: "needle",
    })

    window.history.replaceState(null, "", "/tools/page/4/?page=9")
    expect(readLocationState(4)).toEqual({ pageNumber: 4, query: "" })
  })

  it("only intercepts unmodified primary-button clicks", () => {
    const event = {
      altKey: false,
      button: 0,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as MouseEvent<HTMLAnchorElement>

    expect(isPlainLeftClick(event)).toBe(true)
    expect(isPlainLeftClick({ ...event, button: 1 })).toBe(false)
    expect(isPlainLeftClick({ ...event, metaKey: true })).toBe(false)
  })
})
