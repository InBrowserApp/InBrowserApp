import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceholderPreview from './PlaceholderPreview.vue'

vi.mock('@vueuse/core', () => ({
  useDebounce: <T>(value: T) => value,
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
  }
})

const baseProps = {
  width: 200,
  height: 100,
  bgType: 'solid' as const,
  bgColor: '#cccccc',
  gradientColor1: '#111111',
  gradientColor2: '#222222',
  gradientAngle: 45,
  textColor: '#000000',
  customText: '',
  fontSize: 0,
}

describe('PlaceholderPreview', () => {
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext | undefined

  beforeEach(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => ({
        fillStyle: '',
        font: '',
        textAlign: 'center',
        textBaseline: 'middle',
        fillRect: vi.fn(),
        fillText: vi.fn(),
        createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      }),
      writable: true,
    })
  })

  afterEach(() => {
    if (originalGetContext) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: originalGetContext,
        writable: true,
      })
    } else {
      delete (HTMLCanvasElement.prototype as { getContext?: unknown }).getContext
    }
  })

  it('renders an SVG data URI and exposes options', () => {
    const wrapper = mount(PlaceholderPreview, {
      props: baseProps,
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('data:image/svg+xml')

    const vm = wrapper.vm as unknown as {
      getOptions: () => typeof baseProps
    }

    expect(vm.getOptions().width).toBe(200)
    expect(vm.getOptions().height).toBe(100)
  })

  it('generates SVG with escaped text and gradients', async () => {
    const wrapper = mount(PlaceholderPreview, {
      props: {
        ...baseProps,
        bgType: 'linear-gradient',
        customText: '<hello & "world">',
      },
    })

    const vm = wrapper.vm as unknown as { generateSVG: (scale?: number) => string }
    const svg = vm.generateSVG(2)

    expect(svg).toContain('<linearGradient')
    expect(svg).toContain('width="400"')
    expect(svg).toContain('&lt;hello &amp; &quot;world&quot;&gt;')

    await wrapper.setProps({ bgType: 'radial-gradient' })
    const radialSvg = vm.generateSVG()
    expect(radialSvg).toContain('<radialGradient')
  })

  it('draws to canvas with scaling', () => {
    const wrapper = mount(PlaceholderPreview, {
      props: {
        ...baseProps,
        customText: 'Custom',
      },
    })

    const vm = wrapper.vm as unknown as {
      drawToCanvas: (canvas: HTMLCanvasElement, scale?: number) => void
    }
    const canvas = document.createElement('canvas')

    vm.drawToCanvas(canvas, 2)

    expect(canvas.width).toBe(400)
    expect(canvas.height).toBe(200)
  })
})
