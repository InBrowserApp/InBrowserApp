import { describe, expect, it } from 'vitest'
import { dialectLabels, extensionToDialect, fileExtensions, sqlDialects } from './sqlDialects'

describe('sql dialects', () => {
  it('defines dialect keys and labels consistently', () => {
    expect(sqlDialects).toContain('sql')
    expect(sqlDialects).toContain('postgresql')
    expect(sqlDialects).toContain('tsql')

    for (const dialect of sqlDialects) {
      expect(dialectLabels[dialect]).toBeTruthy()
    }
  })

  it('maps file extensions to known dialects', () => {
    expect(extensionToDialect.sql).toBe('sql')
    expect(extensionToDialect.pgsql).toBe('postgresql')
    expect(extensionToDialect.psql).toBe('postgresql')
    expect(extensionToDialect.mysql).toBe('mysql')
    expect(extensionToDialect.tsql).toBe('tsql')
    expect(extensionToDialect.unknown).toBeUndefined()
  })

  it('contains expected file extension filters', () => {
    expect(fileExtensions).toContain('.sql')
    expect(fileExtensions).toContain('.txt')
    expect(fileExtensions).toContain('.mysql')
  })
})
