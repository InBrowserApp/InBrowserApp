import { describe, expect, it } from "vitest"
import { MAX_ENTRIES, parseHar } from "./parse"

export const rawEntry = (overrides: Record<string, unknown> = {}) => ({
  startedDateTime: "2026-01-01T00:00:00.000Z",
  time: 100,
  request: {
    url: "https://example.com/a?x=1&x=2",
    method: "GET",
    headers: [{ name: "A", value: "B" }],
    cookies: [],
  },
  response: {
    status: 200,
    statusText: "OK",
    httpVersion: "HTTP/2",
    headersSize: 20,
    bodySize: 80,
    content: { size: 140, mimeType: "application/json", text: "{}" },
  },
  timings: {
    blocked: 0,
    dns: 5,
    connect: 20,
    ssl: 15,
    send: 1,
    wait: 64,
    receive: 10,
  },
  ...overrides,
})
export const har = (entries: unknown[]) => JSON.stringify({ log: { entries } })

describe("HAR parsing", () => {
  it("keeps TLS inside connection time, duplicate queries, and known transfer sizes", () => {
    const capture = parseHar(`\uFEFF${har([rawEntry()])}`)
    expect(capture).toMatchObject({
      skipped: 0,
      span: 100,
      started: Date.UTC(2026, 0, 1),
    })
    expect(capture.entries[0]).toMatchObject({
      duration: 100,
      transferSize: 100,
      contentSize: 140,
      timings: { connect: 20, ssl: 15 },
      request: {
        query: [
          { name: "x", value: "1" },
          { name: "x", value: "2" },
        ],
      },
    })
  })
  it("computes capture span across unsorted overlapping requests", () => {
    const result = parseHar(
      har([
        rawEntry({ startedDateTime: "2026-01-01T00:00:01.000Z", time: 500 }),
        rawEntry({ time: 2000 }),
        rawEntry({ startedDateTime: "2026-01-01T00:00:00+01:00", time: 0 }),
      ])
    )
    expect(result.span).toBe(3_602_000)
    expect(result.entries.map((item) => item.id)).toEqual([0, 1, 2])
  })
  it("distinguishes unknown timings, sizes, and missing bodies from recorded zero and empty", () => {
    const result = parseHar(
      har([
        rawEntry({
          time: -1,
          timings: { dns: -1, wait: 0 },
          request: { method: "GET", url: "relative" },
          response: {
            status: 0,
            headersSize: -1,
            bodySize: 0,
            content: { size: -1, text: "", encoding: "base64" },
          },
        }),
      ])
    ).entries[0]!
    expect(result).toMatchObject({
      duration: null,
      transferSize: null,
      contentSize: null,
      statusText: "",
      protocol: "",
      mimeType: "",
      timings: { dns: null, blocked: null, wait: 0 },
      request: { body: { text: null }, query: [] },
      response: { body: { text: "", encoding: "base64" } },
    })
  })
  it("honors explicit query arrays, browser transfer sizes, forms, cookies, and duplicate headers", () => {
    const headers = [
      { name: "Set-Cookie", value: "a=1" },
      { name: "Set-Cookie", value: "b=2" },
      null,
      { name: "bad", value: 4 },
    ]
    const result = parseHar(
      har([
        rawEntry({
          request: {
            method: "POST",
            url: "https://example.com/?ignored=1",
            queryString: [],
            headers,
            cookies: [{ name: "a", value: "1" }],
            postData: {
              mimeType: "application/x-www-form-urlencoded",
              text: "a=1",
              params: [{ name: "a", value: "1" }],
            },
          },
          response: {
            status: 201,
            _transferSize: 0,
            headers,
            cookies: [{ name: "b", value: "2" }],
            content: null,
          },
        }),
      ])
    ).entries[0]!
    expect(result.transferSize).toBe(0)
    expect(result.request.query).toEqual([])
    expect(result.request.headers).toHaveLength(2)
    expect(result.response.headers).toHaveLength(2)
    expect(result.request.body.params).toEqual([{ name: "a", value: "1" }])
    expect(result.request.cookies).toEqual([{ name: "a", value: "1" }])
    expect(result.response.cookies).toEqual([{ name: "b", value: "2" }])
  })
  it("preserves multipart file parameters and their metadata without requiring values", () => {
    const result = parseHar(
      har([
        rawEntry({
          request: {
            method: "POST",
            url: "https://example.com/upload",
            postData: {
              mimeType: "multipart/form-data",
              params: [
                { name: "caption", value: "profile photo" },
                { name: "empty", value: "" },
                {
                  name: "upload",
                  fileName: "photo.jpg",
                  contentType: "image/jpeg",
                },
                {
                  name: "explicit",
                  value: "stored content",
                  fileName: "source.txt",
                  contentType: "text/plain",
                },
                { name: "empty-file", fileName: "" },
                {
                  name: "bad-metadata",
                  value: "retained",
                  fileName: 3,
                  contentType: 4,
                },
                null,
                { name: 4, value: "invalid" },
                { name: "missing" },
                { name: "bad-value", value: 4 },
              ],
            },
          },
        }),
      ])
    ).entries[0]!
    expect(result.request.body.params).toEqual([
      { name: "caption", value: "profile photo" },
      { name: "empty", value: "" },
      {
        name: "upload",
        value: "photo.jpg",
        fileName: "photo.jpg",
        contentType: "image/jpeg",
      },
      {
        name: "explicit",
        value: "stored content",
        fileName: "source.txt",
        contentType: "text/plain",
      },
      { name: "empty-file", value: "", fileName: "" },
      { name: "bad-metadata", value: "retained" },
    ])
  })
  it("skips invalid entries while preserving their original indices", () => {
    const invalid = [
      null,
      [],
      42,
      {},
      rawEntry({ startedDateTime: "bad" }),
      rawEntry({ request: {} }),
      rawEntry({ request: { url: "x" } }),
      rawEntry({ response: { status: -1 } }),
      rawEntry({ response: { status: 200.5 } }),
      rawEntry({ response: { status: 600 } }),
    ]
    const result = parseHar(
      har([
        ...invalid,
        rawEntry({ timings: null, response: { status: 200, headersSize: 20 } }),
      ])
    )
    expect(result.skipped).toBe(invalid.length)
    expect(result.entries[0]?.id).toBe(invalid.length)
    expect(result.entries[0]?.transferSize).toBeNull()
    expect(result.entries[0]?.response.body.text).toBeNull()
  })
  it("treats overflowing JSON numbers as unavailable", () => {
    const input = har([rawEntry()]).replace('"time":100', '"time":1e400')
    expect(parseHar(input).entries[0]?.duration).toBeNull()
  })
  it("accepts an empty capture", () => {
    expect(parseHar(har([]))).toEqual({
      entries: [],
      skipped: 0,
      started: 0,
      span: 0,
    })
  })
  it.each(["{", "", "undefined"])("rejects malformed JSON %s", (input) => {
    expect(() => parseHar(input)).toThrow("invalidJson")
  })
  it.each([null, [], {}, { log: null }, { log: { entries: {} } }])(
    "rejects non-HAR JSON %j",
    (input) => {
      expect(() => parseHar(JSON.stringify(input))).toThrow("invalidHar")
    }
  )
  it("rejects captures with no usable entries", () => {
    expect(() => parseHar(har([null]))).toThrow("noValid")
  })
  it("bounds the number of entries before processing them", () => {
    expect(() => parseHar(har(Array(MAX_ENTRIES + 1).fill(null)))).toThrow(
      "tooMany"
    )
  })
})
