import { expect, it } from "vitest"
import { limitInBytes } from "./numeric-input"

it.each([
  ["zh-CN", "≤ 1,000 KB", 1_000_000],
  ["en", "2 MB", 2_000_000],
  ["en", "10,5 KB", 10_500],
  ["en", "0,001 MB", 1_000],
  ["de", "0.001 MB", 1_000],
  ["en", "00,001 KB", 1],
  ["en", "1,000.025 KB", 1_000_025],
  ["fr", "1 000,25 KB", 1_000_250],
  ["fr", "2,5 MB", 2_500_000],
  ["de", "1.000,125 KB", 1_000_125],
  ["ar", "١٬٠٠٠٫٢٥ KB", 1_000_250],
  ["hi", "12,34,567 KB", 1_234_567_000],
  ["ja", "１．５ ＭＢ", 1_500_000],
  ["en", "0.000001 MB", 1],
  ["en", "0.0000001 MB", 0],
  ["en", "200.0005 KB", 0],
  ["en", "12,34,56 KB", 0],
  ["en", "9007199254741 KB", 0],
])("parses %s input %s into an exact byte limit", (lang, input, bytes) => {
  expect(limitInBytes(input, lang)).toBe(bytes)
})
