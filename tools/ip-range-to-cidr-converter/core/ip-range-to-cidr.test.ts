import { describe, expect, test } from "vitest"

import { parseIpAddress } from "./ip-address"
import { convertIpRangeToCidrs, coverIpRange } from "./ip-range-to-cidr"

describe("convertIpRangeToCidrs", () => {
  test("handles empty and incomplete input", () => {
    expect(convertIpRangeToCidrs("", "")).toEqual({ status: "empty" })
    expect(convertIpRangeToCidrs("192.168.0.1", "")).toEqual({
      status: "incomplete",
    })
  })

  test("rejects invalid or incompatible ranges", () => {
    expect(convertIpRangeToCidrs("not-an-ip", "192.168.0.1")).toEqual({
      status: "invalid",
    })
    expect(convertIpRangeToCidrs("192.168.0.1", "2001:db8::1")).toEqual({
      status: "mixed-family",
    })
    expect(convertIpRangeToCidrs("192.168.0.10", "192.168.0.1")).toEqual({
      status: "reversed",
    })
  })

  test("returns a single CIDR block for an aligned IPv4 range", () => {
    expect(convertIpRangeToCidrs("192.168.1.0", "192.168.1.255")).toEqual({
      status: "success",
      family: 4,
      start: "192.168.1.0",
      end: "192.168.1.255",
      cidrs: ["192.168.1.0/24"],
    })
  })

  test("returns the minimal IPv4 covering for an unaligned range", () => {
    expect(convertIpRangeToCidrs("192.168.1.10", "192.168.1.25")).toEqual({
      status: "success",
      family: 4,
      start: "192.168.1.10",
      end: "192.168.1.25",
      cidrs: [
        "192.168.1.10/31",
        "192.168.1.12/30",
        "192.168.1.16/29",
        "192.168.1.24/31",
      ],
    })
  })

  test("returns IPv6 CIDR blocks with canonical formatting", () => {
    expect(convertIpRangeToCidrs("2001:DB8::1", "2001:db8::3")).toEqual({
      status: "success",
      family: 6,
      start: "2001:db8::1",
      end: "2001:db8::3",
      cidrs: ["2001:db8::1/128", "2001:db8::2/127"],
    })
  })
})

describe("coverIpRange", () => {
  test("creates host-sized blocks for single addresses", () => {
    const ipv4 = parseIpAddress("10.0.0.5")
    const ipv6 = parseIpAddress("2001:db8::1")

    expect(ipv4 && coverIpRange(ipv4, ipv4)).toEqual(["10.0.0.5/32"])
    expect(ipv6 && coverIpRange(ipv6, ipv6)).toEqual(["2001:db8::1/128"])
  })

  test("covers a full IPv4 address space with a /0 block", () => {
    const start = parseIpAddress("0.0.0.0")
    const end = parseIpAddress("255.255.255.255")

    expect(start && end ? coverIpRange(start, end) : null).toEqual([
      "0.0.0.0/0",
    ])
  })

  test("creates an aligned IPv6 block when the range matches one", () => {
    const start = parseIpAddress("2001:db8::")
    const end = parseIpAddress("2001:db8::ff")

    expect(start && end ? coverIpRange(start, end) : null).toEqual([
      "2001:db8::/120",
    ])
  })
})
