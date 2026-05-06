import { describe, expect, test } from "vitest"

import { mergeAndExcludeCidrs } from "./cidr-merge-exclude"

describe("CIDR merge and exclude core", () => {
  test("returns empty states before a merge list is present", () => {
    expect(mergeAndExcludeCidrs("", "")).toEqual({ status: "empty" })
    expect(mergeAndExcludeCidrs("", "10.0.0.0/24")).toEqual({
      status: "missing-merge",
    })
  })

  test("reports invalid CIDR entries with group and line information", () => {
    expect(
      mergeAndExcludeCidrs(
        "/24\n10.0.0.0/24/1\n999.0.0.0/24\n10.0.0.0/x",
        "2001:db8::/129"
      )
    ).toEqual({
      status: "invalid",
      errors: [
        { group: "merge", line: 1, value: "/24" },
        { group: "merge", line: 2, value: "10.0.0.0/24/1" },
        { group: "merge", line: 3, value: "999.0.0.0/24" },
        { group: "merge", line: 4, value: "10.0.0.0/x" },
        { group: "exclude", line: 1, value: "2001:db8::/129" },
      ],
    })
  })

  test("merges adjacent and contained IPv4 CIDR blocks", () => {
    expect(
      mergeAndExcludeCidrs("192.168.1.0/24, 192.168.0.0/24\n192.168.0.0/25", "")
    ).toEqual({
      status: "success",
      cidrs: ["192.168.0.0/23"],
      mergeInputCount: 3,
      excludeInputCount: 0,
      familyLabels: ["IPv4"],
    })
  })

  test("normalizes duplicate and default IPv4 ranges", () => {
    expect(
      mergeAndExcludeCidrs("10.0.0.0/25\n10.0.0.0/24\n10.0.0.0/24", "")
    ).toEqual({
      status: "success",
      cidrs: ["10.0.0.0/24"],
      mergeInputCount: 3,
      excludeInputCount: 0,
      familyLabels: ["IPv4"],
    })

    expect(mergeAndExcludeCidrs("0.0.0.0/0", "")).toEqual({
      status: "success",
      cidrs: ["0.0.0.0/0"],
      mergeInputCount: 1,
      excludeInputCount: 0,
      familyLabels: ["IPv4"],
    })
  })

  test("excludes IPv4 ranges and emits a minimal covering list", () => {
    expect(mergeAndExcludeCidrs("10.0.0.0/24", "10.0.0.64/26")).toEqual({
      status: "success",
      cidrs: ["10.0.0.0/26", "10.0.0.128/25"],
      mergeInputCount: 1,
      excludeInputCount: 1,
      familyLabels: ["IPv4"],
    })
  })

  test("handles exclusions before, after, and across merge ranges", () => {
    expect(
      mergeAndExcludeCidrs(
        "10.0.1.0/24\n10.0.3.0/24",
        "10.0.0.0/24\n10.0.2.0/24\n10.0.3.0/24"
      )
    ).toEqual({
      status: "success",
      cidrs: ["10.0.1.0/24"],
      mergeInputCount: 2,
      excludeInputCount: 3,
      familyLabels: ["IPv4"],
    })
  })

  test("reports success with no CIDRs when exclusions remove everything", () => {
    expect(mergeAndExcludeCidrs("10.0.0.0/24", "10.0.0.0/24")).toEqual({
      status: "success",
      cidrs: [],
      mergeInputCount: 1,
      excludeInputCount: 1,
      familyLabels: ["IPv4"],
    })
  })

  test("supports IPv6 merge and exclude operations", () => {
    expect(mergeAndExcludeCidrs("2001:db8::/126", "2001:db8::1/128")).toEqual({
      status: "success",
      cidrs: ["2001:db8::/128", "2001:db8::2/127"],
      mergeInputCount: 1,
      excludeInputCount: 1,
      familyLabels: ["IPv6"],
    })
  })

  test("processes IPv4 and IPv6 families independently", () => {
    expect(
      mergeAndExcludeCidrs("10.0.0.0/24\n2001:db8::/127", "192.168.0.0/24")
    ).toEqual({
      status: "success",
      cidrs: ["10.0.0.0/24", "2001:db8::/127"],
      mergeInputCount: 2,
      excludeInputCount: 1,
      familyLabels: ["IPv4", "IPv6"],
    })
  })
})
