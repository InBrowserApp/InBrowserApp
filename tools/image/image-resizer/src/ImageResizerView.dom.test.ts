import { computed, defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const { resizeImageMock } = vi.hoisted(() => ({
  resizeImageMock: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useObjectUrl: (value: { value: Blob | null }) =>
      computed(() => (value.value ? 'blob:mock-result' : undefined)),
  }
})

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')

  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
    }),
  }
})

vi.mock('./components', async () => {
  return {
    ImageResizeInput: defineComponent({
      name: 'ImageResizeInput',
      props: ['dimensions', 'file'],
      emits: ['update:file'],
      template:
        '<div class="input-stub">{{ dimensions ? `${dimensions.width}x${dimensions.height}` : "no-dim" }}</div>',
    }),
    ResizeOptionsPanel: defineComponent({
      name: 'ResizeOptionsPanel',
      props: ['qualityDisabled', 'allowUpscaleLabel', 'maxDimension'],
      emits: ['resize'],
      template: `
        <div class="options-stub">
          <button class="resize-button" @click="$emit('resize')">resize</button>
          <span class="quality-disabled">{{ String(qualityDisabled) }}</span>
          <span class="allow-upscale-label">{{ allowUpscaleLabel }}</span>
          <span class="max-dimension">{{ maxDimension }}</span>
        </div>
      `,
    }),
    ResizeResultPanel: defineComponent({
      name: 'ResizeResultPanel',
      props: ['result'],
      template: '<div class="result-panel">{{ result.outputName }}</div>',
    }),
  }
})

vi.mock('./utils/resize-image', async () => {
  return {
    imageResizeAlgorithms: [{ value: 'browser-high', labelKey: 'algorithmBrowserHigh' }],
    resizeImage: resizeImageMock,
  }
})

import ImageResizerView from './ImageResizerView.vue'

class MockBitmap {
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  close() {
    return undefined
  }
}

beforeEach(() => {
  resizeImageMock.mockReset()
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(async () => new MockBitmap(1200, 800)),
  )
})

function getVm(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as {
    imageFile: File | null
    options: { width: number }
  }
}

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        inheritAttrs: false,
        props: ['info'],
        template: '<div><slot /></div>',
      },
      ToolSection: { template: '<section><slot /></section>' },
    },
  },
}

describe('ImageResizerView', () => {
  it('disables quality when auto output resolves to PNG fallback input', async () => {
    const wrapper = mount(ImageResizerView, mountOptions)

    getVm(wrapper).imageFile = new File(['gif'], 'demo.gif', {
      type: 'image/gif',
    })
    await flushPromises()

    expect(wrapper.find('.quality-disabled').text()).toBe('true')
    expect(wrapper.find('.max-dimension').text()).toBe('16384')
  })

  it('clears stale results when options change after a resize', async () => {
    resizeImageMock.mockResolvedValue({
      blob: new Blob(['png'], { type: 'image/png' }),
      outputName: 'demo.png',
      originalWidth: 1200,
      originalHeight: 800,
      outputWidth: 600,
      outputHeight: 400,
      mimeType: 'image/png',
    })

    const wrapper = mount(ImageResizerView, mountOptions)

    getVm(wrapper).imageFile = new File(['png'], 'demo.png', {
      type: 'image/png',
    })
    await flushPromises()

    await wrapper.find('.resize-button').trigger('click')
    await flushPromises()
    expect(wrapper.find('.result-panel').exists()).toBe(true)
    getVm(wrapper).options.width = 320
    await flushPromises()

    expect(wrapper.find('.result-panel').exists()).toBe(false)
  })

  it('shows the algorithm size guard message', async () => {
    resizeImageMock.mockRejectedValue(new Error('OUTPUT_TOO_LARGE_FOR_ALGORITHM'))

    const wrapper = mount(ImageResizerView, mountOptions)

    getVm(wrapper).imageFile = new File(['png'], 'demo.png', {
      type: 'image/png',
    })
    await flushPromises()

    await wrapper.find('.resize-button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('selected algorithm')
  })
})
