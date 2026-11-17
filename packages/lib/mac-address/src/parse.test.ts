import { describe, expect, it } from "vitest"

import { getBlockRange, lookupMac, parseMacInput } from "./parse"
import type { Assignment } from "./types"

const large: Assignment = {
  registry: "MA-L",
  assignment: "001122",
  organization: "Large Networks",
  address: "London GB",
}
const medium: Assignment = {
  registry: "MA-M",
  assignment: "0011223",
  organization: "Medium Networks",
  address: "Paris FR",
}
const small: Assignment = {
  registry: "MA-S",
  assignment: "001122334",
  organization: "Small Networks",
  address: "Tokyo JP",
}

describe("MAC parsing", () => {
  it.each([
    "00:11:22:33:44:55",
    "00-11-22-33-44-55",
    "0011.2233.4455",
    "001122334455",
    "  001122334455  ",
  ])("normalizes a complete address: %s", (input) => {
    expect(parseMacInput(input)).toEqual({
      hex: "001122334455",
      formatted: "00:11:22:33:44:55",
      bits: 48,
      kind: "universal",
    })
  })

  it.each([
    ["acde48", "AC:DE:48", 24],
    ["ac:de:48", "AC:DE:48", 24],
    ["ac-de-48", "AC:DE:48", 24],
    ["acde.48", "AC:DE:48", 24],
    ["0011223", "00:11:22:3", 28],
    ["00:11:22:3", "00:11:22:3", 28],
    ["0011.223", "00:11:22:3", 28],
    ["001122334", "00:11:22:33:4", 36],
    ["00:11:22:33:4", "00:11:22:33:4", 36],
    ["00-11-22-33-4", "00:11:22:33:4", 36],
    ["0011.2233.4", "00:11:22:33:4", 36],
    ["001122/24", "00:11:22", 24],
    ["0011223/28", "00:11:22:3", 28],
    ["001122334/36", "00:11:22:33:4", 36],
    ["001122334455/24", "00:11:22", 24],
    ["00:11:22:33:44:55/28", "00:11:22:3", 28],
    ["0011.2233.4455/36", "00:11:22:33:4", 36],
  ])("normalizes an IEEE prefix: %s", (input, formatted, bits) => {
    const parsed = parseMacInput(String(input))
    expect(parsed).toEqual({
      hex: String(formatted).replaceAll(":", ""),
      formatted,
      bits,
      kind: "prefix",
    })
  })

  it.each([
    "",
    "   ",
    "00112",
    "00112233",
    "0011223344",
    "00112233445566",
    "00:11:22-33:44:55",
    "0:1:2:3:4:5",
    "00::11:22:33:44:55",
    "00:11:22:33:44:gg",
    "0011.22334455",
    "00 11 22 33 44 55",
    "0x001122334455",
    "001122/28",
    "0011223/24",
    "001122334455/48",
    "001122334455/024",
    "001122334455/",
    "001122334455/24/28",
    "/24",
  ])(
    "rejects malformed input rather than stripping arbitrary text: %s",
    (input) => {
      expect(parseMacInput(input)).toBeNull()
    }
  )

  it.each([
    ["FFFFFFFFFFFF", "broadcast"],
    ["000000000000", "zero"],
    ["01005E000001", "multicast"],
    ["333300000001", "multicast"],
    ["021122334455", "local"],
    ["061122334455", "local"],
    ["0A1122334455", "local"],
    ["0E1122334455", "local"],
    ["AC1122334455", "universal"],
  ])("classifies %s as %s", (input, kind) => {
    expect(parseMacInput(input)?.kind).toBe(kind)
  })
})

describe("registry matching", () => {
  it("selects /36 before /28 before /24 regardless of record order", () => {
    const records = [large, small, medium]
    expect(lookupMac(records, "001122334455").match).toBe(small)
    expect(lookupMac(records, "0011223F4455").match).toBe(medium)
    expect(lookupMac(records, "001122FF4455").match).toBe(large)
  })

  it("matches IAB assignments as 36-bit prefixes", () => {
    const iab: Assignment = { ...small, registry: "IAB" }
    expect(lookupMac([large, iab], "001122334455").match).toBe(iab)
  })

  it("preserves multiple organizations registered to the same longest prefix", () => {
    const cern: Assignment = {
      ...large,
      assignment: "080030",
      organization: "CERN",
      address: "CH",
    }
    const research: Assignment = {
      ...cern,
      organization: "NETWORK RESEARCH CORPORATION",
      address: "US",
    }
    expect(lookupMac([cern, research], "080030000001")).toEqual({
      parsed: parseMacInput("080030000001"),
      match: cern,
      matches: [cern, research],
    })
    const alternate: Assignment = {
      ...small,
      organization: "Another registered organization",
    }
    expect(
      lookupMac([medium, small, large, alternate], "001122334455").matches
    ).toEqual([small, alternate])
  })

  it("looks up the entered prefix without choosing an arbitrary child", () => {
    expect(lookupMac([large, medium, small], "00:11:22").match).toBe(large)
    expect(lookupMac([large, medium, small], "0011223").match).toBe(medium)
    expect(lookupMac([large, medium, small], "001122334").match).toBe(small)
  })

  it("does not infer a globally assigned vendor from special addresses", () => {
    const records: Assignment[] = [
      { ...large, assignment: "021122" },
      { ...large, assignment: "01005E" },
      { ...large, assignment: "FFFFFF" },
      { ...large, assignment: "000000" },
    ]
    for (const input of [
      "021122334455",
      "01005E000001",
      "FFFFFFFFFFFF",
      "000000000000",
    ]) {
      expect(lookupMac(records, input).match).toBeNull()
      expect(lookupMac(records, input).parsed).not.toBeNull()
    }
  })

  it("keeps CID records and IEEE parent blocks out of vendor inference", () => {
    const cid: Assignment = { ...large, registry: "CID" }
    const parent: Assignment = {
      ...large,
      organization: "IEEE Registration Authority",
    }
    expect(lookupMac([cid], "001122334455").match).toBeNull()
    expect(lookupMac([cid], "001122").match).toBeNull()
    expect(lookupMac([parent], "001122334455").match).toBeNull()
    expect(lookupMac([parent, small], "001122334455").match).toBe(small)
  })

  it("returns no match for absent or invalid input", () => {
    expect(lookupMac([large], "001133445566").match).toBeNull()
    expect(lookupMac([large], "not a MAC")).toEqual({
      parsed: null,
      match: null,
      matches: [],
    })
  })
})

describe("block range", () => {
  it.each([
    [large, "00:11:22/24", "00:11:22:00:00:00", "00:11:22:FF:FF:FF", 16777216],
    [
      medium,
      "00:11:22:3/28",
      "00:11:22:30:00:00",
      "00:11:22:3F:FF:FF",
      1048576,
    ],
    [small, "00:11:22:33:4/36", "00:11:22:33:40:00", "00:11:22:33:4F:FF", 4096],
  ])(
    "calculates exact nibble-aligned boundaries",
    (record, prefix, start, end, size) => {
      expect(getBlockRange(record as Assignment)).toEqual({
        prefix,
        start,
        end,
        size,
        bits: (record as Assignment).assignment.length * 4,
      })
    }
  )
})
