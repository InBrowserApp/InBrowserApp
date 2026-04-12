import { describe, expect, it } from "vitest"

import { parseStoredFormatOptions } from "./storage"

describe("parseStoredFormatOptions", () => {
  it("returns defaults for missing or invalid payloads", () => {
    expect(parseStoredFormatOptions(null)).toMatchObject({
      language: "javascript",
      printWidth: 80,
      tabWidth: 2,
    })
    expect(parseStoredFormatOptions("{")).toMatchObject({
      language: "javascript",
      printWidth: 80,
      tabWidth: 2,
    })
  })

  it("sanitizes stored values before returning them", () => {
    expect(
      parseStoredFormatOptions(
        JSON.stringify({
          language: "typescript",
          printWidth: 500,
          tabWidth: 0,
          useTabs: true,
          semi: false,
          singleQuote: true,
          trailingComma: "all",
        })
      )
    ).toEqual({
      language: "typescript",
      printWidth: 200,
      tabWidth: 1,
      useTabs: true,
      semi: false,
      singleQuote: true,
      trailingComma: "all",
    })
  })

  it("falls back for invalid enum and boolean values inside parsed payloads", () => {
    expect(
      parseStoredFormatOptions(
        JSON.stringify({
          language: "lua",
          printWidth: 120,
          tabWidth: 4,
          useTabs: "yes",
          semi: "sometimes",
          singleQuote: "nope",
          trailingComma: "weird",
        })
      )
    ).toEqual({
      language: "javascript",
      printWidth: 120,
      tabWidth: 4,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
    })
  })
})
