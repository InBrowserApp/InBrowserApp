import { describe, expect, it, vi } from 'vitest'

vi.mock('./ImageCropperView.vue', () => ({
  default: { name: 'ImageCropperView' },
}))

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: { name: 'ToolDefaultPageLayout', template: '<div><slot /></div>' },
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

import * as componentIndex from './components/index'
import * as toolIndex from './index'
import * as toolInfo from './info'
import { routes } from './routes'
import { cropPresets } from './utils/crop-presets'

describe('image cropper exports', () => {
  it('exposes metadata, component exports, presets, and routes', async () => {
    expect(toolInfo.toolID).toBe('image-cropper')
    expect(toolInfo.path).toBe('/tools/image-cropper')
    expect(toolInfo.tags).toEqual(
      expect.arrayContaining(['image', 'crop', 'cropper', 'photo', 'avatar', 'thumbnail']),
    )
    expect(toolInfo.features).toEqual(['offline'])
    expect(toolInfo.meta.en.name).toBe('Image Cropper')
    expect(Object.keys(toolInfo.meta)).toHaveLength(25)
    expect(toolIndex.toolInfo.toolID).toBe(toolInfo.toolID)

    expect(componentIndex.CropPresetBar).toBeDefined()
    expect(componentIndex.CropResultPanel).toBeDefined()
    expect(componentIndex.CropSettingsPanel).toBeDefined()
    expect(componentIndex.CropWorkspace).toBeDefined()
    expect(componentIndex.ImageCropUpload).toBeDefined()

    expect(cropPresets).toHaveLength(9)
    expect(cropPresets[0]).toEqual({ id: 'free', ratio: null })
    expect(cropPresets[cropPresets.length - 1]).toEqual({ id: '2:3', ratio: 2 / 3 })

    const route = routes[0]
    expect(route).toBeDefined()
    expect(route?.name).toBe(toolInfo.toolID)
    expect(route?.path).toBe(toolInfo.path)

    if (!route || typeof route.component !== 'function') {
      throw new Error('Route component loader is missing')
    }

    const module = await (route.component as () => Promise<unknown>)()
    expect(module).toHaveProperty('default')
  })
})
