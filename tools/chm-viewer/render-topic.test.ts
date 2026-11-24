// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { renderTopic } from "./render-topic"

test("preserves local links, styles and images in a script-free reading document", async () => {
  const files = new Map([
    [
      "/chapters/start.htm",
      String.raw`<!doctype html><title>Overview</title>
        <link rel="stylesheet" href="..\styles\topic.css">
        <style>p::after { content: "\3c /style"; }</style>
        <h1>Overview</h1>
        <a href="nested\next.htm#details" target="_blank">Details</a>
        <a href="\home.htm">Home</a>
        <a href="https://example.org/manual">External manual</a>
        <img src="..\assets\logo.png" alt="Logo">
        <img src="https://example.org/logo.png" alt="Remote">
        <script>document.title = "Discarded"</script>`,
    ],
    ["/styles/topic.css", 'h1 { background-image: url("../assets/logo.png") }'],
    ["/assets/logo.png", "image data"],
  ])
  const read = vi.fn(async (path: string) =>
    new TextEncoder().encode(files.get(path))
  )
  const createUrl = vi.fn((blob: Blob) =>
    blob.type.startsWith("text/css") ? "blob:stylesheet" : "blob:logo"
  )
  const revokeUrl = vi.fn()
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = createUrl
      static revokeObjectURL = revokeUrl
    }
  )
  try {
    const page = await renderTopic({
      path: "/chapters/start.htm",
      encoding: "utf-8",
      lookup: (path) => (files.has(path) ? path : undefined),
      read,
      signal: new AbortController().signal,
    })
    const result = new DOMParser().parseFromString(page.html, "text/html")
    expect(page.title).toBe("Overview")
    expect(result.head.firstElementChild?.getAttribute("content")).toContain(
      "script-src 'none'"
    )
    expect(result.querySelector("script")).toBeNull()
    expect(
      result
        .querySelector('a[data-chm-fragment="details"]')
        ?.getAttribute("data-chm-path")
    ).toBe("/chapters/nested/next.htm")
    expect(result.querySelector('a[data-chm-path="/home.htm"]')).toBeTruthy()
    expect(result.querySelector("a[target], a[href]")).toBeNull()
    expect(result.querySelector("a[role=link]")?.getAttribute("tabindex")).toBe(
      "0"
    )
    expect(result.querySelector("style")?.textContent).toContain(
      String.raw`\3c /style`
    )
    expect(
      result.querySelector('a[aria-disabled="true"]')?.hasAttribute("href")
    ).toBe(false)
    expect(
      result.querySelector('link[rel="stylesheet"]')?.getAttribute("href")
    ).toBe("blob:stylesheet")
    expect(result.querySelector('img[alt="Logo"]')?.getAttribute("src")).toBe(
      "blob:logo"
    )
    expect(result.querySelector('img[alt="Remote"]')?.hasAttribute("src")).toBe(
      false
    )
    expect(read.mock.calls).toEqual([
      ["/chapters/start.htm"],
      ["/assets/logo.png"],
      ["/styles/topic.css"],
    ])
    const style = createUrl.mock.calls
      .map(([blob]) => blob)
      .find((blob) => blob.type.startsWith("text/css"))
    expect(style).toBeTruthy()
    page.dispose()
    await Promise.resolve()
    expect(revokeUrl.mock.calls.flat().sort()).toEqual([
      "blob:logo",
      "blob:stylesheet",
    ])
  } finally {
    vi.unstubAllGlobals()
  }
})
