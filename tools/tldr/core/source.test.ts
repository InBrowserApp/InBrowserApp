import { afterEach, expect, it, vi } from "vitest"
import { fetchCatalog, fetchPage, sourceLink } from "./source"

const variant = { q: "c++", os: "common", locale: "zh" }
const english = { ...variant, locale: "en" }
const signal = new AbortController().signal
const cdn =
  "https://cdn.jsdelivr.net/gh/tldr-pages/tldr@sha/pages.zh/common/c%2B%2B.md"
const raw =
  "https://raw.githubusercontent.com/tldr-pages/tldr/sha/pages.zh/common/c%2B%2B.md"
const markdown = "# c++\n"

afterEach(() => vi.unstubAllGlobals())

it("loads the correctly encoded version from jsDelivr", async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(markdown))
  vi.stubGlobal("fetch", fetch)
  expect(await fetchPage("sha", variant, signal)).toBe(markdown)
  expect(fetch).toHaveBeenCalledExactlyOnceWith(
    cdn,
    expect.objectContaining({
      credentials: "omit",
      referrerPolicy: "no-referrer",
    })
  )
  expect(sourceLink("sha", english)).toBe(
    "https://github.com/tldr-pages/tldr/blob/sha/pages/common/c%2B%2B.md"
  )
})

it.each([
  () => new Response(null, { status: 404 }),
  () => new Response("<html>Unavailable</html>"),
  () => {
    throw new TypeError("Network unavailable")
  },
])("tries GitHub Raw when jsDelivr cannot serve Markdown", async (failure) => {
  const fetch = vi
    .fn()
    .mockImplementationOnce(failure)
    .mockResolvedValueOnce(new Response(markdown))
  vi.stubGlobal("fetch", fetch)
  expect(await fetchPage("sha", variant, signal)).toBe(markdown)
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([cdn, raw])
})

it("distinguishes unavailable data and aborted navigation", async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 503 }))
  vi.stubGlobal("fetch", fetch)
  await expect(fetchPage("sha", english, signal)).rejects.toThrow("unavailable")

  const controller = new AbortController()
  fetch.mockImplementationOnce(() => {
    controller.abort()
    throw controller.signal.reason
  })
  await expect(
    fetchPage("sha", english, controller.signal)
  ).rejects.toMatchObject({ name: "AbortError" })
  await expect(
    fetchPage("sha", english, controller.signal)
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(fetch).toHaveBeenCalledTimes(3)
})

it("uses the bundled catalog and reports unavailable assets", async () => {
  const catalog = { revision: "sha", commands: [] }
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(Response.json(catalog))
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
  vi.stubGlobal("fetch", fetch)
  expect(await fetchCatalog(signal)).toEqual(catalog)
  expect(String(fetch.mock.calls[0]?.[0])).toMatch(/commands\.json$/)
  await expect(fetchCatalog(signal)).rejects.toThrow("catalog is unavailable")
})
