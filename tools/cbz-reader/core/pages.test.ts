import { expect, test } from "vitest"
import { failureCode, imageMime, indexPages } from "@workspace/cbz/pages"
import { navigationPage } from "./pages"

test("sorts complete paths naturally with stable case, padding and duplicate ties", () => {
  const entries = [
    "chapter10/page1.png",
    "chapter2/page10.png",
    "chapter2/page2.png",
    "chapter2/Page2.png",
    "chapter2/page02.png",
    "chapter2/page2.png",
  ].map((filename) => ({ filename }))
  const result = indexPages(entries)
  expect(result.map(({ page }) => page.name)).toEqual([
    "chapter2/Page2.png",
    "chapter2/page02.png",
    "chapter2/page2.png",
    "chapter2/page2.png",
    "chapter2/page10.png",
    "chapter10/page1.png",
  ])
  expect(
    result
      .filter(({ page }) => page.name === "chapter2/page2.png")
      .map(({ position }) => position)
  ).toEqual([2, 5])
})

test("ignores directories, hidden files and metadata while retaining unsupported and encrypted page slots", () => {
  const entries = [
    { filename: "dir.png", directory: true },
    { filename: "__MACOSX/page.png" },
    { filename: ".hidden/page.png" },
    { filename: "chapter/.page.png" },
    { filename: "ComicInfo.xml" },
    { filename: "README" },
    { filename: "png" },
    { filename: "part\\page2.JPG" },
    { filename: "part/page3.tiff" },
    { filename: "part/page4.png", encrypted: true },
    { filename: "part/page5.svg" },
  ]
  expect(indexPages(entries).map(({ page }) => page)).toEqual([
    { name: "part/page2.JPG", status: "unchecked" },
    { name: "part/page3.tiff", status: "unsupportedPage" },
    { name: "part/page4.png", status: "encryptedPage" },
    { name: "part/page5.svg", status: "unsupportedPage" },
  ])
})

test.each([
  ["\xff\xd8\xff", "image/jpeg"],
  ["\x89PNG\r\n\x1a\n", "image/png"],
  ["GIF87a", "image/gif"],
  ["GIF89a", "image/gif"],
  ["RIFF0000WEBP", "image/webp"],
  ["BM", "image/bmp"],
  ["0000ftypavif", "image/avif"],
  ["0000ftypavis", "image/avif"],
  ["<svg xmlns='http://www.w3.org/2000/svg'/>", null],
  ["RIFF0000WAVE", null],
  ["0000ftypheic", null],
  ["", null],
  ["\xff", null],
  ["\xff\xd8", null],
])("checks raster signatures: %s", (bytes, expected) => {
  expect(
    imageMime(Uint8Array.from(bytes, (character) => character.charCodeAt(0)))
  ).toBe(expected)
})

test.each([
  [new RangeError("Invalid array length"), "resourceLimit"],
  [new Error("Out of memory"), "resourceLimit"],
  [new Error("Allocating buffer failed"), "resourceLimit"],
  [new Error("Insufficient available memory"), "resourceLimit"],
  [new Error("Password required"), "encrypted"],
  [new Error("Encrypted directory"), "encrypted"],
  [new Error("CRC mismatch"), "damaged"],
  [null, "damaged"],
  ["unknown", "damaged"],
])("classifies actionable failures", (reason, expected) =>
  expect(failureCode(reason)).toBe(expected)
)

test("classifies long decoder messages without a backtracking expression", () => {
  const repeated = "allocat insufficient ".repeat(100000)
  expect(failureCode(new Error(repeated))).toBe("damaged")
  expect(failureCode(new Error(repeated + "memory"))).toBe("resourceLimit")
})

test("maps canvas keys predictably independent of site direction", () => {
  for (const rtl of [false, true]) {
    expect(navigationPage("Home", 5, 20, rtl)).toBe(0)
    expect(navigationPage("End", 5, 20, rtl)).toBe(19)
    expect(navigationPage("PageDown", 5, 20, rtl)).toBe(6)
    expect(navigationPage("PageUp", 5, 20, rtl)).toBe(4)
    expect(navigationPage("ArrowRight", 5, 20, rtl)).toBe(rtl ? 4 : 6)
    expect(navigationPage("ArrowLeft", 5, 20, rtl)).toBe(rtl ? 6 : 4)
    expect(navigationPage("PageUp", 0, 20, rtl)).toBe(0)
    expect(navigationPage("PageDown", 19, 20, rtl)).toBe(19)
    expect(navigationPage("ArrowDown", 5, 20, rtl)).toBeNull()
  }
})

test("accepts AVIF compatible brands and ignores the minor version", () => {
  const bytes = (text: string) =>
    Uint8Array.from(text, (char) => char.charCodeAt(0))
  expect(imageMime(bytes("0000ftypmif1xxxxmif1avif"))).toBe("image/avif")
  expect(imageMime(bytes("0000ftypmif1avifmif1"))).toBeNull()
})
