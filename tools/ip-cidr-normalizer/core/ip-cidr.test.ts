import { describe, expect, test } from "vitest"

import { isValidIpOrCidr, normalizeIpCidr } from "./ip-cidr"

describe("ip-cidr core", () => {
  test("accepts valid IP and CIDR input", () => {
    expect(isValidIpOrCidr("192.168.0.1")).toBe(true)
    expect(isValidIpOrCidr("192.168.0.1/24")).toBe(true)
    expect(isValidIpOrCidr("2001:db8::1/64")).toBe(true)
    expect(isValidIpOrCidr("::ffff:192.168.0.1")).toBe(true)
  })

  test("rejects malformed IPv4 and CIDR values", () => {
    expect(isValidIpOrCidr("not-an-ip")).toBe(false)
    expect(isValidIpOrCidr("192.168.0")).toBe(false)
    expect(isValidIpOrCidr("1a.2.3.4")).toBe(false)
    expect(isValidIpOrCidr("192.168.0.1/99")).toBe(false)
    expect(isValidIpOrCidr("/24")).toBe(false)
    expect(isValidIpOrCidr("192.168.0.1/")).toBe(false)
  })

  test("rejects malformed IPv6 values", () => {
    expect(isValidIpOrCidr("2001:db8::1/129")).toBe(false)
    expect(isValidIpOrCidr("2001:::1")).toBe(false)
    expect(isValidIpOrCidr("fe80::1%eth0")).toBe(false)
    expect(isValidIpOrCidr(":2001:db8:1")).toBe(false)
    expect(isValidIpOrCidr("2001:db8:192.168.0.1:1")).toBe(false)
    expect(isValidIpOrCidr("::ffff:999.0.0.1")).toBe(false)
    expect(isValidIpOrCidr("1:2:3:4:5:6:7:8::")).toBe(false)
    expect(isValidIpOrCidr("2001:db8::1/64/1")).toBe(false)
  })

  test("returns empty for blank input", () => {
    expect(normalizeIpCidr("")).toEqual({ status: "empty" })
    expect(normalizeIpCidr("   ")).toEqual({ status: "empty" })
  })

  test("normalizes IPv4 addresses and CIDR notation", () => {
    expect(normalizeIpCidr("010.000.001.001")).toEqual({
      status: "success",
      normalized: "10.0.1.1",
    })
    expect(normalizeIpCidr("192.168.0.1/24")).toEqual({
      status: "success",
      normalized: "192.168.0.0/24",
    })
    expect(normalizeIpCidr("192.168.0.1/0")).toEqual({
      status: "success",
      normalized: "0.0.0.0/0",
    })
  })

  test("normalizes IPv6 addresses and CIDR blocks", () => {
    expect(normalizeIpCidr("2001:0db8:0000:0000::1")).toEqual({
      status: "success",
      normalized: "2001:db8::1",
    })
    expect(normalizeIpCidr("2001:db8:0:1:0:0:0:1")).toEqual({
      status: "success",
      normalized: "2001:db8:0:1::1",
    })
    expect(normalizeIpCidr("2001:db8:1:2:3:4:5:6")).toEqual({
      status: "success",
      normalized: "2001:db8:1:2:3:4:5:6",
    })
    expect(normalizeIpCidr("2001:db8::1234/64")).toEqual({
      status: "success",
      normalized: "2001:db8::/64",
    })
    expect(normalizeIpCidr("::ffff:192.168.0.1")).toEqual({
      status: "success",
      normalized: "::ffff:c0a8:1",
    })
    expect(normalizeIpCidr("2001:db8::1/0")).toEqual({
      status: "success",
      normalized: "::/0",
    })
  })

  test("returns invalid for malformed values during normalization", () => {
    expect(normalizeIpCidr("192.168.0.1/99")).toEqual({ status: "invalid" })
    expect(normalizeIpCidr("2001:::1")).toEqual({ status: "invalid" })
    expect(normalizeIpCidr("::ffff:999.0.0.1")).toEqual({
      status: "invalid",
    })
  })
})
