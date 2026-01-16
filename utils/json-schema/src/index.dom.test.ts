import { describe, it, expect } from 'vitest'
import { detectSchemaDraft, generateJsonSchema, validateJsonSchema } from './index'

describe('json-schema utils', () => {
  it('detects draft from $schema', () => {
    const schema = { $schema: 'https://json-schema.org/draft/2020-12/schema#' }
    const info = detectSchemaDraft(schema)
    expect(info.draft).toBe('2020-12')
    expect(info.detected).toBe(true)
  })

  it('falls back to 2020-12 when $schema is missing', () => {
    const info = detectSchemaDraft({ type: 'object' })
    expect(info.draft).toBe('2020-12')
    expect(info.detected).toBe(false)
  })

  it('validates data against schema', () => {
    const schema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name'],
      additionalProperties: false,
    }

    const validResult = validateJsonSchema(schema, { name: 'Ada', age: 37 })
    expect(validResult.valid).toBe(true)
    expect(validResult.errors).toHaveLength(0)

    const invalidResult = validateJsonSchema(schema, { age: 'nope' })
    expect(invalidResult.valid).toBe(false)
    expect(invalidResult.errors.length).toBeGreaterThan(0)
    expect(invalidResult.errors.some((error) => error.keyword === 'required')).toBe(true)
  })

  it('generates a schema with required properties and additionalProperties control', () => {
    const schema = generateJsonSchema(
      { id: 1, name: 'Ada', tags: ['a', 'b'] },
      {
        draft: '2020-12',
        inferRequired: true,
        allowAdditionalProperties: false,
        detectFormat: false,
      },
    )

    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    expect(schema.type).toBe('object')
    expect(schema.required).toEqual(['id', 'name', 'tags'])
    expect(schema.additionalProperties).toBe(false)

    const properties = schema.properties as Record<string, Record<string, unknown>>
    expect(properties.id?.type).toBe('integer')
    expect(properties.name?.type).toBe('string')
    expect(properties.tags?.type).toBe('array')
    expect((properties.tags?.items as Record<string, unknown>)?.type).toBe('string')
  })

  it('merges object schemas inside arrays and infers optional fields', () => {
    const schema = generateJsonSchema(
      [
        { id: 1, name: 'Ada' },
        { id: 2, email: 'ada@example.com' },
      ],
      { inferRequired: true, detectFormat: false },
    )

    expect(schema.type).toBe('array')
    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe('object')
    expect(items.required).toEqual(['id'])

    const properties = items.properties as Record<string, Record<string, unknown>>
    expect(Object.keys(properties)).toEqual(['id', 'name', 'email'])
    expect(properties.email?.type).toBe('string')
  })

  it('detects string formats when enabled', () => {
    const schema = generateJsonSchema(
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'ada@example.com',
        url: 'https://example.com',
        timestamp: '2024-01-20T10:12:30Z',
      },
      { detectFormat: true },
    )

    const properties = schema.properties as Record<string, Record<string, unknown>>
    expect(properties.id?.format).toBe('uuid')
    expect(properties.email?.format).toBe('email')
    expect(properties.url?.format).toBe('uri')
    expect(properties.timestamp?.format).toBe('date-time')

    const schemaWithoutFormat = generateJsonSchema(
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { detectFormat: false },
    )
    const noFormatProperties = schemaWithoutFormat.properties as Record<
      string,
      Record<string, unknown>
    >
    expect(noFormatProperties.id?.format).toBeUndefined()
  })
})
