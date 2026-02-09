import Ajv2020 from 'ajv/dist/2020'
import { describe, expect, it, vi } from 'vitest'
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

  it('falls back to 2020-12 for nullish and unknown schemas', () => {
    expect(detectSchemaDraft(null)).toEqual({ draft: '2020-12', detected: false })

    const info = detectSchemaDraft({ $schema: 'https://example.com/custom-schema' })
    expect(info).toEqual({
      draft: '2020-12',
      detected: false,
      raw: 'https://example.com/custom-schema',
    })
  })

  it('detects other known drafts and ignores non-string draft markers', () => {
    const draft2019 = detectSchemaDraft({
      $schema: ' https://json-schema.org/draft/2019-09/schema# ',
    })
    expect(draft2019).toEqual({
      draft: '2019-09',
      detected: true,
      raw: ' https://json-schema.org/draft/2019-09/schema# ',
    })

    const draft07 = detectSchemaDraft({
      $schema: 'http://json-schema.org/draft-07/schema',
    })
    expect(draft07).toEqual({
      draft: 'draft-07',
      detected: true,
      raw: 'http://json-schema.org/draft-07/schema',
    })

    const nonString = detectSchemaDraft({ $schema: 2020 as unknown as string })
    expect(nonString).toEqual({ draft: '2020-12', detected: false })
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

  it('validates draft-07 and 2019-09 schemas and supports disabling format checks', () => {
    const draft7Schema = {
      $schema: 'http://json-schema.org/draft-07/schema',
      type: 'string',
      format: 'email',
    }

    const strictFormat = validateJsonSchema(draft7Schema, 'not-an-email')
    expect(strictFormat.valid).toBe(false)
    expect(strictFormat.draft).toBe('draft-07')
    expect(strictFormat.detected).toBe(true)

    const formatDisabled = validateJsonSchema(draft7Schema, 'not-an-email', {
      validateFormats: false,
    })
    expect(formatDisabled.valid).toBe(true)

    const draft2019Schema = {
      $schema: 'https://json-schema.org/draft/2019-09/schema',
      type: 'number',
    }
    const draft2019Result = validateJsonSchema(draft2019Schema, 3.14)
    expect(draft2019Result.valid).toBe(true)
    expect(draft2019Result.draft).toBe('2019-09')
    expect(draft2019Result.detected).toBe(true)
  })

  it('normalizes validation errors with missing message and params', () => {
    const compileSpy = vi.spyOn(Ajv2020.prototype, 'compile').mockImplementationOnce(() => {
      const validate = vi.fn(() => false) as unknown as {
        (data: unknown): boolean
        errors?: unknown
      }

      validate.errors = [
        {
          instancePath: '',
          schemaPath: '#/type',
          keyword: 'type',
        },
      ]

      return validate as never
    })

    const result = validateJsonSchema({ type: 'string' }, 123)

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual([
      {
        instancePath: '/',
        schemaPath: '#/type',
        keyword: 'type',
        message: '',
        params: {},
      },
    ])

    compileSpy.mockRestore()
  })

  it('returns schema errors when compilation throws Error objects', () => {
    const compileSpy = vi.spyOn(Ajv2020.prototype, 'compile').mockImplementationOnce(() => {
      throw new Error('compile from Error object')
    })

    const result = validateJsonSchema({ type: 'object' }, { value: 1 })

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual([])
    expect(result.schemaError).toBe('compile from Error object')
    compileSpy.mockRestore()
  })

  it('returns schema errors when compilation fails', () => {
    const compileSpy = vi.spyOn(Ajv2020.prototype, 'compile').mockImplementationOnce(() => {
      throw 'compile boom'
    })

    const result = validateJsonSchema({ type: 'object' }, { value: 1 })

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual([])
    expect(result.schemaError).toBe('compile boom')
    compileSpy.mockRestore()
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

  it('supports empty arrays and object arrays without common required fields', () => {
    const emptyArraySchema = generateJsonSchema([], { detectFormat: false })
    expect(emptyArraySchema).toMatchObject({ type: 'array', items: {} })

    const objectArraySchema = generateJsonSchema([{ left: 1 }, { right: 2 }], {
      inferRequired: true,
      detectFormat: false,
    })
    const items = objectArraySchema.items as Record<string, unknown>

    expect(items.type).toBe('object')
    expect(items.required).toBeUndefined()
  })

  it('supports merged object arrays when required inference is disabled', () => {
    const schema = generateJsonSchema([{}, { id: 1 }], {
      inferRequired: false,
      allowAdditionalProperties: false,
      detectFormat: false,
    })

    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe('object')
    expect(items.required).toBeUndefined()
    expect(items.additionalProperties).toBe(false)
  })

  it('merges nested array items and mixed number types', () => {
    const schema = generateJsonSchema([[1, 2], [3.5]], { detectFormat: false })

    expect(schema.type).toBe('array')
    const items = schema.items as Record<string, unknown>
    expect(items.type).toBe('array')

    const nestedItems = items.items as Record<string, unknown>
    expect(nestedItems.type).toBe('number')
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

  it('keeps shared string formats and drops mixed or empty formats', () => {
    const sharedFormatSchema = generateJsonSchema(['ada@example.com', 'grace@example.com'], {
      detectFormat: true,
    })
    expect(sharedFormatSchema.type).toBe('array')
    const sharedItems = sharedFormatSchema.items as Record<string, unknown>
    expect(sharedItems.type).toBe('string')
    expect(sharedItems.format).toBe('email')

    const mixedFormatSchema = generateJsonSchema(
      ['ada@example.com', 'https://example.com', '   '],
      {
        detectFormat: true,
      },
    )
    const mixedItems = mixedFormatSchema.items as Record<string, unknown>
    expect(mixedItems.type).toBe('string')
    expect(mixedItems.format).toBeUndefined()
  })

  it('treats invalid email-like values as plain strings', () => {
    const schema = generateJsonSchema(
      {
        plain: 'not_a_known_format',
        spaced: 'ada @example.com',
        missingLocal: '@example.com',
        missingDomain: 'ada@',
        noDot: 'ada@example',
        leadingDot: 'ada@.example.com',
        trailingDot: 'ada@example.com.',
        doubleDot: 'ada@example..com',
      },
      { detectFormat: true },
    )

    const properties = schema.properties as Record<string, Record<string, unknown>>
    for (const [key, property] of Object.entries(properties)) {
      expect(property.type).toBe('string')
      expect(property.format, key).toBeUndefined()
    }
  })

  it('supports optional object fields, unknown values, and anyOf arrays', () => {
    const objectSchema = generateJsonSchema(
      {
        count: 1,
        maybe: undefined,
      },
      {
        inferRequired: false,
        detectFormat: false,
      },
    )

    expect(objectSchema.required).toBeUndefined()
    const properties = objectSchema.properties as Record<string, Record<string, unknown>>
    expect(properties.count?.type).toBe('integer')
    expect(properties.maybe).toEqual({})

    const mixedSchema = generateJsonSchema([1, 'two', null, true, undefined], {
      detectFormat: false,
    })
    const mixedItems = mixedSchema.items as Record<string, unknown>
    expect(Array.isArray(mixedItems.anyOf)).toBe(true)
  })
})
