import { describe, expect, test } from "vitest"
import { convertToPinyin } from "./convert-to-pinyin"

describe("convertToPinyin", () => {
  test.each(["重庆银行", "重慶銀行"])("uses phrase context in %s", (input) => {
    expect(convertToPinyin(input, "symbol")).toBe("chóng qìng yín háng")
    expect(convertToPinyin(`${input}，行走`, "symbol")).toBe(
      "chóng qìng yín háng，xíng zǒu"
    )
  })

  test("keeps contextual readings when a passage mixes Chinese, Latin text, and emoji", () => {
    expect(
      convertToPinyin("重慶銀行，欢迎你！\nHello, 世界！ 🎉 2026", "symbol")
    ).toBe("chóng qìng yín háng，huān yíng nǐ！\nHello, shì jiè！ 🎉 2026")
    expect(convertToPinyin("🎉銀行𠮷重慶", "symbol")).toBe(
      "🎉yín háng 𠮷 chóng qìng"
    )
  })

  test("keeps a phrase reading in a longer Chinese passage", () => {
    const suffix = "欢迎你".repeat(500)
    expect(convertToPinyin(`重庆银行${suffix}`, "symbol")).toBe(
      `chóng qìng yín háng${" huān yíng nǐ".repeat(500)}`
    )
  })

  test("formats tone marks, numbers including neutral zero, and unmarked syllables", () => {
    const input = "女儿和妈妈"
    expect(convertToPinyin(input, "symbol")).toBe("nǚ ér hé mā ma")
    expect(convertToPinyin(input, "num")).toBe("nü3 er2 he2 ma1 ma0")
    expect(convertToPinyin(input, "none")).toBe("nü er he ma ma")
  })

  test("retains whitespace, punctuation and non-Chinese text in mixed input", () => {
    expect(convertToPinyin("  A中国2026，\r\n世界！ Lisa\t🎉", "symbol")).toBe(
      "  A zhōng guó 2026，\r\nshì jiè！ Lisa\t🎉"
    )
    expect(convertToPinyin("Lisa✨𠮷\n", "symbol")).toBe("Lisa✨𠮷\n")
    expect(convertToPinyin("", "symbol")).toBe("")
  })

  test("keeps combining marks attached and drops selectors for converted ideographs", () => {
    expect(convertToPinyin("A\u0301口\uFE00型✈️𠮷\u{E0100}", "symbol")).toBe(
      "A\u0301 kǒu xíng✈️𠮷\u{E0100}"
    )
  })
})
