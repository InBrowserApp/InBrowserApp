const json = "application/json"
const text = '{"name":"Example workspace"}'

export function makeExample() {
  const entries = [
    {
      startedDateTime: "2026-01-01T12:00:00.000Z",
      time: 140,
      request: {
        method: "GET",
        url: "https://example.com/api/workspaces?invite=demo-token&page=2",
        httpVersion: "HTTP/2.0",
        cookies: [{ name: "session", value: "demo-session" }],
        headers: [{ name: "Authorization", value: "Bearer demo" }],
        queryString: [
          { name: "invite", value: "demo-token" },
          { name: "page", value: "2" },
        ],
        headersSize: -1,
        bodySize: 0,
      },
      response: {
        status: 200,
        statusText: "OK",
        httpVersion: "HTTP/2.0",
        cookies: [],
        headers: [{ name: "Content-Type", value: json }],
        content: { size: text.length, mimeType: json, text },
        redirectURL: "",
        headersSize: -1,
        bodySize: text.length,
      },
      cache: {},
      timings: { send: 2, wait: 118, receive: 20 },
    },
  ]

  const log = {
    version: "1.2",
    creator: { name: "InBrowser.App", version: "1" },
    entries,
  }

  return new File([JSON.stringify({ log })], "example.har", { type: json })
}
