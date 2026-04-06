import { describe, expect, test } from "vitest"

import {
  toolDefinitionSchema,
  toolManifestSchema,
  toolMetaSchema,
  toolSlugSchema,
} from "./schema"

describe("toolSlugSchema", () => {
  test("accepts valid kebab-case slug", () => {
    expect(toolSlugSchema.safeParse("my-tool").success).toBe(true)
  })

  test("accepts single word", () => {
    expect(toolSlugSchema.safeParse("tool").success).toBe(true)
  })

  test("rejects uppercase", () => {
    expect(toolSlugSchema.safeParse("MyTool").success).toBe(false)
  })

  test("rejects spaces", () => {
    expect(toolSlugSchema.safeParse("my tool").success).toBe(false)
  })

  test("rejects empty string", () => {
    expect(toolSlugSchema.safeParse("").success).toBe(false)
  })

  test("trims whitespace before validation", () => {
    expect(toolSlugSchema.safeParse("  tool  ").success).toBe(true)
  })
})

describe("toolMetaSchema", () => {
  test("accepts valid meta", () => {
    const result = toolMetaSchema.safeParse({
      name: "Tool",
      description: "A tool",
    })
    expect(result.success).toBe(true)
  })

  test("rejects empty name", () => {
    expect(
      toolMetaSchema.safeParse({ name: "", description: "A tool" }).success
    ).toBe(false)
  })

  test("rejects empty description", () => {
    expect(
      toolMetaSchema.safeParse({ name: "Tool", description: "" }).success
    ).toBe(false)
  })
})

describe("toolDefinitionSchema", () => {
  test("accepts valid definition with tags", () => {
    const result = toolDefinitionSchema.safeParse({
      category: "text",
      icon: "binary",
      tags: ["a", "b"],
    })
    expect(result.success).toBe(true)
  })

  test("accepts definition without tags", () => {
    const result = toolDefinitionSchema.safeParse({
      category: "text",
      icon: "binary",
    })
    expect(result.success).toBe(true)
  })

  test("deduplicates tags", () => {
    const result = toolDefinitionSchema.parse({
      category: "text",
      icon: "binary",
      tags: ["a", "a", "b"],
    })
    expect(result.tags).toEqual(["a", "b"])
  })
})

describe("toolManifestSchema", () => {
  test("is the same as toolDefinitionSchema", () => {
    expect(toolManifestSchema).toBe(toolDefinitionSchema)
  })
})
