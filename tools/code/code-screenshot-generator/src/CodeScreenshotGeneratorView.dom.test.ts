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
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import CodeScreenshotGeneratorView from './CodeScreenshotGeneratorView.vue'

const Wrapper = {
  render() {
    return h(NMessageProvider, () => h(CodeScreenshotGeneratorView))
  },
}

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        inheritAttrs: false,
        props: ['info'],
        template: '<div><slot /></div>',
      },
    },
  },
}

describe('CodeScreenshotGeneratorView', () => {
  it('renders the editor and export sections', () => {
    const wrapper = mount(Wrapper, mountOptions)

    expect(wrapper.text()).toContain('Code')
    expect(wrapper.text()).toContain('Preview')
    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('PNG')
    expect(wrapper.text()).toContain('HTML')
  })
})
