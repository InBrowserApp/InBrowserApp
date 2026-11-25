// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { openChm } from "@workspace/chm"
import { prepareDocument } from "./prepare-document"

vi.mock("@workspace/chm", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@workspace/chm")>()),
  openChm: vi.fn(),
}))

const file = new File([], "manual.chm")
const topic = (path: string) => ({
  title: path,
  destination: { path },
  children: [],
})

afterEach(() => vi.resetAllMocks())

test("includes topics once in contents order and restores only local images", async () => {
  const entries = new Map([
    [
      "/start.htm",
      '<h1>Start</h1><img src="fig.png"><img src="fig.png"><img src="https://example.test/pixel.gif" alt="Unavailable"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><script>alert(1)</script><video src="data:video/mp4;base64,AAAA"></video>',
    ],
    ["/another.htm", "<h1>Another topic</h1>"],
    ["/fig.png", "image bytes"],
  ])
  const close = vi.fn()
  const read = vi.fn(async (path: string) =>
    new TextEncoder().encode(entries.get(path))
  )
  vi.mocked(openChm).mockResolvedValue({
    encoding: "utf-8",
    topics: [topic("/another.htm"), topic("/start.htm")],
    contents: [topic("/start.htm"), topic("/start.htm")],
    home: { path: "/start.htm" },
    lookup: (path) => (entries.has(path) ? path : undefined),
    lookupTopic: (path) => path,
    read,
    close,
  })
  const html = await prepareDocument(file, new AbortController().signal)
  const doc = new DOMParser().parseFromString(html, "text/html")
  expect(
    [...doc.querySelectorAll("h1")].map((node) => node.textContent)
  ).toEqual(["Start", "Another topic"])
  expect([...doc.images].map((image) => image.src)).toEqual([
    "data:image/png;base64,aW1hZ2UgYnl0ZXM=",
    "data:image/png;base64,aW1hZ2UgYnl0ZXM=",
    expect.stringMatching(/^data:image\/gif;base64,/),
  ])
  expect(doc.title).toBe("manual")
  expect(
    doc
      .querySelector('meta[http-equiv="Content-Security-Policy"]')
      ?.getAttribute("content")
  ).toContain("img-src data:")
  expect(doc.querySelector("style")?.textContent).toContain("@page { size: A4")
  expect(doc.body.textContent).toContain("Unavailable")
  expect(doc.querySelector("script, video")).toBeNull()
  expect(read.mock.calls.map(([path]) => path)).toEqual([
    "/start.htm",
    "/fig.png",
    "/another.htm",
  ])
  expect(close).toHaveBeenCalledOnce()
})

test("closes the worker if a topic cannot be read", async () => {
  const close = vi.fn()
  vi.mocked(openChm).mockResolvedValue({
    encoding: "utf-8",
    topics: [topic("/start.htm")],
    contents: [],
    home: { path: "/start.htm" },
    lookup: () => undefined,
    lookupTopic: () => undefined,
    read: vi.fn().mockRejectedValue(new Error("Unreadable topic")),
    close,
  })
  await expect(
    prepareDocument(file, new AbortController().signal)
  ).rejects.toThrow("Unreadable topic")
  expect(close).toHaveBeenCalledOnce()
})

test("rejects archives without any topics", async () => {
  vi.mocked(openChm).mockResolvedValue(null)
  await expect(
    prepareDocument(file, new AbortController().signal)
  ).rejects.toThrow("No CHM topics")
})

test("rejects a CHM with only blank or unsupported content", async () => {
  const close = vi.fn()
  vi.mocked(openChm).mockResolvedValue({
    encoding: "utf-8",
    topics: [topic("/start.htm")],
    contents: [],
    home: { path: "/start.htm" },
    lookup: () => undefined,
    lookupTopic: () => undefined,
    read: vi
      .fn()
      .mockResolvedValue(new TextEncoder().encode("<script>alert(1)</script>")),
    close,
  })
  await expect(
    prepareDocument(file, new AbortController().signal)
  ).rejects.toThrow("No readable CHM topics")
  expect(close).toHaveBeenCalledOnce()
})
