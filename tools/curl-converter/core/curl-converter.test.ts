import { describe, expect, test } from "vitest"

import { convertCurlToTarget } from "./converter"

describe("curl converter integration", () => {
  test("converts curl to javascript fetch with async wrapper", () => {
    const result = convertCurlToTarget(
      "curl 'https://example.com'",
      "javascript-fetch"
    )

    expect(result.error).toBeUndefined()
    expect(result.output).toContain("async function run()")
    expect(result.output).toMatch(
      /const response = await fetch\(['"]https:\/\/example\.com['"]\)/
    )
  })

  test("converts curl to python requests", () => {
    const result = convertCurlToTarget(
      "curl 'https://example.com'",
      "python-requests"
    )

    expect(result.error).toBeUndefined()
    expect(result.output).toContain("requests")
  })

  test("returns an error for an unknown target", () => {
    const result = convertCurlToTarget(
      "curl 'https://example.com'",
      "unknown-target"
    )

    expect(result.error).toBeTruthy()
  })
})
