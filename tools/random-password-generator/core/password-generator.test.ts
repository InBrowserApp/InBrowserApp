import { describe, expect, test, vi } from "vitest"

import {
  MAX_HISTORY_ITEMS,
  addHistoryEntry,
  buildCharsetPool,
  generatePasswordByMode,
  generatePinPassword,
  generateRandomPassword,
  generateSeparatorPassword,
  generateWordPassword,
} from "./password-generator"

describe("buildCharsetPool", () => {
  test("builds a combined pool and removes similar characters when requested", () => {
    expect(buildCharsetPool(["upper", "digits"], true)).toBe(
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    )
  })

  test("falls back to the default character sets when none are selected", () => {
    expect(buildCharsetPool([], false)).toBe(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    )
  })
})

describe("generateRandomPassword", () => {
  test("generates a password from the requested pool", () => {
    const password = generateRandomPassword(
      {
        length: 4,
        charsets: ["lower", "digits"],
        excludeSimilar: false,
      },
      (() => {
        const sequence = [0, 1, 2, 3]
        let index = 0

        return (max: number) => sequence[index++]! % max
      })()
    )

    expect(password).toBe("abcd")
  })
})

describe("generateWordPassword", () => {
  test("creates a passphrase with capitalization and a trailing number", () => {
    const password = generateWordPassword(
      {
        wordCount: 2,
        separator: ".",
        capitalize: true,
        includeNumber: true,
      },
      (() => {
        const sequence = [0, 1, 42]
        let index = 0

        return (max: number) => sequence[index++]! % max
      })()
    )

    expect(password).toBe("Abandon.Ability.42")
  })
})

describe("generateSeparatorPassword", () => {
  test("creates grouped blocks with the requested separator", () => {
    const password = generateSeparatorPassword(
      {
        charsets: ["digits"],
        excludeSimilar: false,
        blockLength: 2,
        blockCount: 3,
        blockSeparator: ":",
      },
      (() => {
        const sequence = [0, 1, 2, 3, 4, 5]
        let index = 0

        return (max: number) => sequence[index++]! % max
      })()
    )

    expect(password).toBe("01:23:45")
  })
})

describe("generatePinPassword", () => {
  test("avoids a leading zero when the option is disabled", () => {
    const password = generatePinPassword(
      {
        length: 4,
        allowLeadingZero: false,
      },
      (() => {
        const sequence = [0, 8, 4, 5, 6]
        let index = 0

        return (max: number) => sequence[index++]! % max
      })()
    )

    expect(password).toBe("9456")
  })
})

describe("generatePasswordByMode", () => {
  test("delegates to the selected mode", () => {
    const randomIndex = vi
      .fn<(max: number) => number>()
      .mockImplementation((max: number) => 0 % max)

    expect(
      generatePasswordByMode(
        "pin",
        {
          random: {
            length: 12,
            charsets: ["upper", "lower", "digits"],
            excludeSimilar: true,
          },
          words: {
            wordCount: 4,
            separator: "-",
            capitalize: false,
            includeNumber: false,
          },
          separator: {
            charsets: ["upper", "lower", "digits"],
            excludeSimilar: true,
            blockLength: 3,
            blockCount: 3,
            blockSeparator: "-",
          },
          pin: {
            length: 3,
            allowLeadingZero: true,
          },
        },
        randomIndex
      )
    ).toBe("000")
  })
})

describe("addHistoryEntry", () => {
  test("deduplicates adjacent entries and caps the history length", () => {
    const createId = (() => {
      let index = 0

      return () => `history-${index++}`
    })()

    const once = addHistoryEntry([], "random", "abcd", { createId })
    expect(once).toEqual([
      {
        id: "history-0",
        mode: "random",
        value: "abcd",
      },
    ])

    expect(addHistoryEntry(once, "random", "abcd", { createId })).toEqual(once)

    const many = Array.from({ length: MAX_HISTORY_ITEMS + 3 }).reduce<
      ReturnType<typeof addHistoryEntry>
    >(
      (historyEntries, _, index) =>
        addHistoryEntry(historyEntries, "pin", `${index}`, { createId }),
      once
    )

    expect(many).toHaveLength(MAX_HISTORY_ITEMS)
    expect(many[0]?.value).toBe("22")
  })

  test("uses the built-in id generator when one is not provided", () => {
    vi.spyOn(Date, "now").mockReturnValue(1700000000000)
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    expect(addHistoryEntry([], "words", "alpha-beta")).toEqual([
      {
        id: "1700000000000-8",
        mode: "words",
        value: "alpha-beta",
      },
    ])
  })
})
