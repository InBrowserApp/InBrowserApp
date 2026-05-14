import { describe, expect, test, vi } from "vitest"

import {
  BUILTIN_DOH_SERVERS,
  EMPTY_IP_INFO,
  buildDohQueryUrl,
  buildMapUrl,
  dedupeAddressRecords,
  extractAddressRecords,
  formatIpCoordinates,
  isValidDomainName,
  lookupIpInfoTarget,
  lookupIpMetadata,
  mergeIpInfoParts,
  normalizeIpAddress,
  parseLookupInput,
  resolveDomainAddresses,
} from "./ip-info-lookup"

describe("IP info lookup core", () => {
  test("parses IP, domain, URL, empty, and invalid targets", () => {
    expect(parseLookupInput("").status).toBe("empty")
    expect(parseLookupInput("localhost").status).toBe("invalid")
    expect(parseLookupInput("-example.com").status).toBe("invalid")
    expect(isValidDomainName("example.com")).toBe(true)
    expect(isValidDomainName("example")).toBe(false)

    const ipv4 = parseLookupInput("  8.8.8.8  ")
    const ipv6Url = parseLookupInput("https://[2001:db8::1]/dns-query")
    const domain = parseLookupInput("https://Example.COM:443/path?q=1")

    expect(ipv4.status).toBe("valid")
    expect(ipv6Url.status).toBe("valid")
    expect(domain.status).toBe("valid")

    if (ipv4.status === "valid") {
      expect(ipv4.target).toMatchObject({
        kind: "ip",
        normalized: "8.8.8.8",
        version: "ipv4",
      })
    }

    if (ipv6Url.status === "valid") {
      expect(ipv6Url.target).toMatchObject({
        kind: "ip",
        normalized: "2001:db8::1",
        version: "ipv6",
      })
    }

    if (domain.status === "valid") {
      expect(domain.target).toMatchObject({
        kind: "domain",
        normalized: "example.com",
      })
    }
  })

  test("normalizes direct IP addresses", () => {
    expect(normalizeIpAddress("[2001:db8::1]")).toEqual({
      address: "2001:db8::1",
      version: "ipv6",
    })
    expect(normalizeIpAddress("[2001:db8::1]:443")).toEqual({
      address: "2001:db8::1",
      version: "ipv6",
    })
    expect(normalizeIpAddress("[2001:db8::1")).toBeNull()
    expect(normalizeIpAddress("not-an-ip")).toBeNull()
  })

  test("builds DNS-over-HTTPS queries and extracts address answers", () => {
    expect(
      buildDohQueryUrl("https://dns.example/resolve?old=true", "example.com", {
        label: "AAAA",
        code: 28,
      })
    ).toBe("https://dns.example/resolve?name=example.com&type=AAAA")

    expect(
      extractAddressRecords(
        {
          Status: 0,
          Answer: [
            {
              type: 1,
              TTL: 300,
              data: "93.184.216.34",
            },
            {
              type: 28,
              data: "2001:db8::1",
            },
            {
              type: 5,
              TTL: 300,
              data: "alias.example.com.",
            },
            {
              type: 1,
              TTL: 300,
              data: "not an ip",
            },
          ],
        },
        { label: "A", code: 1 }
      )
    ).toEqual([
      {
        type: "A",
        value: "93.184.216.34",
        ttl: 300,
      },
    ])

    expect(
      extractAddressRecords(
        {
          Status: 0,
          Answer: [
            {
              type: 28,
              data: "2001:db8::1",
            },
          ],
        },
        { label: "AAAA", code: 28 }
      )
    ).toEqual([
      {
        type: "AAAA",
        value: "2001:db8::1",
        ttl: null,
      },
    ])
  })

  test("deduplicates and resolves domain address records", async () => {
    expect(
      dedupeAddressRecords([
        { type: "A", value: "1.1.1.1", ttl: 300 },
        { type: "A", value: "1.1.1.1", ttl: 60 },
        { type: "AAAA", value: "2001:db8::1", ttl: null },
      ])
    ).toEqual([
      { type: "A", value: "1.1.1.1", ttl: 300 },
      { type: "AAAA", value: "2001:db8::1", ttl: null },
    ])

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("type=AAAA")) {
        return {
          ok: true,
          json: async () => ({
            Status: 0,
            Answer: [{ type: 28, TTL: 120, data: "2001:db8::1" }],
          }),
        } as Response
      }

      return {
        ok: true,
        json: async () => ({
          Status: 0,
          Answer: [
            { type: 1, TTL: 300, data: "93.184.216.34" },
            { type: 1, TTL: 60, data: "93.184.216.34" },
          ],
        }),
      } as Response
    })

    await expect(
      resolveDomainAddresses(
        "example.com",
        BUILTIN_DOH_SERVERS[0]!.url,
        fetchMock as typeof fetch
      )
    ).resolves.toEqual([
      { type: "A", value: "93.184.216.34", ttl: 300 },
      { type: "AAAA", value: "2001:db8::1", ttl: 120 },
    ])
  })

  test("fails domain resolution when every DNS query fails", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 502,
    })) as unknown as typeof fetch

    await expect(
      resolveDomainAddresses("example.com", "https://dns.example", fetchMock)
    ).rejects.toThrow("All DNS address queries failed.")
  })

  test("merges IP metadata, coordinates, and map URLs", () => {
    expect(
      mergeIpInfoParts([
        {
          organization: "GeoJS Org",
          country: "Exampleland",
          latitude: 40.7,
          longitude: -74,
        },
        {
          organization: "Later Org",
          hostname: "host.example.test",
          isp: "Example ISP",
        },
      ])
    ).toEqual({
      ...EMPTY_IP_INFO,
      hostname: "host.example.test",
      isp: "Example ISP",
      organization: "GeoJS Org",
      country: "Exampleland",
      latitude: 40.7,
      longitude: -74,
    })

    expect(formatIpCoordinates({ latitude: 40.7, longitude: -74 })).toBe(
      "40.7, -74"
    )
    expect(formatIpCoordinates({ latitude: null, longitude: -74 })).toBeNull()
    expect(buildMapUrl({ latitude: 40.7, longitude: -74 })).toContain(
      "query=40.7,-74"
    )
    expect(buildMapUrl({ latitude: 40.7, longitude: null })).toBeUndefined()
  })

  test("looks up metadata and fills unavailable fields with null", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/ip/geo/")) {
        return {
          ok: true,
          json: async () => ({
            asn: "64496",
            city: "",
            country: "Exampleland",
            country_code: "EX",
            latitude: "40.7128",
            longitude: "-74.006",
            organization: "GeoJS Example",
            organization_name: "GeoJS ASN",
            region: "Example Region",
            timezone: "Etc/UTC",
          }),
        } as Response
      }

      if (url.includes("api.ip.sb/geoip/")) {
        return {
          ok: true,
          json: async () => ({
            asn: 64496,
            asn_organization: "Example ASN",
            country: "Exampleland",
            isp: "Example ISP",
            latitude: 40.7128,
            longitude: -74.006,
            organization: "Example Org",
            postal_code: "10001",
            timezone: "Etc/UTC",
          }),
        } as Response
      }

      return {
        ok: true,
        json: async () => ({
          ptr: "host.example.test",
        }),
      } as Response
    })

    await expect(
      lookupIpMetadata("93.184.216.34", fetchMock as typeof fetch)
    ).resolves.toEqual({
      ...EMPTY_IP_INFO,
      hostname: "host.example.test",
      isp: "Example ISP",
      organization: "GeoJS Example",
      asn: 64496,
      asnOrganization: "GeoJS ASN",
      country: "Exampleland",
      countryCode: "EX",
      region: "Example Region",
      postalCode: "10001",
      timezone: "Etc/UTC",
      latitude: 40.7128,
      longitude: -74.006,
    })
  })

  test("keeps empty metadata when providers fail or PTR is unavailable", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/dns/ptr/")) {
        return {
          ok: true,
          json: async () => ({
            ptr: "Failed to get PTR record",
          }),
        } as Response
      }

      return {
        ok: false,
        status: 500,
      } as Response
    })

    await expect(
      lookupIpMetadata("192.0.2.1", fetchMock as typeof fetch)
    ).resolves.toEqual(EMPTY_IP_INFO)
  })

  test("normalizes blank numeric metadata to unavailable", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/ip/geo/")) {
        return {
          ok: true,
          json: async () => ({
            asn: "",
            latitude: "",
            longitude: "not-a-number",
          }),
        } as Response
      }

      return {
        ok: false,
        status: 500,
      } as Response
    })

    await expect(
      lookupIpMetadata("192.0.2.1", fetchMock as typeof fetch)
    ).resolves.toEqual(EMPTY_IP_INFO)
  })

  test("looks up direct IPs and resolved domains", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("type=AAAA")) {
        return {
          ok: true,
          json: async () => ({ Status: 0 }),
        } as Response
      }

      if (url.includes("type=A")) {
        return {
          ok: true,
          json: async () => ({
            Status: 0,
            Answer: [{ type: 1, TTL: 300, data: "93.184.216.34" }],
          }),
        } as Response
      }

      return {
        ok: true,
        json: async () => ({}),
      } as Response
    })

    await expect(
      lookupIpInfoTarget(
        "https://example.com",
        "https://dns.example",
        fetchMock
      )
    ).resolves.toMatchObject({
      target: {
        kind: "domain",
        normalized: "example.com",
      },
      records: [{ value: "93.184.216.34" }],
      addresses: [{ address: "93.184.216.34", version: "ipv4" }],
    })

    await expect(
      lookupIpInfoTarget("8.8.8.8", "https://dns.example", fetchMock)
    ).resolves.toMatchObject({
      target: {
        kind: "ip",
        normalized: "8.8.8.8",
      },
      records: [],
      addresses: [{ address: "8.8.8.8", version: "ipv4" }],
    })

    await expect(
      lookupIpInfoTarget("not a target", "https://dns.example", fetchMock)
    ).rejects.toThrow("Enter a valid IP address, domain, or URL.")
  })
})
