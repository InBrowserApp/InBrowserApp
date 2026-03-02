import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NButton } from 'naive-ui'
import ColorPickerImageSection from './ColorPickerImageSection.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ColorPickerImageSection', () => {
  it('emits picker and file events', async () => {
    const wrapper = mount(ColorPickerImageSection, {
      attachTo: document.body,
      props: {
        imageError: null,
        hasImage: true,
        canvasStyle: {},
        dropOverlayActive: false,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
        },
      },
    })

    await wrapper.findComponent(NButton).trigger('click')
    expect(wrapper.emitted('pick-image')).toHaveLength(1)

    await wrapper.find('input[type="file"]').trigger('change')
    expect(wrapper.emitted('file-change')).toHaveLength(1)

    await wrapper.find('canvas').trigger('click')
    expect(wrapper.emitted('canvas-click')).toHaveLength(1)

    const fileInputReadyPayloads = wrapper.emitted('file-input-ready') ?? []
    expect(fileInputReadyPayloads.some(([value]) => value instanceof HTMLInputElement)).toBe(true)

    const canvasReadyPayloads = wrapper.emitted('canvas-ready') ?? []
    expect(canvasReadyPayloads.some(([value]) => value instanceof HTMLCanvasElement)).toBe(true)

    const wrapperReadyPayloads = wrapper.emitted('wrapper-ready') ?? []
    expect(wrapperReadyPayloads.some(([value]) => value instanceof HTMLDivElement)).toBe(true)
  })

  it('renders error and active drop overlay states', async () => {
    const wrapper = mount(ColorPickerImageSection, {
      attachTo: document.body,
      props: {
        imageError: 'image-error',
        hasImage: false,
        canvasStyle: {},
        dropOverlayActive: true,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
        },
      },
    })

    expect(wrapper.text()).toContain('image-error')
    expect(document.body.querySelector('.drop-overlay--active')).toBeTruthy()
  })
})
