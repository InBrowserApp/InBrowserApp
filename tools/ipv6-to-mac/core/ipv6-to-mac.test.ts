import { describe, expect, test } from "vitest"

import { convertIpv6ToMac } from "./ipv6-to-mac"

describe("convertIpv6ToMac", () => {
  test("returns empty for blank input", () => {
    expect(convertIpv6ToMac("   ")).toEqual({ status: "empty" })
  })

  test("converts an EUI-64 derived link-local address", () => {
    expect(convertIpv6ToMac("fe80::a8bb:ccff:fedd:eeff")).toEqual({
      status: "success",
      mac: "AA:BB:CC:DD:EE:FF",
    })
  })

  test("converts an expanded uppercase address", () => {
    expect(convertIpv6ToMac("FE80:0000:0000:0000:A8BB:CCFF:FEDD:EEFF")).toEqual(
      {
        status: "success",
        mac: "AA:BB:CC:DD:EE:FF",
      }
    )
  })

  test("ignores an IPv6 zone index", () => {
    expect(convertIpv6ToMac("fe80::a8bb:ccff:fedd:eeff%eth0")).toEqual({
      status: "success",
      mac: "AA:BB:CC:DD:EE:FF",
    })
  })

  test("returns not-convertible for valid IPv6 addresses without EUI-64 bytes", () => {
    expect(convertIpv6ToMac("2001:db8::1")).toEqual({
      status: "not-convertible",
    })
    expect(convertIpv6ToMac("::ffff:192.0.2.128")).toEqual({
      status: "not-convertible",
    })
  })

  test("returns invalid for malformed IPv6 addresses", () => {
    expect(convertIpv6ToMac("not-an-ip")).toEqual({ status: "invalid" })
    expect(convertIpv6ToMac("2001:::1")).toEqual({ status: "invalid" })
    expect(convertIpv6ToMac("2001:db8::gggg")).toEqual({
      status: "invalid",
    })
    expect(convertIpv6ToMac("::ffff:192.0.2.999")).toEqual({
      status: "invalid",
    })
  })
})
