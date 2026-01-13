import { describe, it, expect } from 'vitest'
import { detectSchemaDraft, validateJsonSchema } from './index'

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
})
