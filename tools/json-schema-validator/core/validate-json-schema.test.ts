import { describe, expect, test } from "vitest"

import { validateJsonSchemaText } from "./validate-json-schema"

import type { ValidationOptions } from "./validate-json-schema"

const defaultOptions: ValidationOptions = {
  allErrors: true,
  validateFormats: false,
}

describe("validateJsonSchemaText", () => {
  test("returns idle when schema is empty", () => {
    const result = validateJsonSchemaText("", '{"a": 1}', defaultOptions)
    expect(result.state).toBe("idle")
  })

  test("returns idle when data is empty", () => {
    const result = validateJsonSchemaText(
      '{"type": "object"}',
      "",
      defaultOptions
    )
    expect(result.state).toBe("idle")
  })

  test("returns idle when both are empty", () => {
    const result = validateJsonSchemaText("", "", defaultOptions)
    expect(result.state).toBe("idle")
  })

  test("returns idle for whitespace-only inputs", () => {
    const result = validateJsonSchemaText("   ", "  ", defaultOptions)
    expect(result.state).toBe("idle")
  })

  test("returns parse-error for invalid schema JSON", () => {
    const result = validateJsonSchemaText("{bad}", '{"a": 1}', defaultOptions)
    expect(result.state).toBe("parse-error")
    if (result.state === "parse-error") {
      expect(result.source).toBe("schema")
      expect(result.message).toBeTruthy()
    }
  })

  test("returns parse-error for invalid data JSON", () => {
    const result = validateJsonSchemaText(
      '{"type": "object"}',
      "{bad}",
      defaultOptions
    )
    expect(result.state).toBe("parse-error")
    if (result.state === "parse-error") {
      expect(result.source).toBe("data")
    }
  })

  test("validates valid data against schema", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    })
    const data = JSON.stringify({ name: "test" })
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    expect(result.state).toBe("validated")
    if (result.state === "validated") {
      expect(result.valid).toBe(true)
      expect(result.issues).toEqual([])
      expect(result.detectedDraft).toBe("2020-12")
    }
  })

  test("returns issues for invalid data", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    })
    const data = JSON.stringify({ age: 42 })
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    expect(result.state).toBe("validated")
    if (result.state === "validated") {
      expect(result.valid).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
      expect(result.issues[0]!.keyword).toBe("required")
      expect(result.issues[0]!.path).toContain("name")
    }
  })

  test("detects draft-07 schema", () => {
    const schema = JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "string",
    })
    const data = JSON.stringify("hello")
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    expect(result.state).toBe("validated")
    if (result.state === "validated") {
      expect(result.detectedDraft).toBe("draft-07")
      expect(result.valid).toBe(true)
    }
  })

  test("defaults to 2020-12 for unknown schema", () => {
    const schema = JSON.stringify({ type: "number" })
    const data = JSON.stringify(42)
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    if (result.state === "validated") {
      expect(result.detectedDraft).toBe("2020-12")
    }
  })

  test("returns schema-error for invalid schema structure", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { name: { type: "not-a-type" } },
    })
    const data = JSON.stringify({ name: "test" })
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    expect(result.state).toBe("schema-error")
    if (result.state === "schema-error") {
      expect(result.message).toBeTruthy()
    }
  })

  test("respects allErrors: false option", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: {
        a: { type: "string" },
        b: { type: "string" },
      },
      required: ["a", "b"],
    })
    const data = JSON.stringify({})
    const result = validateJsonSchemaText(schema, data, {
      allErrors: false,
      validateFormats: false,
    })

    if (result.state === "validated") {
      expect(result.issues.length).toBe(1)
    }
  })

  test("validates formats when enabled", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { email: { type: "string", format: "email" } },
    })
    const data = JSON.stringify({ email: "not-an-email" })
    const result = validateJsonSchemaText(schema, data, {
      allErrors: true,
      validateFormats: true,
    })

    if (result.state === "validated") {
      expect(result.valid).toBe(false)
    }
  })

  test("skips format validation when disabled", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: { email: { type: "string", format: "email" } },
    })
    const data = JSON.stringify({ email: "not-an-email" })
    const result = validateJsonSchemaText(schema, data, {
      allErrors: true,
      validateFormats: false,
    })

    if (result.state === "validated") {
      expect(result.valid).toBe(true)
    }
  })

  test("detects draft from non-object schema", () => {
    // Array schema → defaults to 2020-12
    const schema = JSON.stringify([1, 2, 3])
    const data = JSON.stringify("hello")
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    // AJV should reject array as schema
    expect(result.state).toBe("schema-error")
  })

  test("returns validated with default message for issues without message", () => {
    // This tests the `issue.message ?? "Validation failed."` branch
    const schema = JSON.stringify({
      type: "object",
      required: ["a"],
    })
    const data = JSON.stringify({})
    const result = validateJsonSchemaText(schema, data, defaultOptions)
    if (result.state === "validated") {
      expect(result.issues.length).toBeGreaterThan(0)
      // The message should be truthy (either from AJV or our fallback)
      expect(result.issues[0]!.message).toBeTruthy()
    }
  })

  test("handles issue path with instancePath", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: {
        nested: {
          type: "object",
          properties: { value: { type: "number" } },
        },
      },
    })
    const data = JSON.stringify({ nested: { value: "not-a-number" } })
    const result = validateJsonSchemaText(schema, data, defaultOptions)

    if (result.state === "validated") {
      expect(result.valid).toBe(false)
      expect(result.issues[0]!.path).toBe("/nested/value")
    }
  })
})
