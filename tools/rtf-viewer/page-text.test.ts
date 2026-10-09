import { describe, expect, it, vi } from "vitest"
import type { PageLayout, RtfDocument } from "rtf-viewer"
import { findMatches, pageText } from "./page-text"
const page = (lines: string[][]) =>
  ({
    lines: lines.map((fragments) => ({
      fragments: fragments.map((text) => ({ kind: "text", text })),
    })),
  }) as unknown as PageLayout
const doc = (...pages: PageLayout[]) =>
  ({
    pageCount: pages.length,
    getPageLayout: (index: number) => pages[index],
  }) as RtfDocument

describe("RTF preview text", () => {
  it("preserves reading order, line breaks and image-only lines", () => {
    const layout = page([["one", " two"], ["three"]])
    expect(pageText(layout)).toBe("one two\nthree")
    expect(
      pageText({
        lines: [{ fragments: [{ kind: "image" }] }],
      } as unknown as PageLayout)
    ).toBe("")
  })
  it("finds literal punctuation and matches across formatting boundaries", async () => {
    const result = await findMatches(
      doc(page([["[a", "+b] [A+B]"]])),
      "[a+b]",
      new AbortController().signal
    )
    expect(result).toEqual([
      { page: 1, start: 0, end: 5 },
      { page: 1, start: 6, end: 11 },
    ])
  })
  it("finds phrases across visual line breaks", async () => {
    expect(
      await findMatches(
        doc(page([["long"], ["report"]])),
        "long report",
        new AbortController().signal
      )
    ).toEqual([{ page: 1, start: 0, end: 11 }])
  })
  it("preserves offsets when preceding Unicode lowercase expands", async () => {
    expect(
      await findMatches(
        doc(page([["İ final"]])),
        "final",
        new AbortController().signal
      )
    ).toEqual([{ page: 1, start: 2, end: 7 }])
  })
  it("returns no matches for empty query and supports cancellation between pages", async () => {
    expect(await findMatches(doc(), "", new AbortController().signal)).toEqual(
      []
    )
    const controller = new AbortController()
    controller.abort()
    await expect(
      findMatches(doc(page([["text"]])), "text", controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
    const next = new AbortController()
    const pending = findMatches(doc(page([["text"]])), "text", next.signal)
    next.abort()
    await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  })
  it("searches beyond 2,000 pages", async () => {
    const getPageLayout = vi.fn((index: number) =>
      page([[index === 2000 ? "last" : "first"]])
    )
    expect(
      await findMatches(
        { pageCount: 2001, getPageLayout } as unknown as RtfDocument,
        "last",
        new AbortController().signal
      )
    ).toEqual([{ page: 2001, start: 0, end: 4 }])
  })
})
