import { describe, expect, test } from "vitest"

import { convertMacToIpv6LinkLocal } from "./mac-to-ipv6-link-local"

describe("convertMacToIpv6LinkLocal", () => {
  test("converts a colon-delimited MAC address to an IPv6 link-local address", () => {
    expect(convertMacToIpv6LinkLocal("aa:bb:cc:dd:ee:ff")).toEqual({
      status: "success",
      ipv6: "fe80::a8bb:ccff:fedd:eeff",
    })
  })

  test("supports hyphen-delimited and separator-free MAC addresses", () => {
    expect(convertMacToIpv6LinkLocal("00-11-22-33-44-55")).toEqual({
      status: "success",
      ipv6: "fe80::211:22ff:fe33:4455",
    })
    expect(convertMacToIpv6LinkLocal("001122334455")).toEqual({
      status: "success",
      ipv6: "fe80::211:22ff:fe33:4455",
    })
  })

  test("supports dotted MAC addresses and appends a trimmed zone index", () => {
    expect(convertMacToIpv6LinkLocal("0011.2233.4455", " en0 ")).toEqual({
      status: "success",
      ipv6: "fe80::211:22ff:fe33:4455%en0",
    })
  })

  test("returns empty for blank input", () => {
    expect(convertMacToIpv6LinkLocal("   ")).toEqual({ status: "empty" })
  })

  test("returns invalid for malformed MAC addresses", () => {
    expect(convertMacToIpv6LinkLocal("not a mac")).toEqual({
      status: "invalid",
    })
    expect(convertMacToIpv6LinkLocal("aa:bb:cc:dd:ee")).toEqual({
      status: "invalid",
    })
    expect(convertMacToIpv6LinkLocal("0011.2233.445z")).toEqual({
      status: "invalid",
    })
  })
})
