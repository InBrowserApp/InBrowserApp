import { describe, expect, it, vi } from 'vitest'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
  ToolDefaultPageLayout: { name: 'ToolDefaultPageLayout', template: '<div><slot /></div>' },
}))

import * as components from './index'

describe('image cropper component index', () => {
  it('re-exports the public cropper components', () => {
    expect(components.CropPresetBar).toBeDefined()
    expect(components.CropResultPanel).toBeDefined()
    expect(components.CropSettingsPanel).toBeDefined()
    expect(components.CropWorkspace).toBeDefined()
    expect(components.ImageCropUpload).toBeDefined()
  })
})
