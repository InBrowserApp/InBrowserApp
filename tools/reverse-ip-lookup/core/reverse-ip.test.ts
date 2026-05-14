import { describe, expect, test, vi } from "vitest"

import {
  BUILTIN_DOH_SERVERS,
  buildDohQueryUrl,
  createReverseLookupTarget,
  expandIpv6Hextets,
  extractPtrAnswers,
  getDnsRcodeLabel,
  lookupReverseIp,
  normalizeIpInput,
  parseReverseIpInput,
  toIpv4ReverseDomain,
  toIpv6ReverseDomain,
} from "./reverse-ip"

describe("reverse IP lookup core", () => {
  test("normalizes direct and bracketed IP input", () => {
    expect(normalizeIpInput("  8.8.8.8  ")).toBe("8.8.8.8")
    expect(normalizeIpInput(" [2001:db8::1] ")).toBe("2001:db8::1")
  })

  test("creates IPv4 reverse DNS domains", () => {
    expect(toIpv4ReverseDomain("192.168.1.1")).toBe("1.1.168.192.in-addr.arpa")
    expect(toIpv4ReverseDomain("255.255.255.255")).toBe(
      "255.255.255.255.in-addr.arpa"
    )
  })

  test("expands IPv6 hextets", () => {
    expect(expandIpv6Hextets("2001:db8::1")).toEqual([
      "2001",
      "0db8",
      "0000",
      "0000",
      "0000",
      "0000",
      "0000",
      "0001",
    ])
    expect(expandIpv6Hextets("::")).toHaveLength(8)
    expect(() => expandIpv6Hextets("1:2:3")).toThrow("Invalid IPv6 address.")
    expect(() => expandIpv6Hextets("1::2::3")).toThrow("Invalid IPv6 address.")
    expect(() => expandIpv6Hextets("1:2:3:4:5:6:7:8::")).toThrow(
      "Invalid IPv6 address."
    )
    expect(() => expandIpv6Hextets("1:2:3:4:5:6:7:8:9")).toThrow(
      "Invalid IPv6 address."
    )
    expect(() => expandIpv6Hextets("1:2:3:4:5:6:7:zzzz")).toThrow(
      "Invalid IPv6 address."
    )
  })

  test("creates IPv6 reverse DNS domains", () => {
    expect(toIpv6ReverseDomain("2001:db8::1")).toBe(
      "1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa"
    )
    expect(toIpv6ReverseDomain("::ffff:192.0.2.128")).toBe(
      "0.8.2.0.0.0.0.c.f.f.f.f.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa"
    )
    expect(() => toIpv6ReverseDomain("::ffff:999.0.2.128")).toThrow(
      "Invalid IPv4-embedded IPv6 address."
    )
  })

  test("parses valid, empty, and invalid input", () => {
    expect(parseReverseIpInput("").status).toBe("empty")
    expect(parseReverseIpInput("example.com").status).toBe("invalid")

    const result = parseReverseIpInput("8.8.4.4")
    const ipv6Result = parseReverseIpInput("[2001:db8::1]")

    expect(result.status).toBe("valid")
    expect(ipv6Result.status).toBe("valid")

    if (result.status === "valid") {
      expect(result.target.version).toBe("ipv4")
      expect(result.target.reverseDomain).toBe("4.4.8.8.in-addr.arpa")
    }

    if (ipv6Result.status === "valid") {
      expect(ipv6Result.target.version).toBe("ipv6")
      expect(ipv6Result.target.reverseDomain).toBe(
        "1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa"
      )
    }

    expect(() => createReverseLookupTarget("not an ip")).toThrow(
      "Enter a valid IPv4 or IPv6 address."
    )
  })

  test("builds DNS-over-HTTPS URLs without preserving stale query params", () => {
    const target = createReverseLookupTarget("1.1.1.1")
    const url = buildDohQueryUrl("https://dns.example/resolve?old=true", target)

    expect(url).toBe(
      "https://dns.example/resolve?name=1.1.1.1.in-addr.arpa&type=PTR"
    )
  })

  test("extracts PTR answers and DNS status labels", () => {
    expect(getDnsRcodeLabel(0)).toBe("NOERROR")
    expect(getDnsRcodeLabel(3)).toBe("NXDOMAIN")
    expect(getDnsRcodeLabel(99)).toBe("RCODE 99")
    expect(extractPtrAnswers({ Status: 3 })).toEqual([])

    expect(
      extractPtrAnswers({
        Status: 0,
        Answer: [
          {
            name: "1.1.1.1.in-addr.arpa.",
            type: 12,
            TTL: 300,
            data: "one.one.one.one.",
          },
          {
            name: "1.1.1.1.in-addr.arpa.",
            type: 1,
            TTL: 300,
            data: "1.1.1.1",
          },
        ],
      })
    ).toEqual([
      {
        hostname: "one.one.one.one",
        rawHostname: "one.one.one.one.",
        ttl: 300,
      },
    ])
  })

  test("queries a DoH resolver and classifies the response", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        Status: 0,
        Answer: [
          {
            name: "8.8.8.8.in-addr.arpa.",
            type: 12,
            TTL: 120,
            data: "dns.google.",
          },
        ],
      }),
    })) as unknown as typeof fetch

    const result = await lookupReverseIp(
      "8.8.8.8",
      BUILTIN_DOH_SERVERS[0]!.url,
      fetchMock
    )

    expect(fetchMock).toHaveBeenCalledWith(
      "https://cloudflare-dns.com/dns-query?name=8.8.8.8.in-addr.arpa&type=PTR",
      {
        method: "GET",
        headers: {
          Accept: "application/dns-json",
        },
      }
    )
    expect(result.target.ip).toBe("8.8.8.8")
    expect(result.rcode).toBe("NOERROR")
    expect(result.answers[0]?.hostname).toBe("dns.google")
  })

  test("throws when the DoH resolver returns an HTTP failure", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 502,
    })) as unknown as typeof fetch

    await expect(
      lookupReverseIp("8.8.8.8", "https://dns.example/resolve", fetchMock)
    ).rejects.toThrow("DNS-over-HTTPS request failed with HTTP 502.")
  })
})
