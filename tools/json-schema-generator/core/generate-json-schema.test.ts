import { describe, expect, it } from "vitest"

import { generateJsonSchema } from "./generate-json-schema"

describe("generateJsonSchema", () => {
  it("adds the selected draft id to the generated schema", () => {
    expect(generateJsonSchema({ id: 1 }).$schema).toBe(
      "https://json-schema.org/draft/2020-12/schema"
    )
    expect(generateJsonSchema({ id: 1 }, { draft: "2019-09" }).$schema).toBe(
      "https://json-schema.org/draft/2019-09/schema"
    )
    expect(generateJsonSchema({ id: 1 }, { draft: "draft-07" }).$schema).toBe(
      "http://json-schema.org/draft-07/schema"
    )
  })

  it("generates object schemas with required properties and additionalProperties control", () => {
    const schema = generateJsonSchema(
      { id: 1, name: "Ada", tags: ["a", "b"] },
      {
        draft: "2020-12",
        inferRequired: true,
        allowAdditionalProperties: false,
        detectFormat: false,
      }
    )

    expect(schema.type).toBe("object")
    expect(schema.required).toEqual(["id", "name", "tags"])
    expect(schema.additionalProperties).toBe(false)

    const properties = schema.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(properties.id?.type).toBe("integer")
    expect(properties.name?.type).toBe("string")
    expect(properties.tags?.type).toBe("array")
    expect((properties.tags?.items as Record<string, unknown>)?.type).toBe(
      "string"
    )
  })

  it("merges object schemas inside arrays and infers optional fields", () => {
    const schema = generateJsonSchema(
      [
        { id: 1, name: "Ada" },
        { id: 2, email: "ada@example.com" },
      ],
      { inferRequired: true, detectFormat: false }
    )

    expect(schema.type).toBe("array")
    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe("object")
    expect(items.required).toEqual(["id"])

    const properties = items.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(Object.keys(properties)).toEqual(["id", "name", "email"])
    expect(properties.email?.type).toBe("string")
  })

  it("supports empty arrays and object arrays without common required fields", () => {
    const emptyArraySchema = generateJsonSchema([], { detectFormat: false })
    expect(emptyArraySchema).toMatchObject({ type: "array", items: {} })

    const objectArraySchema = generateJsonSchema([{ left: 1 }, { right: 2 }], {
      inferRequired: true,
      detectFormat: false,
    })
    const items = objectArraySchema.items as Record<string, unknown>

    expect(items.type).toBe("object")
    expect(items.required).toBeUndefined()
  })

  it("supports merged object arrays when required inference is disabled", () => {
    const schema = generateJsonSchema([{}, { id: 1 }], {
      inferRequired: false,
      allowAdditionalProperties: false,
      detectFormat: false,
    })

    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe("object")
    expect(items.required).toBeUndefined()
    expect(items.additionalProperties).toBe(false)
  })

  it("merges nested array items and mixed number types", () => {
    const schema = generateJsonSchema([[1, 2], [3.5]], {
      detectFormat: false,
    })

    expect(schema.type).toBe("array")
    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe("array")

    const nestedItems = items.items as Record<string, unknown>
    expect(nestedItems.type).toBe("number")
  })

  it("detects string formats when enabled", () => {
    const schema = generateJsonSchema(
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "ada@example.com",
        url: "https://example.com",
        timestamp: "2024-01-20T10:12:30Z",
      },
      { detectFormat: true }
    )

    const properties = schema.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(properties.id?.format).toBe("uuid")
    expect(properties.email?.format).toBe("email")
    expect(properties.url?.format).toBe("uri")
    expect(properties.timestamp?.format).toBe("date-time")

    const schemaWithoutFormat = generateJsonSchema(
      { id: "550e8400-e29b-41d4-a716-446655440000" },
      { detectFormat: false }
    )
    const noFormatProperties = schemaWithoutFormat.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(noFormatProperties.id?.format).toBeUndefined()
  })

  it("keeps shared string formats and drops mixed or empty formats", () => {
    const sharedFormatSchema = generateJsonSchema(
      ["ada@example.com", "grace@example.com"],
      { detectFormat: true }
    )
    expect(sharedFormatSchema.type).toBe("array")
    const sharedItems = sharedFormatSchema.items as Record<string, unknown>
    expect(sharedItems.type).toBe("string")
    expect(sharedItems.format).toBe("email")

    const mixedFormatSchema = generateJsonSchema(
      ["ada@example.com", "https://example.com", "   "],
      {
        detectFormat: true,
      }
    )
    const mixedItems = mixedFormatSchema.items as Record<string, unknown>
    expect(mixedItems.type).toBe("string")
    expect(mixedItems.format).toBeUndefined()
  })

  it("treats invalid email-like values as plain strings", () => {
    const schema = generateJsonSchema(
      {
        plain: "not_a_known_format",
        spaced: "ada @example.com",
        missingLocal: "@example.com",
        missingDomain: "ada@",
        noDot: "ada@example",
        leadingDot: "ada@.example.com",
        trailingDot: "ada@example.com.",
        doubleDot: "ada@example..com",
      },
      { detectFormat: true }
    )

    const properties = schema.properties as Record<
      string,
      Record<string, unknown>
    >
    for (const [key, property] of Object.entries(properties)) {
      expect(property.type, key).toBe("string")
      expect(property.format, key).toBeUndefined()
    }
  })

  it("supports null, booleans, and unknown values", () => {
    expect(generateJsonSchema(null).type).toBe("null")
    expect(generateJsonSchema(true).type).toBe("boolean")
    expect(generateJsonSchema(undefined)).toEqual({
      $schema: "https://json-schema.org/draft/2020-12/schema",
    })
  })

  it("supports optional object fields and anyOf arrays", () => {
    const objectSchema = generateJsonSchema(
      {
        count: 1,
        maybe: undefined,
      },
      {
        inferRequired: false,
        detectFormat: false,
      }
    )

    expect(objectSchema.required).toBeUndefined()
    const properties = objectSchema.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(properties.count?.type).toBe("integer")
    expect(properties.maybe).toEqual({})

    const mixedSchema = generateJsonSchema([1, "two", null, true, undefined], {
      detectFormat: false,
    })
    const mixedItems = mixedSchema.items as Record<string, unknown>
    expect(Array.isArray(mixedItems.anyOf)).toBe(true)
  })

  it("deduplicates repeated schemas inside arrays", () => {
    const schema = generateJsonSchema(
      [
        { id: 1, name: "Ada" },
        { name: "Ada", id: 2 },
      ],
      { detectFormat: false }
    )

    const items = schema.items as Record<string, unknown>
    const properties = items.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(Object.keys(properties)).toEqual(["id", "name"])
  })
  it("returns plain string items when no shared string format exists", () => {
    const schema = generateJsonSchema(["alpha", "beta"], {
      detectFormat: true,
    })

    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe("string")
    expect(items.format).toBeUndefined()
  })

  it("merges boolean and null arrays without anyOf", () => {
    const booleanSchema = generateJsonSchema([true, false], {
      detectFormat: false,
    })
    expect((booleanSchema.items as Record<string, unknown>).type).toBe(
      "boolean"
    )

    const nullSchema = generateJsonSchema([null, null], {
      detectFormat: false,
    })
    expect((nullSchema.items as Record<string, unknown>).type).toBe("null")
  })

  it("falls back to object keys when a merged object schema omits required", () => {
    const schema = generateJsonSchema([{}, { id: 1 }], {
      inferRequired: true,
      detectFormat: false,
    })

    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe("object")
    expect(items.required).toBeUndefined()

    const properties = items.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(properties.id?.type).toBe("integer")
  })
})
