import { describe, expect, it } from 'vitest'
import * as indexExports from './index'

describe('hash-text-or-file-template exports', () => {
  it('re-exports HashTextOrFileTemplate', () => {
    expect(indexExports.HashTextOrFileTemplate).toBeDefined()
  })
})
