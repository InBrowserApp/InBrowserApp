import { expect, test } from "vitest"
import { textDirection } from "./text-direction"

test.each([
  ["© Your name", "ltr"],
  ["© 你的名字", "ltr"],
  ["© 2026 اسمك", "rtl"],
  ["© השם שלך", "rtl"],
  ["", "ltr"],
  ["123 ©", "ltr"],
  ["Studio اسمك", "ltr"],
  ["اسمك Studio", "rtl"],
] as const)(
  "chooses a stable canvas base direction for %s",
  (text, direction) => {
    expect(textDirection(text)).toBe(direction)
  }
)
