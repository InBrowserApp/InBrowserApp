import { describe, expect, it } from "vitest"

import { generateIsbns } from "./isbns"

describe("generateIsbns", () => {
  it.each([
    { variant: 10, separator: "-", pattern: /^(?:\d+-){3}[0-9X]$/ },
    { variant: 10, separator: "", pattern: /^\d{9}[0-9X]$/ },
    { variant: 13, separator: "-", pattern: /^978-(?:\d+-){3}\d$/ },
    { variant: 13, separator: "", pattern: /^978\d{10}$/ },
  ] as const)(
    "generates checksum-valid ISBN-$variant values using separator '$separator'",
    async ({ variant, separator, pattern }) => {
      const isbns = await generateIsbns({ variant, separator }, 1000)

      expect(isbns).toHaveLength(1000)
      for (const isbn of isbns) {
        expect(isbn).toMatch(pattern)
        const characters = isbn.replaceAll("-", "").split("")
        expect(characters).toHaveLength(variant)
        const checksum = characters.reduce((total, digit, index) => {
          const value = digit === "X" ? 10 : Number(digit)
          const weight = variant === 10 ? 10 - index : index % 2 === 0 ? 1 : 3
          return total + value * weight
        }, 0)
        expect(checksum % (variant === 10 ? 11 : 10)).toBe(0)
      }
    }
  )
})
