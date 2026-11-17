import { describe, expect, it } from "vitest"

import { filterAssignments, getOrganizations } from "./search"
import type { Assignment } from "./types"

const records: readonly Assignment[] = [
  {
    registry: "MA-L",
    assignment: "001122",
    organization: "Alpha & Sons",
    address: "London GB",
  },
  {
    registry: "MA-M",
    assignment: "0011223",
    organization: "Beta Networks",
    address: "Paris FR",
  },
  {
    registry: "MA-S",
    assignment: "001122334",
    organization: "Alpha & Sons",
    address: "Tokyo JP",
  },
  {
    registry: "IAB",
    assignment: "0050C2123",
    organization: "Alpha & Sons subsidiary",
    address: "Taipei TW",
  },
  {
    registry: "CID",
    assignment: "AA1122",
    organization: "Beta Networks",
    address: "New York US",
  },
]

describe("assignment search", () => {
  it("returns all records with empty filters and preserves source order", () => {
    expect(filterAssignments(records)).toEqual(records)
    expect(filterAssignments(records, { query: "  " })).toEqual(records)
  })

  it("combines registry and exact organization filters", () => {
    expect(
      filterAssignments(records, {
        registry: "MA-S",
        organization: "Alpha & Sons",
      })
    ).toEqual([records[2]])
    expect(
      filterAssignments(records, { organization: "Alpha & Sons" })
    ).toEqual([records[0], records[2]])
    expect(
      filterAssignments(records, { organization: "alpha & sons" })
    ).toEqual([])
  })

  it.each(["001122", "00:11:22", "00-11-22", "0011.22"])(
    "finds containing and child assignments for %s",
    (query) => {
      expect(filterAssignments(records, { query })).toEqual(records.slice(0, 3))
    }
  )

  it("matches a full MAC against its candidate parent assignments", () => {
    expect(filterAssignments(records, { query: "00:11:22:33:44:55" })).toEqual(
      records.slice(0, 3)
    )
  })

  it.each(["0011", "00:11", "00-11", "0011."])(
    "supports searching an incomplete prefix while typing: %s",
    (query) => {
      expect(filterAssignments(records, { query })).toEqual(records.slice(0, 3))
    }
  )

  it("does not treat separators alone as a universal prefix match", () => {
    expect(filterAssignments(records, { query: "::" })).toEqual([])
  })

  it.each([
    "001122/24",
    "00:11:22/24",
    "0011.22/24",
    "00:11:22:33:44:55/24",
    "0011223/28",
    "00:11:22:3/28",
    "00:11:22:33:44:55/28",
    "001122334/36",
    "00:11:22:33:4/36",
    "0011.2233.4455/36",
  ])("finds candidate assignments for CIDR-style prefix %s", (query) => {
    expect(filterAssignments(records, { query })).toEqual(records.slice(0, 3))
  })

  it.each(["001122/28", "001122334455/48", "00:11:22/24/36"])(
    "does not discard malformed CIDR suffixes: %s",
    (query) => {
      expect(filterAssignments(records, { query })).toEqual([])
    }
  )

  it("searches names and addresses case-insensitively", () => {
    expect(filterAssignments(records, { query: "  ALPHA  " })).toEqual([
      records[0],
      records[2],
      records[3],
    ])
    expect(filterAssignments(records, { query: "pArIs" })).toEqual([records[1]])
    expect(filterAssignments(records, { query: "missing" })).toEqual([])
  })

  it("keeps CID visible in explicit registry browsing", () => {
    expect(filterAssignments(records, { registry: "CID" })).toEqual([
      records[4],
    ])
    expect(
      filterAssignments(records, { query: "Beta", registry: "MA-L" })
    ).toEqual([])
  })
})

describe("organization search", () => {
  it("groups exact names, counts blocks, and sorts by name", () => {
    expect(getOrganizations(records)).toEqual([
      { name: "Alpha & Sons", count: 2 },
      { name: "Alpha & Sons subsidiary", count: 1 },
      { name: "Beta Networks", count: 2 },
    ])
  })

  it("matches names or any registered address but retains the full block count", () => {
    expect(getOrganizations(records, "ALPHA")).toEqual([
      { name: "Alpha & Sons", count: 2 },
      { name: "Alpha & Sons subsidiary", count: 1 },
    ])
    expect(getOrganizations(records, "  Tokyo ")).toEqual([
      { name: "Alpha & Sons", count: 2 },
    ])
    expect(getOrganizations(records, "not registered")).toEqual([])
    expect(getOrganizations([])).toEqual([])
  })
})
