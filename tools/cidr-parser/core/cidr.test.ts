import { describe, expect, test } from "vitest"

import { parseCidr } from "./cidr"

describe("cidr parser core", () => {
  test("returns empty for blank input", () => {
    expect(parseCidr("")).toEqual({ status: "empty" })
    expect(parseCidr("   ")).toEqual({ status: "empty" })
  })

  test("rejects malformed CIDR blocks", () => {
    expect(parseCidr("not-a-cidr")).toEqual({ status: "invalid" })
    expect(parseCidr("192.168.0.1")).toEqual({ status: "invalid" })
    expect(parseCidr("/24")).toEqual({ status: "invalid" })
    expect(parseCidr("999.999.999.999/24")).toEqual({ status: "invalid" })
    expect(parseCidr("192.168.0.1/abc")).toEqual({ status: "invalid" })
    expect(parseCidr("192.168.0.1/99")).toEqual({ status: "invalid" })
    expect(parseCidr("2001:db8::1/129")).toEqual({ status: "invalid" })
    expect(parseCidr("2001:db8::1/64/1")).toEqual({ status: "invalid" })
  })

  test("parses IPv4 networks and canonicalizes host-address input", () => {
    const result = parseCidr("192.168.10.34/24")

    expect(result).toEqual({
      status: "success",
      details: {
        family: 4,
        prefix: 24,
        hostBits: 8,
        inputAddress: "192.168.10.34",
        canonicalCidr: "192.168.10.0/24",
        networkAddress: "192.168.10.0",
        rangeStart: "192.168.10.0",
        rangeEnd: "192.168.10.255",
        firstUsable: "192.168.10.1",
        lastUsable: "192.168.10.254",
        broadcastAddress: "192.168.10.255",
        netmask: "255.255.255.0",
        wildcardMask: "0.0.0.255",
        addressCount: 256n,
        usableAddressCount: 254n,
        startInteger: "3232238080",
        endInteger: "3232238335",
      },
    })
  })

  test("parses IPv4 default routes", () => {
    expect(parseCidr("0.0.0.0/0")).toEqual({
      status: "success",
      details: {
        family: 4,
        prefix: 0,
        hostBits: 32,
        inputAddress: "0.0.0.0",
        canonicalCidr: "0.0.0.0/0",
        networkAddress: "0.0.0.0",
        rangeStart: "0.0.0.0",
        rangeEnd: "255.255.255.255",
        firstUsable: "0.0.0.1",
        lastUsable: "255.255.255.254",
        broadcastAddress: "255.255.255.255",
        netmask: "0.0.0.0",
        wildcardMask: "255.255.255.255",
        addressCount: 4294967296n,
        usableAddressCount: 4294967294n,
        startInteger: "0",
        endInteger: "4294967295",
      },
    })
  })

  test("treats IPv4 /31 and /32 blocks as fully usable", () => {
    const pointToPoint = parseCidr("10.0.0.0/31")
    const hostOnly = parseCidr("10.0.0.1/32")

    expect(pointToPoint).toEqual({
      status: "success",
      details: {
        family: 4,
        prefix: 31,
        hostBits: 1,
        inputAddress: "10.0.0.0",
        canonicalCidr: "10.0.0.0/31",
        networkAddress: "10.0.0.0",
        rangeStart: "10.0.0.0",
        rangeEnd: "10.0.0.1",
        firstUsable: "10.0.0.0",
        lastUsable: "10.0.0.1",
        broadcastAddress: "10.0.0.1",
        netmask: "255.255.255.254",
        wildcardMask: "0.0.0.1",
        addressCount: 2n,
        usableAddressCount: 2n,
        startInteger: "167772160",
        endInteger: "167772161",
      },
    })
    expect(hostOnly).toEqual({
      status: "success",
      details: {
        family: 4,
        prefix: 32,
        hostBits: 0,
        inputAddress: "10.0.0.1",
        canonicalCidr: "10.0.0.1/32",
        networkAddress: "10.0.0.1",
        rangeStart: "10.0.0.1",
        rangeEnd: "10.0.0.1",
        firstUsable: "10.0.0.1",
        lastUsable: "10.0.0.1",
        broadcastAddress: "10.0.0.1",
        netmask: "255.255.255.255",
        wildcardMask: "0.0.0.0",
        addressCount: 1n,
        usableAddressCount: 1n,
        startInteger: "167772161",
        endInteger: "167772161",
      },
    })
  })

  test("parses IPv6 networks", () => {
    const result = parseCidr("2001:db8:abcd::123/64")

    expect(result).toEqual({
      status: "success",
      details: {
        family: 6,
        prefix: 64,
        hostBits: 64,
        inputAddress: "2001:db8:abcd::123",
        canonicalCidr: "2001:db8:abcd::/64",
        networkAddress: "2001:db8:abcd::",
        rangeStart: "2001:db8:abcd::",
        rangeEnd: "2001:db8:abcd:0:ffff:ffff:ffff:ffff",
        firstUsable: "2001:db8:abcd::",
        lastUsable: "2001:db8:abcd:0:ffff:ffff:ffff:ffff",
        broadcastAddress: null,
        netmask: null,
        wildcardMask: null,
        addressCount: 18446744073709551616n,
        usableAddressCount: 18446744073709551616n,
        startInteger: "42540766464452359329374990684406153216",
        endInteger: "42540766464452359347821734758115704831",
      },
    })
  })
})
