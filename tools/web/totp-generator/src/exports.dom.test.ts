import { describe, expect, it } from 'vitest'
import * as toolIndex from './index'

describe('tool exports', () => {
  it('re-exports the tool metadata namespace', () => {
    expect(toolIndex.toolInfo.toolID).toBe('totp-generator')
  })
})
