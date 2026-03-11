import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref('blob:workspace-image'),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  })

  return {
    NText,
  }
})

import { mount } from '@vue/test-utils'
import CropWorkspace from './CropWorkspace.vue'
import type { CropRect, ImageSource } from '../types'

const source: ImageSource = {
  file: new File(['image'], 'source.png', { type: 'image/png' }),
  width: 400,
  height: 200,
  mimeType: 'image/png',
  extension: 'png',
  hasAlpha: true,
}

const cropRect: CropRect = {
  x: 0.1,
  y: 0.1,
  width: 0.4,
  height: 0.4,
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function setStageBounds(element: Element, width = 200, height = 100) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height,
      toJSON: () => ({}),
    }),
  })
}

describe('CropWorkspace', () => {
  it('renders different handle sets for freeform and locked-ratio crops', () => {
    const freeWrapper = mount(CropWorkspace, {
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })
    expect(freeWrapper.findAll('.handle')).toHaveLength(8)

    const ratioWrapper = mount(CropWorkspace, {
      props: {
        source,
        cropRect,
        ratio: 1,
      },
    })
    expect(ratioWrapper.findAll('.handle')).toHaveLength(4)
  })

  it('emits keyboard-based crop moves in pixel increments', async () => {
    const wrapper = mount(CropWorkspace, {
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    await wrapper.get('.crop-rect').trigger('keydown', { key: 'ArrowDown', shiftKey: true })

    const emittedRect = wrapper.emitted('update:cropRect')?.[0]?.[0] as CropRect
    expect(emittedRect.x).toBeCloseTo(0.1)
    expect(emittedRect.y).toBeCloseTo(0.15)
    expect(emittedRect.width).toBeCloseTo(0.4)
    expect(emittedRect.height).toBeCloseTo(0.4)
  })

  it('supports horizontal keyboard nudging', async () => {
    const wrapper = mount(CropWorkspace, {
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    await wrapper.get('.crop-rect').trigger('keydown', { key: 'ArrowLeft' })

    const emittedRect = wrapper.emitted('update:cropRect')?.[0]?.[0] as CropRect
    expect(emittedRect.x).toBeCloseTo(0.0975)
    expect(emittedRect.y).toBeCloseTo(0.1)
  })

  it('ignores unsupported keyboard input', async () => {
    const wrapper = mount(CropWorkspace, {
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    await wrapper.get('.crop-rect').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:cropRect')).toBeUndefined()
  })

  it('ignores pointer moves until a drag starts and while bounds are zero-sized', async () => {
    const wrapper = mount(CropWorkspace, {
      attachTo: document.body,
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20 }))
    expect(wrapper.emitted('update:cropRect')).toBeUndefined()

    setStageBounds(wrapper.get('.stage').element, 0, 0)
    await wrapper.get('.crop-rect').trigger('pointerdown', { clientX: 10, clientY: 10 })
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 40 }))
    window.dispatchEvent(new PointerEvent('pointerup'))

    expect(wrapper.emitted('update:cropRect')).toBeUndefined()

    wrapper.unmount()
  })

  it('emits updated crop rectangles while dragging the crop box', async () => {
    const wrapper = mount(CropWorkspace, {
      attachTo: document.body,
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    setStageBounds(wrapper.get('.stage').element)

    await wrapper.get('.crop-rect').trigger('pointerdown', { clientX: 10, clientY: 10 })
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }))
    window.dispatchEvent(new PointerEvent('pointerup'))

    const emittedRect = wrapper.emitted('update:cropRect')?.[0]?.[0] as CropRect
    expect(emittedRect).toEqual({
      x: 0.2,
      y: 0.2,
      width: 0.4,
      height: 0.4,
    })

    wrapper.unmount()
  })

  it('emits updated crop rectangles while resizing from a handle', async () => {
    const wrapper = mount(CropWorkspace, {
      attachTo: document.body,
      props: {
        source,
        cropRect,
        ratio: null,
      },
    })

    setStageBounds(wrapper.get('.stage').element)

    await wrapper.get('.handle--se').trigger('pointerdown', { clientX: 10, clientY: 10 })
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }))
    window.dispatchEvent(new PointerEvent('pointerup'))

    const emittedRect = wrapper.emitted('update:cropRect')?.[0]?.[0] as CropRect
    expect(emittedRect).toEqual({
      x: 0.1,
      y: 0.1,
      width: 0.5,
      height: 0.5,
    })

    wrapper.unmount()
  })
})
