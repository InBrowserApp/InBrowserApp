import { describe, expect, test } from "vitest"

import {
  IPV4_BITS,
  IPV6_BITS,
  bitSizeForFamily,
  createAddressFromValue,
  parseIpAddress,
  stringifyIpAddress,
} from "./ip-address"

describe("ip-address core", () => {
  test("reports the bit size for each address family", () => {
    expect(bitSizeForFamily(4)).toBe(IPV4_BITS)
    expect(bitSizeForFamily(6)).toBe(IPV6_BITS)
  })

  test("parses and stringifies IPv4 addresses", () => {
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

  test("creates canonical addresses from integer values", () => {
    const ipv4 = createAddressFromValue(3232235521n, 4)
    const ipv6 = createAddressFromValue(
      42540766411282592856903984951653826561n,
      6
    )

    expect(stringifyIpAddress(ipv4)).toBe("192.168.0.1")
    expect(stringifyIpAddress(ipv6)).toBe("2001:db8::1")
  })

  test("preserves IPv6 addresses without a compressible zero run", () => {
    const parsed = parseIpAddress("2001:db8:1:2:3:4:5:6")

    expect(parsed).not.toBeNull()
    expect(parsed ? stringifyIpAddress(parsed) : null).toBe(
      "2001:db8:1:2:3:4:5:6"
    )
  })

  test("compresses the first longest IPv6 zero run and handles ::", () => {
    const parsed = parseIpAddress("2001:db8:0:0:1:0:0:1")
    const zeroAddress = parseIpAddress("::")

    expect(parsed ? stringifyIpAddress(parsed) : null).toBe("2001:db8::1:0:0:1")
    expect(zeroAddress ? stringifyIpAddress(zeroAddress) : null).toBe("::")
  })

  test("rejects malformed IPv4 and IPv6 input", () => {
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
