import { describe, expect, it } from 'vitest'
import {
  ExifActions,
  ExifCategorySection,
  ExifDataDisplay,
  ImagePreview,
  ImageUpload,
  WhatIsExif,
} from './index'

describe('components index', () => {
  it('exports viewer components', () => {
    expect(ImageUpload).toBeTruthy()
    expect(ImagePreview).toBeTruthy()
    expect(ExifDataDisplay).toBeTruthy()
    expect(ExifCategorySection).toBeTruthy()
    expect(ExifActions).toBeTruthy()
    expect(WhatIsExif).toBeTruthy()
  })
})
