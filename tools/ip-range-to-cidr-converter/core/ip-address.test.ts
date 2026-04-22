import { describe, expect, test } from "vitest"

import { parseIpAddress, stringifyIpAddress } from "./ip-address"

describe("parseIpAddress", () => {
  test("parses IPv4 addresses", () => {
    const parsed = parseIpAddress("192.168.001.010")

    expect(parsed).not.toBeNull()
    expect(parsed?.family).toBe(4)
    expect(parsed?.value).toBe(3232235786n)
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("192.168.1.10")
  })

  test("parses compressed IPv6 addresses", () => {
    const parsed = parseIpAddress("2001:DB8::1")

    expect(parsed).not.toBeNull()
    expect(parsed?.family).toBe(6)
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("2001:db8::1")
  })

  test("parses IPv6 addresses with an embedded IPv4 tail", () => {
    const parsed = parseIpAddress("::ffff:192.168.0.1")

    expect(parsed).not.toBeNull()
    expect(parsed?.family).toBe(6)
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("::ffff:c0a8:1")
  })

  test("keeps IPv6 addresses without a compressible zero run expanded", () => {
    const parsed = parseIpAddress("2001:db8:1:2:3:4:5:6")

    expect(parsed).not.toBeNull()
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe(
      "2001:db8:1:2:3:4:5:6"
    )
  })

  test("stringifies the all-zero IPv6 address as ::", () => {
    const parsed = parseIpAddress("::")

    expect(parsed).not.toBeNull()
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("::")
  })

  test("compresses the first longest zero run in IPv6 output", () => {
    const parsed = parseIpAddress("2001:db8:0:0:1:0:0:1")

    expect(parsed).not.toBeNull()
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("2001:db8::1:0:0:1")
  })

  test("rejects malformed addresses", () => {
    expect(parseIpAddress("192.168.1")).toBeNull()
    expect(parseIpAddress("256.0.0.1")).toBeNull()
    expect(parseIpAddress("2001::db8::1")).toBeNull()
    expect(parseIpAddress("2001:db8::gggg")).toBeNull()
    expect(parseIpAddress("1:2:3:4:5:6:7::8")).toBeNull()
    expect(parseIpAddress("2001:db8:")).toBeNull()
    expect(parseIpAddress("fe80::1%eth0")).toBeNull()
    expect(parseIpAddress("2001:db8:192.168.0.1:1")).toBeNull()
  })
})
