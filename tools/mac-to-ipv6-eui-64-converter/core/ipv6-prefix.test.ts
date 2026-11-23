import { describe, expect, test } from "vitest"

import { combineIpv6Address, parseIpv6Prefix } from "./ipv6-prefix"

describe("IPv6 /64 prefix conversion", () => {
  test.each([
    [" 2001:0DB8:1:2:0:0:0:0/64 ", "2001:db8:1:2:211:22ff:fe33:4455"],
    ["fd12:3456:789a:1::/64", "fd12:3456:789a:1:211:22ff:fe33:4455"],
    ["fe80::/64", "fe80::211:22ff:fe33:4455"],
    ["2606:4700::", "2606:4700::211:22ff:fe33:4455"],
    ["::/64", "::211:22ff:fe33:4455"],
    ["ff02::/64", "ff02::211:22ff:fe33:4455"],
  ])("combines %s with a Modified EUI-64 ID", (prefix, ipv6) => {
    const parsed = parseIpv6Prefix(prefix)
    expect(parsed.status).toBe("valid")
    if (parsed.status === "valid") {
      expect(combineIpv6Address(parsed.network, "211:22ff:fe33:4455")).toBe(
        ipv6
      )
    }
  })

  test("treats whitespace as empty input", () => {
    expect(parseIpv6Prefix(" ")).toEqual({ status: "empty" })
  })

  test.each([
    "2001:db8::/48",
    "192.0.2.0/64",
    "2001:::db8/64",
    "2001:db8::1/64",
    "2001:db8:1:2:3::/64",
    "fe80::%eth0/64",
    "[fe80::]/64",
  ])("rejects %s", (input) => {
    expect(parseIpv6Prefix(input)).toEqual({ status: "invalid" })
  })
})
