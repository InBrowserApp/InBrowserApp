import { describe, expect, it } from 'vitest'
import * as imageUtils from './index'
import * as metadata from './metadata'
import * as palette from './palette'
import * as png from './png'
import * as optimize from './png/optimize'

describe('image utility exports', () => {
  it('re-exports shared image helpers from index modules', () => {
    expect(imageUtils.PngIcoConverter).toBeDefined()
    expect(imageUtils.getImageSize).toBeDefined()
    expect(imageUtils.optimizePNG).toBe(optimize.optimizePNG)
    expect(imageUtils.stripImageMetadata).toBe(metadata.stripImageMetadata)
    expect(imageUtils.extractPalette).toBe(palette.extractPalette)
    expect(png.optimizePNG).toBe(optimize.optimizePNG)
  })
})
