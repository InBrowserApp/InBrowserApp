export function exampleHar() {
  const rows = [
    ["GET", "https://example.com/", 200, "text/html", 0, 230, 8500],
    [
      "GET",
      "https://example.com/assets/app.css",
      200,
      "text/css",
      80,
      110,
      4200,
    ],
    [
      "GET",
      "https://example.com/assets/app.js",
      200,
      "application/javascript",
      85,
      340,
      62000,
    ],
    [
      "GET",
      "https://example.com/api/projects?page=1",
      200,
      "application/json",
      240,
      820,
      1850,
    ],
    [
      "GET",
      "https://example.com/assets/logo.svg",
      304,
      "image/svg+xml",
      270,
      75,
      240,
    ],
    [
      "POST",
      "https://example.com/api/search",
      200,
      "application/json",
      500,
      190,
      920,
    ],
    [
      "GET",
      "https://example.com/api/activity",
      503,
      "application/json",
      620,
      1250,
      380,
    ],
    [
      "GET",
      "https://example.com/assets/missing.png",
      404,
      "text/html",
      700,
      95,
      260,
    ],
    ["GET", "https://example.com/api/stream", 0, "", 800, 460, 0],
  ] as const
  return JSON.stringify({
    log: {
      version: "1.2",
      creator: { name: "InBrowser.App example", version: "1" },
      entries: rows.map(
        ([method, url, status, mimeType, offset, time, size], id) => ({
          startedDateTime: new Date(
            Date.UTC(2026, 0, 1) + offset
          ).toISOString(),
          time,
          request: {
            method,
            url,
            httpVersion: "HTTP/2",
            headers: [{ name: "Accept", value: "*/*" }],
            cookies: [],
            ...(method === "POST"
              ? {
                  postData: {
                    mimeType: "application/json",
                    text: '{"query":"network"}',
                  },
                }
              : {}),
          },
          response: {
            status,
            statusText: status === 503 ? "Service Unavailable" : "",
            httpVersion: "HTTP/2",
            headersSize: 120,
            bodySize: size,
            headers: [{ name: "Content-Type", value: mimeType }],
            cookies: [],
            content: {
              mimeType,
              size,
              ...(mimeType === "application/json"
                ? {
                    text: JSON.stringify(
                      status === 503
                        ? { error: "Please try again later" }
                        : { ok: true, items: ["Alpha", "Beta"] }
                    ),
                  }
                : {}),
            },
          },
          timings: {
            blocked: 5,
            dns: id === 0 ? 15 : -1,
            connect: id === 0 ? 40 : -1,
            ssl: id === 0 ? 25 : -1,
            send: 2,
            wait: time - (id === 0 ? 82 : 27),
            receive: 20,
          },
        })
      ),
    },
  })
}
