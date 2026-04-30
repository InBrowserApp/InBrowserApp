import { describe, expect, test } from "vitest"

import {
  defaultTargetId,
  getDownloadFilename,
  getTargetConfig,
  targetGroups,
  wrapFetchWithAsyncAwait,
} from "./targets"

describe("targetGroups", () => {
  test("contains grouped target options", () => {
    expect(targetGroups.length).toBeGreaterThan(0)
    expect(targetGroups[0]?.options.length).toBeGreaterThan(0)
  })
})

describe("getTargetConfig", () => {
  test("returns the default target config", () => {
    const config = getTargetConfig(defaultTargetId)

    expect(config).toBeDefined()
    expect(config?.id).toBe("javascript-fetch")
    expect(config?.label).toContain("fetch")
  })

  test("returns undefined for unknown target ids", () => {
    expect(getTargetConfig("missing-target")).toBeUndefined()
  })
})

describe("getDownloadFilename", () => {
  test("uses the configured extension", () => {
    expect(getDownloadFilename("python-requests")).toBe("converted.py")
  })

  test("falls back to txt for unknown targets", () => {
    expect(getDownloadFilename("missing-target")).toBe("converted.txt")
  })
})

describe("wrapFetchWithAsyncAwait", () => {
  test("returns trimmed code when no fetch call exists", () => {
    expect(wrapFetchWithAsyncAwait("  const value = 'x'\n")).toBe(
      "const value = 'x'"
    )
  })

  test("wraps fetch calls and keeps imports", () => {
    const transformed = wrapFetchWithAsyncAwait(
      "import fetch from 'node-fetch'\nfetch('https://a.example')\n  api.fetch('https://b.example');\nconsole.log('done')"
    )

    expect(transformed).toContain("import fetch from 'node-fetch'")
    expect(transformed).toContain("async function run()")
    expect(transformed).toContain(
      "const response = await fetch('https://a.example')"
    )
    expect(transformed).toContain(
      "const response2 = await api.fetch('https://b.example')"
    )
    expect(transformed).toContain("  console.log('done')")
    expect(transformed.endsWith("run()")).toBe(true)
  })

  test("keeps non-fetch lines when a fetch call is present", () => {
    const transformed = wrapFetchWithAsyncAwait(
      "const request = 'fetch()'\nfetch('https://example.com')"
    )

    expect(transformed).toContain("const request = 'fetch()'")
    expect(transformed).toContain(
      "const response = await fetch('https://example.com')"
    )
  })
})
