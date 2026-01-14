import { describe, it, expect } from 'vitest'
import { tool, toolInfo } from './index'

describe('vat-validator index', () => {
  it('re-exports tool info', () => {
    expect(toolInfo.toolID).toBe('vat-validator')
    expect(toolInfo.path).toBe('/tools/vat-validator')
    expect(tool.toolID).toBe('vat-validator')
  })
})
