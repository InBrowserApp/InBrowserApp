import { describe, expect, it } from 'vitest'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexExports from './index'

describe('iban-validator exports', () => {
  it('exposes tool info and routes', () => {
    expect(toolInfo.toolID).toBe('iban-validator')
    expect(routes[0]?.path).toBe(toolInfo.path)
  })

  it('re-exports tool info from index', () => {
    expect(indexExports.toolInfo.toolID).toBe(toolInfo.toolID)
  })
})
