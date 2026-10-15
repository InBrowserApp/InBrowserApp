import { afterEach, describe, expect, test, vi } from "vitest"

import {
  ULA_GLOBAL_ID_BITS,
  ULA_INTERFACE_ID_BITS,
  ULA_SUBNET_COUNT,
  ULA_SUBNET_ID_BITS,
  createIpv6UlaPrefix,
  deriveIpv6UlaSubnet,
  generateIpv6UlaPrefix,
  normalizeSubnetId,
} from "./ipv6-ula"

import type { RandomSource } from "./ipv6-ula"

function randomSourceWith(values: readonly number[]) {
  const getRandomValues = vi.fn((array: ArrayBufferView | null) => {
    const bytes = array as Uint8Array
    bytes.set(values)
    return array
  })

  return {
    source: { getRandomValues } as RandomSource,
    getRandomValues,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("IPv6 ULA core", () => {
  test("maps exactly 40 random bits to a canonical RFC 4193 /48", () => {
    const prefix = createIpv6UlaPrefix(
      Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x9a])
    )

    expect(prefix).toEqual({
      networkHextets: [0xfd12, 0x3456, 0x789a],
      globalId: "123456789a",
      sitePrefix: "fd12:3456:789a::/48",
      firstSubnet: "fd12:3456:789a::/64",
      lastSubnet: "fd12:3456:789a:ffff::/64",
    })
    expect(ULA_GLOBAL_ID_BITS).toBe(40)
    expect(ULA_SUBNET_ID_BITS).toBe(16)
    expect(ULA_INTERFACE_ID_BITS).toBe(64)
    expect(ULA_SUBNET_COUNT).toBe(65_536)
  })

  test("formats zero and all-ff Global ID boundaries canonically", () => {
    const zero = createIpv6UlaPrefix(new Uint8Array(5))
    const allFf = createIpv6UlaPrefix(new Uint8Array(5).fill(0xff))

    expect(zero.globalId).toBe("0000000000")
    expect(zero.sitePrefix).toBe("fd00::/48")
    expect(zero.firstSubnet).toBe("fd00::/64")
    expect(zero.lastSubnet).toBe("fd00:0:0:ffff::/64")
    expect(allFf.globalId).toBe("ffffffffff")
    expect(allFf.sitePrefix).toBe("fdff:ffff:ffff::/48")
    expect(allFf.firstSubnet).toBe("fdff:ffff:ffff::/64")
    expect(allFf.lastSubnet).toBe("fdff:ffff:ffff:ffff::/64")
  })

  test("keeps internal zero hextets while compressing the trailing run", () => {
    const prefix = createIpv6UlaPrefix(
      Uint8Array.from([0x00, 0x01, 0x00, 0x00, 0x00])
    )

    expect(prefix.sitePrefix).toBe("fd00:100::/48")
    expect(prefix.lastSubnet).toBe("fd00:100:0:ffff::/64")
  })

  test("derives canonical /64 subnets and normalizes their IDs", () => {
    const prefix = createIpv6UlaPrefix(
      Uint8Array.from([0x12, 0x34, 0x56, 0x78, 0x9a])
    )

    expect(deriveIpv6UlaSubnet(prefix, "0000")).toEqual({
      subnetId: "0000",
      prefix: "fd12:3456:789a::/64",
    })
    expect(deriveIpv6UlaSubnet(prefix, "ffff")).toEqual({
      subnetId: "ffff",
      prefix: "fd12:3456:789a:ffff::/64",
    })
    expect(deriveIpv6UlaSubnet(prefix, " 00AF ")).toEqual({
      subnetId: "00af",
      prefix: "fd12:3456:789a:af::/64",
    })
    expect(deriveIpv6UlaSubnet(prefix, "f")).toEqual({
      subnetId: "000f",
      prefix: "fd12:3456:789a:f::/64",
    })
  })

  test("rejects empty, malformed, and out-of-range Subnet IDs", () => {
    const invalidValues = ["", "-1", "0x1", "gggg", "10000", "1 2"]

    for (const value of invalidValues) {
      expect(normalizeSubnetId(value)).toBeNull()
    }

    const prefix = createIpv6UlaPrefix(new Uint8Array(5))
    expect(deriveIpv6UlaSubnet(prefix, "nope")).toBeNull()
  })

  test("requires exactly five bytes for the Global ID", () => {
    expect(() => createIpv6UlaPrefix(new Uint8Array(4))).toThrow(
      "exactly 5 bytes"
    )
  })

  test("requests one five-byte buffer from the supplied random source", () => {
    const { source, getRandomValues } = randomSourceWith([
      0x12, 0x34, 0x56, 0x78, 0x9a,
    ])

    const prefix = generateIpv6UlaPrefix(source)

    expect(prefix.sitePrefix).toBe("fd12:3456:789a::/48")
    expect(getRandomValues).toHaveBeenCalledTimes(1)
    const [bytes] = getRandomValues.mock.calls[0]!
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect((bytes as Uint8Array).length).toBe(5)
  })

  test("uses global Web Crypto when no random source is supplied", () => {
    const getRandomValues = vi.fn((array: Uint8Array) => {
      array.set([0xab, 0xcd, 0xef, 0x01, 0x23])
      return array
    })
    vi.stubGlobal("crypto", { getRandomValues })

    expect(generateIpv6UlaPrefix().sitePrefix).toBe("fdab:cdef:123::/48")
    expect(getRandomValues).toHaveBeenCalledTimes(1)
  })

  test("fails explicitly without Web Crypto and never uses Math.random", () => {
    const random = vi.spyOn(Math, "random")
    vi.stubGlobal("crypto", undefined)

    expect(() => generateIpv6UlaPrefix()).toThrow("crypto.getRandomValues")
    expect(random).not.toHaveBeenCalled()
  })

  test("propagates random source failures without an insecure fallback", () => {
    const random = vi.spyOn(Math, "random")
    const source = {
      getRandomValues: vi.fn(() => {
        throw new Error("random source failed")
      }),
    } as unknown as RandomSource

    expect(() => generateIpv6UlaPrefix(source)).toThrow("random source failed")
    expect(random).not.toHaveBeenCalled()
  })
})
