import { describe, expect, test, vi } from "vitest"

import * as myIp from "./my-ip"
import {
  buildGoogleMapsUrl,
  dedupeIpAddresses,
  discoverWebRtcAddresses,
  EMPTY_IP_INFO,
  formatIpCoordinates,
  lookupIpInfo,
  lookupPublicIp,
  mergeIpInfoParts,
  parseCloudflareTraceIp,
  validatePublicIp,
} from "./my-ip"

describe("my-ip core", () => {
  test("re-exports the public helpers", () => {
    expect(typeof myIp.lookupPublicIp).toBe("function")
    expect(typeof myIp.lookupIpInfo).toBe("function")
    expect(myIp.EMPTY_IP_INFO).toEqual(EMPTY_IP_INFO)
  })

  test("validates IPv4 and IPv6 values", () => {
    expect(validatePublicIp("203.0.113.10", "ipv4")).toBe("203.0.113.10")
    expect(validatePublicIp("2001:db8::1", "ipv6")).toBe("2001:db8::1")
    expect(() => validatePublicIp("2001:db8::1", "ipv4")).toThrow(
      "Invalid IPV4"
    )
    expect(() => validatePublicIp(123, "ipv6")).toThrow("Invalid IPV6")
  })

  test("parses Cloudflare trace responses", () => {
    expect(
      parseCloudflareTraceIp(
        "fl=29f\nh=cloudflare.com\nip=203.0.113.10",
        "ipv4"
      )
    ).toBe("203.0.113.10")

    expect(
      parseCloudflareTraceIp("h=cloudflare.com\nip=2001:db8::1\n", "ipv6")
    ).toBe("2001:db8::1")

    expect(() =>
      parseCloudflareTraceIp("fl=29f\nh=cloudflare.com", "ipv4")
    ).toThrow("Failed to parse Cloudflare trace response")
  })

  test("looks up the first successful public IPv4 provider", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("api-ipv4.ip.sb")) {
        throw new Error("ip.sb failed")
      }

      if (url.includes("ipv4.geojs.io")) {
        return {
          json: async () => ({ ip: "203.0.113.10" }),
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupPublicIp("ipv4", fetchMock as typeof fetch)
    ).resolves.toBe("203.0.113.10")
  })

  test("looks up an IPv6 address from ip.sb", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("api-ipv6.ip.sb")) {
        return {
          json: async () => ({ ip: "2001:db8::1" }),
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupPublicIp("ipv6", fetchMock as typeof fetch)
    ).resolves.toBe("2001:db8::1")
  })

  test("falls back to geojs for IPv6 lookups", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("api-ipv6.ip.sb")) {
        throw new Error("ip.sb failed")
      }

      if (url.includes("ipv6.geojs.io")) {
        return {
          json: async () => ({ ip: "2001:db8::2" }),
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupPublicIp("ipv6", fetchMock as typeof fetch)
    ).resolves.toBe("2001:db8::2")
  })

  test("falls back to Cloudflare for IPv6 lookups", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("api-ipv6.ip.sb") || url.includes("ipv6.geojs.io")) {
        throw new Error("provider failed")
      }

      if (url.includes("cloudflare.com")) {
        return {
          text: async () => "ip=2001:db8::3",
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupPublicIp("ipv6", fetchMock as typeof fetch)
    ).resolves.toBe("2001:db8::3")
  })

  test("falls back to ipify for IPv6 lookups", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (
        url.includes("api-ipv6.ip.sb") ||
        url.includes("ipv6.geojs.io") ||
        url.includes("cloudflare.com")
      ) {
        throw new Error("provider failed")
      }

      if (url.includes("api64.ipify.org")) {
        return {
          json: async () => ({ ip: "2001:db8::4" }),
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupPublicIp("ipv6", fetchMock as typeof fetch)
    ).resolves.toBe("2001:db8::4")
  })

  test("rejects when every public IP provider fails", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("cloudflare.com")) {
        return {
          text: async () => "ip=not-an-ip",
        } as Response
      }

      return {
        json: async () => ({ ip: "not-an-ip" }),
      } as Response
    })

    await expect(
      lookupPublicIp("ipv4", fetchMock as typeof fetch)
    ).rejects.toBeInstanceOf(AggregateError)
  })

  test("merges IP info parts and keeps the first defined value", () => {
    expect(
      mergeIpInfoParts([
        {
          organization: "Example Org",
          timezone: "UTC",
        },
        {
          organization: "Later Org",
          hostname: "example.test",
        },
      ])
    ).toEqual({
      ...EMPTY_IP_INFO,
      hostname: "example.test",
      organization: "Example Org",
      timezone: "UTC",
    })
  })

  test("looks up IP info and fills missing fields with null", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/ip/geo/")) {
        return {
          json: async () => ({
            asn: "64496",
            country: "Exampleland",
            latitude: "40.7128",
            longitude: "-74.006",
            organization: "GeoJS Example",
            organization_name: "GeoJS ASN",
            timezone: "Etc/UTC",
          }),
        } as Response
      }

      if (url.includes("api.ip.sb/geoip/")) {
        return {
          json: async () => ({
            asn: 64496,
            asn_organization: "Example ASN",
            country: "Exampleland",
            isp: "Example ISP",
            latitude: 40.7128,
            longitude: -74.006,
            organization: "Example Org",
            timezone: "Etc/UTC",
          }),
        } as Response
      }

      if (url.includes("/dns/ptr/")) {
        return {
          json: async () => ({
            ptr: "host.example.test",
          }),
        } as Response
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(
      lookupIpInfo("203.0.113.10", fetchMock as typeof fetch)
    ).resolves.toEqual({
      asn: 64496,
      asnOrganization: "GeoJS ASN",
      country: "Exampleland",
      hostname: "host.example.test",
      isp: "Example ISP",
      latitude: 40.7128,
      longitude: -74.006,
      organization: "GeoJS Example",
      timezone: "Etc/UTC",
    })
  })

  test("normalizes empty strings and invalid numeric values to null", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/ip/geo/")) {
        return {
          json: async () => ({
            asn: "not-a-number",
            country: " ",
            latitude: "bad",
            longitude: "",
            organization: "",
            organization_name: " ",
            timezone: "",
          }),
        } as Response
      }

      if (url.includes("api.ip.sb/geoip/")) {
        throw new Error("ip.sb failed")
      }

      return {
        json: async () => ({
          ptr: "Failed to get PTR record",
        }),
      } as Response
    })

    await expect(
      lookupIpInfo("203.0.113.10", fetchMock as typeof fetch)
    ).resolves.toEqual(EMPTY_IP_INFO)
  })

  test("ignores failed IP info providers", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes("/ip/geo/")) {
        throw new Error("geo lookup failed")
      }

      if (url.includes("api.ip.sb/geoip/")) {
        return {
          json: async () => ({
            country: "Exampleland",
          }),
        } as Response
      }

      return {
        json: async () => ({
          ptr: "Failed to get PTR record",
        }),
      } as Response
    })

    await expect(
      lookupIpInfo("203.0.113.10", fetchMock as typeof fetch)
    ).resolves.toEqual({
      ...EMPTY_IP_INFO,
      country: "Exampleland",
    })
  })

  test("formats location values and Google Maps links", () => {
    expect(
      formatIpCoordinates({
        latitude: 40.7128,
        longitude: -74.006,
      })
    ).toBe("-74.006 / 40.7128")
    expect(
      buildGoogleMapsUrl({
        latitude: 40.7128,
        longitude: -74.006,
      })
    ).toBe("https://www.google.com/maps/search/?api=1&query=40.7128,-74.006")
    expect(
      formatIpCoordinates({
        latitude: null,
        longitude: -74.006,
      })
    ).toBeNull()
    expect(
      buildGoogleMapsUrl({
        latitude: 40.7128,
        longitude: null,
      })
    ).toBeUndefined()
  })

  test("deduplicates plain and WebRTC-discovered addresses", async () => {
    expect(
      dedupeIpAddresses(["203.0.113.10", "203.0.113.10", "fe80::1"])
    ).toEqual(["203.0.113.10", "fe80::1"])

    await expect(
      discoverWebRtcAddresses(async () => [
        { address: "10.0.0.1" },
        { address: "10.0.0.1" },
        { address: "fe80::1" },
        { address: 123 as unknown as string },
      ])
    ).resolves.toEqual(["10.0.0.1", "fe80::1"])
  })
})
