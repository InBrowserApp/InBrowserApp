import { describe, expect, test } from "vitest"

import { ToolContractError } from "./errors"
import {
  assertToolDefinition,
  assertToolManifest,
  assertToolMetaCatalogs,
  resolveRequiredLanguages,
  validateToolDefinition,
  validateToolManifest,
  validateToolMetaCatalogs,
} from "./validate"

describe("resolveRequiredLanguages", () => {
  test("returns default required languages when no options", () => {
    expect(resolveRequiredLanguages()).toEqual(["en"])
  })

  test("returns default when options has no requiredLanguages", () => {
    expect(resolveRequiredLanguages({})).toEqual(["en"])
  })

  test("returns custom required languages", () => {
    expect(
      resolveRequiredLanguages({ requiredLanguages: ["en", "zh-CN"] })
    ).toEqual(["en", "zh-CN"])
  })

  test("deduplicates languages", () => {
    expect(
      resolveRequiredLanguages({ requiredLanguages: ["en", "en"] })
    ).toEqual(["en"])
  })
})

describe("validateToolDefinition", () => {
  const validDefinition = { category: "text", icon: "binary", tags: ["a"] }

  test("returns valid for correct definition", () => {
    const result = validateToolDefinition(validDefinition)
    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
  })

  test("returns issues with (root) path for completely invalid input", () => {
    const result = validateToolDefinition("not-an-object" as any)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.includes("(root)"))).toBe(true)
  })

  test("returns issues for missing fields", () => {
    const result = validateToolDefinition({
      category: "",
      icon: "",
    } as any)
    expect(result.valid).toBe(false)
    expect(result.issues.length).toBeGreaterThan(0)
  })

  test("returns issues for invalid category format", () => {
    const result = validateToolDefinition({
      category: "INVALID CATEGORY",
      icon: "binary",
    } as any)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.includes("category"))).toBe(true)
  })

  test("validates without tags (optional field)", () => {
    const result = validateToolDefinition({ category: "text", icon: "binary" })
    expect(result.valid).toBe(true)
  })
})

describe("assertToolDefinition", () => {
  test("does not throw for valid definition", () => {
    expect(() =>
      assertToolDefinition({ category: "text", icon: "binary" })
    ).not.toThrow()
  })

  test("throws ToolContractError for invalid definition", () => {
    expect(() =>
      assertToolDefinition({ category: "", icon: "" } as any)
    ).toThrow(ToolContractError)
  })
})

describe("validateToolManifest", () => {
  test("is an alias for validateToolDefinition", () => {
    expect(validateToolManifest).toBe(validateToolDefinition)
  })
})

describe("assertToolManifest", () => {
  test("is an alias for assertToolDefinition", () => {
    expect(assertToolManifest).toBe(assertToolDefinition)
  })
})

describe("validateToolMetaCatalogs", () => {
  test("returns valid for correct catalogs", () => {
    const result = validateToolMetaCatalogs({
      en: { name: "Tool", description: "A tool" },
    })
    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
  })

  test("returns issues for missing required language", () => {
    const result = validateToolMetaCatalogs({
      "zh-CN": { name: "工具", description: "一个工具" },
    } as any)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.includes("missing"))).toBe(true)
  })

  test("returns issues for invalid meta fields", () => {
    const result = validateToolMetaCatalogs({
      en: { name: "", description: "" },
    } as any)
    expect(result.valid).toBe(false)
    expect(result.issues.length).toBeGreaterThan(0)
  })

  test("uses custom required languages", () => {
    const result = validateToolMetaCatalogs(
      { en: { name: "Tool", description: "Desc" } },
      { requiredLanguages: ["en", "zh-CN"] }
    )
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.includes("zh-CN"))).toBe(true)
  })

  test("reports missing languages for empty catalogs", () => {
    const result = validateToolMetaCatalogs({} as any)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.includes("missing"))).toBe(true)
  })

  test("handles catalogs passed as undefined-like value via getMissingLanguages", () => {
    // Cast to bypass TS — exercises the `if (!entries)` branch
    const result = validateToolMetaCatalogs(Object.create(null) as any)
    expect(result.valid).toBe(false)
  })
})

describe("assertToolMetaCatalogs", () => {
  test("does not throw for valid catalogs", () => {
    expect(() =>
      assertToolMetaCatalogs({
        en: { name: "Tool", description: "A tool" },
      })
    ).not.toThrow()
  })

  test("throws ToolContractError for invalid catalogs", () => {
    expect(() => assertToolMetaCatalogs({} as any)).toThrow(ToolContractError)
  })
})
