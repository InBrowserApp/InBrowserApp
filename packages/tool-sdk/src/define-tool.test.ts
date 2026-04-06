import { describe, expect, test } from "vitest"

import { defineTool } from "./define-tool"
import { ToolContractError } from "./errors"

describe("defineTool", () => {
  test("returns the definition for valid input", () => {
    const definition = {
      category: "text",
      icon: "binary",
      tags: ["a"],
    } as const
    const result = defineTool(definition)
    expect(result).toBe(definition)
  })

  test("returns definition without optional tags", () => {
    const definition = { category: "text", icon: "binary" } as const
    expect(defineTool(definition)).toBe(definition)
  })

  test("throws ToolContractError for invalid input", () => {
    expect(() => defineTool({ category: "", icon: "" } as any)).toThrow(
      ToolContractError
    )
  })
})
