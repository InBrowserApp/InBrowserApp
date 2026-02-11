import { describe, expect, it } from 'vitest'
import * as components from './index'

describe('pdf merger component exports', () => {
  it('exports all merger components', () => {
    expect(components).toHaveProperty('PDFMergeUploader')
    expect(components).toHaveProperty('PDFMergeQueue')
    expect(components).toHaveProperty('PDFMergeActions')
    expect(components).toHaveProperty('PDFMergerTool')
  })
})
