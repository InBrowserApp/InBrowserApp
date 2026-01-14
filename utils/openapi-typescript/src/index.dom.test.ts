import { describe, expect, it } from 'vitest'
import { collectExternalRefs, generateOpenApiTypes, parseOpenApiDocument } from './index'

const sampleOpenApi = `openapi: 3.1.0
info:
  title: Sample API
  version: '1.0.0'
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
      required:
        - id
        - name
`

describe('openapi types utils', () => {
  it('parses a valid OpenAPI document', () => {
    const result = parseOpenApiDocument(sampleOpenApi)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.document.openapi.startsWith('3.')).toBe(true)
    expect(result.externalRefs).toHaveLength(0)
  })

  it('rejects unsupported OpenAPI versions', () => {
    const result = parseOpenApiDocument('openapi: 2.0.0\ninfo: { title: X, version: 1 }')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe('unsupported-version')
  })

  it('collects external $ref values', () => {
    const refs = collectExternalRefs({ $ref: 'schemas/user.yaml' })
    expect(refs).toEqual(['schemas/user.yaml'])
  })

  it('generates TypeScript output', () => {
    const result = parseOpenApiDocument(sampleOpenApi)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const output = generateOpenApiTypes(result.document, { includeHeader: false })
    expect(output).toContain('export interface paths')
    expect(output).toContain('export interface components')
  })
})
