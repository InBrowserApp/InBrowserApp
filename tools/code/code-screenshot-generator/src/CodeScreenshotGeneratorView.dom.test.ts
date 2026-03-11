import { describe, it, expect, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref<string | undefined>('blob:mock'),
  }
})

vi.mock('./utils/raster', () => ({
  rasterizeSvg: vi.fn(async () => new Blob(['ok'], { type: 'image/png' })),
}))

import { mount } from '@vue/test-utils'
import CodeScreenshotGeneratorView from './CodeScreenshotGeneratorView.vue'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        inheritAttrs: false,
        props: ['info'],
        template: '<div><slot /></div>',
      },
      CopyToClipboardButton: {
        props: ['content', 'variant', 'disabled'],
        template: '<button><slot /><slot name="label" /></button>',
      },
    },
  },
}

describe('CodeScreenshotGeneratorView', () => {
  it('renders the editor and export sections', () => {
    const wrapper = mount(CodeScreenshotGeneratorView, mountOptions)

    expect(wrapper.text()).toContain('Code')
    expect(wrapper.text()).toContain('Preview')
    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('PNG')
    expect(wrapper.text()).toContain('HTML')

    wrapper.unmount()
  })
})
