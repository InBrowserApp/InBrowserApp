import { expect, test } from "vitest"
import type { PageViewport } from "pdfjs-dist"
import {
  joinWrappedText,
  reflowPdfText,
  reflowRecognizedText,
} from "./text-layout"

const viewport = {
  convertToViewportPoint: (x: number, y: number) => [x, y],
} as PageViewport

const item = (str: string, y: number, height = 12, hasEOL = true, x = 50) => ({
  str,
  dir: "ltr",
  width: (str.length * height) / 2,
  height,
  transform: [height, 0, 0, height, x, y],
  fontName: "roman",
  hasEOL,
})

test("reconstructs a heading and spaced paragraphs in top-to-bottom order", () => {
  const items = [
    item("Third paragraph", 170),
    item("Lantern Notes", 46, 22),
    item("Walk down the", 80),
    item("lantern trail.", 94),
    item("中文花园。", 132),
    item("沿着小路。", 146),
  ]
  expect(reflowPdfText({ items, styles: {}, lang: null }, viewport)).toEqual([
    { kind: "heading", text: "Lantern Notes" },
    { kind: "paragraph", text: "Walk down the lantern trail." },
    { kind: "paragraph", text: "中文花园。沿着小路。" },
    { kind: "paragraph", text: "Third paragraph" },
  ])
})

test("preserves adjacent span text and explicit spaces", () => {
  const items = [
    item("«Night", 40, 12, false),
    item(" ", 40, 0, false),
    item("garden»", 40),
  ]
  expect(reflowPdfText({ items, styles: {}, lang: "en" }, viewport)).toEqual([
    { kind: "paragraph", text: "«Night garden»" },
  ])
})

test("keeps a raised inline glyph in the surrounding sentence", () => {
  const items = [
    item("The crossing was safe", 30, 12, false),
    item("1", 23, 7, false, 169),
    item(" ", 23, 0, false, 173),
    item("after dusk.", 30, 12, true, 176),
  ]
  expect(reflowPdfText({ items, styles: {}, lang: "en" }, viewport)).toEqual([
    { kind: "paragraph", text: "The crossing was safe1 after dusk." },
  ])
})

test("restores RTL glyph runs and keeps mathematical symbols distinct", () => {
  const rtl = (text: string, x: number) => ({
    ...item(text, 50, 12, false, x),
    dir: "rtl",
  })
  const items = [
    item("The sample says «", 50, 12, false),
    rtl("ب", 130),
    rtl("ﺎ", 140),
    rtl("ﺑ", 145),
    item("» and ²/½.", 50, 12, true, 151),
    item("中⽂花园", 80),
    { ...rtl("ب.", 50), transform: [12, 0, 0, 12, 50, 110] },
    { ...rtl("ﺎ", 60), transform: [12, 0, 0, 12, 60, 110] },
    { ...rtl("ﺑ", 70), transform: [12, 0, 0, 12, 70, 110], hasEOL: true },
  ]
  expect(
    reflowPdfText({ items, styles: {}, lang: null }, viewport).map(
      ({ text }) => text
    )
  ).toEqual(["The sample says «باب» and ²/½.", "中文花园", "باب."])
})

test("joins recognized text lines into reflowable paragraphs", () => {
  expect(
    reflowRecognizedText("A quiet\nriver at dusk.\n\nMoonflowers.\n")
  ).toEqual([
    { kind: "paragraph", text: "A quiet river at dusk." },
    { kind: "paragraph", text: "Moonflowers." },
  ])
  expect(reflowRecognizedText(" \n\n")).toEqual([])
  expect(joinWrappedText("soft\u00ad", "wrap")).toBe("softwrap")
  expect(joinWrappedText("well-", "known")).toBe("well-known")
})
