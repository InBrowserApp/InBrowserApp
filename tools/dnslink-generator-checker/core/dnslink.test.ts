import { afterEach, expect, it, vi } from "vitest"

import { checkDnslink, dnslinkName, parseTarget, targetKey } from "./dnslink"

const version0 = "QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN"
const version1 = "bafybeie5c2xqxv72fokquxqckoo3equu5ifbxw2aoprbnycswjq7bqdjyu"

afterEach(() => vi.unstubAllGlobals())

it("normalizes domains and accounts for the DNSLink prefix in the DNS name length", () => {
  expect(dnslinkName("https://例え.テスト/index.html")).toBe(
    "_dnslink.xn--r8jz45g.xn--zckzah"
  )
  expect(dnslinkName("_dnslink.Example.com.")).toBe("_dnslink.example.com")
  expect(dnslinkName("a..b")).toBeNull()
  expect(dnslinkName(Array(4).fill("a".repeat(61)).join("."))).toBeNull()
})

it("normalizes supported targets and compares content addresses", () => {
  expect(parseTarget(version0)).toBe(`/ipfs/${version0}`)
  expect(parseTarget(`ipfs://${version1}/index.html`)).toBe(
    `/ipfs/${version1}/index.html`
  )
  expect(parseTarget("dnslink=/ipns/DOCS.Example.com./main")).toBe(
    "/ipns/docs.example.com/main"
  )
  expect(parseTarget(`/ipns/${version0}`)).toBe(`/ipns/${version0}`)
  expect(parseTarget(`ipfs://${version0}/a?key=value`)).toBeNull()
  expect(parseTarget("/ipns/a_b.example")).toBeNull()
  expect(parseTarget("/ipns/local")).toBeNull()
  expect(parseTarget("/ipns/site.example:3000")).toBeNull()
  expect(parseTarget("bad")).toBeNull()
  expect(parseTarget("")).toBeNull()
  expect(targetKey(`/ipfs/${version0}`)).toMatch(/^\/ipfs\/bafy/)
  expect(targetKey("/ipns/docs.example.com/path")).toBe(
    "/ipns/docs.example.com/path"
  )
})

it("reads raw and split TXT strings and retains invalid targets for debugging", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        Status: 0,
        TC: false,
        Answer: [
          { type: 5, data: "alias.example.com." },
          { type: 16, data: '"spf=example"' },
          { type: 16, data: `"dnslink=/ipfs/" "${version1}"`, TTL: 60 },
          { type: 16, data: '"dnslink=/ipfs/bad"', TTL: 30 },
        ],
      })
    )
    .mockResolvedValueOnce(
      Response.json({
        Status: 0,
        TC: false,
        Answer: [{ type: 16, data: "dnslink=/ipns/example.com", TTL: 190 }],
      })
    )
  vi.stubGlobal("fetch", fetchMock)
  const results = await checkDnslink(
    "_dnslink.example.com",
    new AbortController().signal
  )
  expect(fetchMock.mock.calls.map(([value]) => new URL(value).search)).toEqual([
    "?name=_dnslink.example.com&type=TXT",
    "?name=_dnslink.example.com&type=TXT",
  ])
  expect(results[0]?.records).toEqual([
    { target: `/ipfs/${version1}`, normalized: `/ipfs/${version1}`, ttl: 60 },
    { target: "/ipfs/bad", normalized: null, ttl: 30 },
  ])
  expect(results[1]).toMatchObject({
    resolver: "Google",
    unavailable: false,
    records: [{ normalized: "/ipns/example.com" }],
  })
})

it("distinguishes a missing record from resolver errors", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ Status: 3, TC: false }))
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce(Response.json({ Status: 2, TC: false }))
    .mockResolvedValueOnce(Response.json({ Status: 0, TC: true }))
  vi.stubGlobal("fetch", fetchMock)
  const signal = new AbortController().signal
  const results = await checkDnslink("_dnslink.example.com", signal)
  expect(results).toEqual([
    { resolver: "Cloudflare", records: [], unavailable: false },
    { resolver: "Google", records: [], unavailable: true },
  ])
  await expect(checkDnslink("_dnslink.example.com", signal)).resolves.toEqual([
    { resolver: "Cloudflare", records: [], unavailable: true },
    { resolver: "Google", records: [], unavailable: true },
  ])
})
