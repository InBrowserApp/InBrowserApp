import { describe, expect, test, vi } from "vitest"

import {
  buildDohUrl,
  getRecordTypeName,
  getResponseCode,
  lookupDnsRecords,
  normalizeDnsName,
  queryDoh,
  type FetchLike,
} from "./dns-lookup"

function makeJsonResponse(
  body: unknown,
  ok = true,
  status = ok ? 200 : 503
): Pick<Response, "json" | "ok" | "status"> {
  return {
    ok,
    status,
    json: async () => body,
  }
}

describe("normalizeDnsName", () => {
  test("normalizes domains, URLs, and internationalized names", () => {
    expect(normalizeDnsName(" Example.COM. ")).toBe("example.com")
    expect(normalizeDnsName("https://www.example.com/path?q=1")).toBe(
      "www.example.com"
    )
    expect(normalizeDnsName("example.net/docs")).toBe("example.net")
    expect(normalizeDnsName("例え.テスト")).toBe("xn--r8jz45g.xn--zckzah")
  })

  test("rejects empty and malformed domains", () => {
    expect(() => normalizeDnsName("")).toThrow("Enter a domain name.")
    expect(() => normalizeDnsName("http://")).toThrow(
      "Enter a valid domain name."
    )
    expect(() => normalizeDnsName("https://example..com")).toThrow(
      "Enter a valid domain name."
    )
    expect(() => normalizeDnsName("-example.com")).toThrow(
      "Enter a valid domain name."
    )
    expect(() => normalizeDnsName("example-.com")).toThrow(
      "Enter a valid domain name."
    )
    expect(() => normalizeDnsName("exa_mple.com")).toThrow(
      "Enter a valid domain name."
    )
  })

  test("rejects overlong hostnames and labels", () => {
    expect(() => normalizeDnsName(`${"a".repeat(64)}.com`)).toThrow(
      "Enter a valid domain name."
    )
    expect(() =>
      normalizeDnsName(
        [
          "a".repeat(63),
          "b".repeat(63),
          "c".repeat(63),
          "d".repeat(63),
          "e".repeat(10),
        ].join(".")
      )
    ).toThrow("Enter a valid domain name.")
  })
})

describe("DNS lookup helpers", () => {
  test("builds DNS over HTTPS query URLs", () => {
    expect(buildDohUrl("https://dns.example/resolve", "example.com", "A")).toBe(
      "https://dns.example/resolve?name=example.com&type=A"
    )

    expect(
      buildDohUrl("https://dns.example/resolve", "example.com", "TXT", {
        checkingDisabled: true,
        dnssec: true,
      })
    ).toBe("https://dns.example/resolve?name=example.com&type=TXT&do=1&cd=1")
  })

  test("formats record types and response codes with fallbacks", () => {
    expect(getRecordTypeName(1)).toBe("A")
    expect(getRecordTypeName(65)).toBe("HTTPS")
    expect(getRecordTypeName(32769)).toBe("DLV")
    expect(getRecordTypeName(9999)).toBe("9999")

    expect(getResponseCode(0)).toEqual({
      name: "NoError",
      description: "No error",
    })
    expect(getResponseCode(999)).toEqual({
      name: "RCODE 999",
      description: "Unknown DNS response code",
    })
  })

  test("queries a DNS over HTTPS server", async () => {
    const response = {
      Status: 0,
      TC: false,
      RD: true,
      RA: true,
      AD: false,
      CD: false,
      Question: [{ name: "example.com.", type: 1 }],
      Answer: [
        { name: "example.com.", type: 1, TTL: 60, data: "93.184.216.34" },
      ],
    }
    const fetcher = vi
      .fn<FetchLike>()
      .mockResolvedValue(makeJsonResponse(response))

    await expect(
      queryDoh("https://dns.example/resolve", "example.com", "A", {}, fetcher)
    ).resolves.toBe(response)

    expect(fetcher).toHaveBeenCalledWith(
      "https://dns.example/resolve?name=example.com&type=A",
      {
        headers: {
          Accept: "application/dns-json",
        },
        method: "GET",
        signal: undefined,
      }
    )
  })

  test("uses the global fetcher when no fetcher is supplied", async () => {
    const fetchMock = vi
      .fn<FetchLike>()
      .mockResolvedValue(makeJsonResponse({ Status: 0 }))

    vi.stubGlobal("fetch", fetchMock)

    await expect(
      queryDoh("https://dns.example/resolve", "example.com", "AAAA")
    ).resolves.toEqual({ Status: 0 })

    vi.unstubAllGlobals()
  })

  test("raises an error when a DNS server returns a non-OK response", async () => {
    const fetcher = vi
      .fn<FetchLike>()
      .mockResolvedValue(makeJsonResponse({}, false, 502))

    await expect(
      queryDoh("https://dns.example/resolve", "example.com", "A", {}, fetcher)
    ).rejects.toThrow("DNS server returned HTTP 502.")
  })

  test("looks up unique supported records in the configured order", async () => {
    const fetcher = vi.fn<FetchLike>().mockImplementation(async (url) => {
      const type = new URL(url).searchParams.get("type")

      return makeJsonResponse({
        Status: 0,
        TC: false,
        RD: true,
        RA: true,
        AD: false,
        CD: false,
        Question: [{ name: "example.com.", type: type === "A" ? 1 : 15 }],
      })
    })

    const results = await lookupDnsRecords(
      "https://dns.example/resolve",
      "https://Example.com/path",
      ["MX", "A", "MX"],
      { dnssec: true },
      fetcher
    )

    expect(results.map((result) => result.recordType)).toEqual(["A", "MX"])
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(fetcher.mock.calls[0]?.[0]).toBe(
      "https://dns.example/resolve?name=example.com&type=A&do=1"
    )
  })

  test("rejects empty and unsupported record selections", async () => {
    const fetcher = vi.fn<FetchLike>()

    await expect(
      lookupDnsRecords(
        "https://dns.example/resolve",
        "example.com",
        [],
        {},
        fetcher
      )
    ).rejects.toThrow("Select at least one record type.")
    await expect(
      lookupDnsRecords(
        "https://dns.example/resolve",
        "example.com",
        ["UNSUPPORTED" as never],
        {},
        fetcher
      )
    ).rejects.toThrow("Select at least one supported record type.")
    expect(fetcher).not.toHaveBeenCalled()
  })
})
