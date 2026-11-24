import { describe, expect, it } from "vitest"
import { sanitizeHar } from "./sanitize"

const defaults = { parameters: true, bodies: true }

function capture(entries: unknown[]) {
  return JSON.stringify({
    log: { version: "1.2", creator: { name: "Test" }, entries },
  })
}

describe("sanitizeHar", () => {
  it.each([
    "{",
    "null",
    "[]",
    "{}",
    '{"log":null}',
    '{"log":{"entries":{}}}',
    capture([null]),
    capture([{ response: {} }]),
    capture([{ request: {}, response: null }]),
  ])("rejects invalid archives: %s", (text) => {
    expect(sanitizeHar(text, defaults)).toBeNull()
  })

  it("accepts empty UTF-8 HAR captures", async () => {
    const text = capture([])
    const result = sanitizeHar("\uFEFF" + text, defaults)!
    expect(result.summary).toEqual({
      requests: 0,
      removedCredentials: 0,
      maskedParameters: 0,
      removedBodies: 0,
    })
    expect(JSON.parse(await result.output.text())).toEqual(JSON.parse(text))
  })

  it("removes credential fields, masks URL duplicates, strips bodies, and keeps timing and response metadata", async () => {
    const content = {
      text: "ZGVtbyBzZWNyZXQ=",
      encoding: "base64",
      mimeType: "application/json",
      size: 11,
    }
    const url =
      "https://user:password@example.com/A%2fb?ticket=one&ticket=two&empty=&flag&done=REDACTED#access_token=three"
    const source = [
      {
        request: {
          method: "POST",
          url,
          headers: [
            { name: "aUtHoRiZaTiOn", value: "Bearer demo" },
            { name: "X-API-Key", value: "demo key" },
            { name: "Cookie", value: "session=demo" },
            { name: "Referer", value: "https://example.com/#/route?code=four" },
            { name: "Accept", value: "application/json" },
          ],
          cookies: [{ name: "session", value: "demo" }],
          queryString: [
            { name: "ticket", value: "one" },
            { name: "ticket", value: "two" },
            { name: "empty", value: "" },
            { name: "done", value: "REDACTED" },
          ],
          postData: { mimeType: "application/json", text: "demo secret" },
        },
        response: {
          status: 302,
          headers: [
            { name: "Set-Cookie", value: "session=demo" },
            { name: " Location ", value: "/login?next=five" },
          ],
          cookies: [{ name: "session", value: "demo" }],
          redirectURL: "/login?next=five",
          content,
        },
        startedDateTime: "2026-01-01T12:00:00Z",
        time: 12,
        timings: { send: 1, wait: 10, receive: 1 },
        _webSocketMessages: [
          { type: "receive", time: 0, data: "demo secret" },
          { type: "close" },
        ],
      },
    ]
    const result = sanitizeHar(capture(source), defaults)!
    const { log } = JSON.parse(await result.output.text())
    expect(log.creator.name).toBe("Test")
    expect(log.entries).toEqual([
      {
        ...source[0],
        _webSocketMessages: [{ type: "receive", time: 0 }, { type: "close" }],
        request: {
          method: "POST",
          url: "https://example.com/A%2fb?ticket=REDACTED&ticket=REDACTED&empty=&flag&done=REDACTED#access_token=REDACTED",
          headers: [
            {
              name: "Referer",
              value: "https://example.com/#/route?code=REDACTED",
            },
            { name: "Accept", value: "application/json" },
          ],
          cookies: [],
          queryString: [
            { name: "ticket", value: "REDACTED" },
            { name: "ticket", value: "REDACTED" },
            { name: "empty", value: "" },
            { name: "done", value: "REDACTED" },
          ],
        },
        response: {
          status: 302,
          headers: [{ name: " Location ", value: "/login?next=REDACTED" }],
          cookies: [],
          redirectURL: "/login?next=REDACTED",
          content: { size: 11, mimeType: "application/json" },
        },
      },
    ])
    expect(result.summary).toEqual({
      requests: 1,
      removedCredentials: 7,
      maskedParameters: 8,
      removedBodies: 3,
    })
  })

  it("cleans duplicated Chromium and Firefox navigation URLs and Chrome extension data", async () => {
    const pageUrl =
      "https://example.com/callback?code=secret#state=state?secret"
    const source = {
      log: {
        pages: [{ title: pageUrl }, { title: "Dashboard" }, {}],
        entries: [
          {
            request: {
              url: pageUrl,
              headers: [{ name: "Ocp-Apim-Subscription-Key", value: "secret" }],
            },
            response: {},
            _initiator: {
              url: pageUrl,
              stack: {
                callFrames: [{ url: pageUrl }],
                parent: { callFrames: [{ url: pageUrl }] },
              },
            },
            _eventSourceMessages: [
              { time: 12, eventName: "update", data: "secret" },
            ],
          },
        ],
      },
    }
    const result = sanitizeHar(JSON.stringify(source), defaults)!
    const output = await result.output.text()
    expect(output).not.toContain("secret")
    expect(JSON.parse(output).log.pages).toEqual([
      { title: "https://example.com/callback?code=REDACTED#state=REDACTED" },
      { title: "Dashboard" },
      {},
    ])
    expect(JSON.parse(output).log.entries[0]._eventSourceMessages).toEqual([
      { time: 12, eventName: "update" },
    ])
    expect(result.summary).toEqual({
      requests: 1,
      removedCredentials: 1,
      maskedParameters: 10,
      removedBodies: 1,
    })
  })

  it("keeps optional fields when disabled while still removing credentials", async () => {
    const source = {
      request: {
        url: "//user@example.com/?ticket=secret",
        queryString: [{ name: "ticket", value: "secret" }],
        postData: { text: "keep" },
      },
      response: {
        headers: [{ name: "Proxy-Authorization", value: "remove" }],
        content: { text: "keep" },
      },
      _webSocketMessages: [{ data: "keep" }],
    }
    const result = sanitizeHar(capture([source]), {
      parameters: false,
      bodies: false,
    })!
    expect(JSON.parse(await result.output.text()).log.entries).toEqual([
      {
        ...source,
        request: { ...source.request, url: "//example.com/?ticket=secret" },
        response: { ...source.response, headers: [] },
      },
    ])
    expect(result.summary).toEqual({
      requests: 1,
      removedCredentials: 2,
      maskedParameters: 0,
      removedBodies: 0,
    })
  })

  it("handles optional fields in incomplete browser exports", async () => {
    const result = sanitizeHar(
      capture([
        {
          request: {
            url: "https://example.com/path#section",
            headers: [null, { value: "orphan" }, { name: "Referer" }],
            queryString: [{ name: "missing" }, null],
          },
          response: { content: { mimeType: "text/html" } },
        },
        { request: {}, response: {} },
      ]),
      defaults
    )!
    expect(
      JSON.parse(await result.output.text()).log.entries[0].request
    ).toEqual({
      url: "https://example.com/path#section",
      headers: [{ name: "Referer" }],
      queryString: [{ name: "missing" }, null],
    })
  })
})
