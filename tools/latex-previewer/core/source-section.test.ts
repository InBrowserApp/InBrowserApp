import { expect, test } from "vitest"
import { sourceSection } from "./source-section"

test("keeps every source character accessible without breaking Unicode pairs", () => {
  const source = "a".repeat(65_535) + "😀" + "b".repeat(65_536) + "final"
  const sections = [1, 2, 3].map((page) => sourceSection(source, page))
  expect(sections.map(({ text }) => text).join("")).toBe(source)
  expect(sections[0]!.text).toBe("a".repeat(65_535))
  expect(sections[1]!.text.startsWith("😀")).toBe(true)
  expect(sections[2]!.text.endsWith("final")).toBe(true)
  expect(sections[0]!.count).toBe(3)
  expect(sourceSection(source, Infinity).page).toBe(3)
  expect(sourceSection(source, -1).page).toBe(1)
  expect(sourceSection(source, NaN).page).toBe(1)
  expect(sourceSection("", 1)).toEqual({ page: 1, count: 1, text: "" })
})
