import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceholderPreview from './PlaceholderPreview.vue'
vi.mock('@vueuse/core', () => ({
  useDebounce: <T>(value: T) => value,
}))
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
  let contextMock: {
    fillStyle: string
    font: string
    textAlign: string
    textBaseline: string
    fillRect: ReturnType<typeof vi.fn>
    fillText: ReturnType<typeof vi.fn>
    createLinearGradient: ReturnType<typeof vi.fn>
    createRadialGradient: ReturnType<typeof vi.fn>
  }
  beforeEach(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext
    contextMock = {
      fillStyle: '',
      font: '',
      textAlign: 'center',
      textBaseline: 'middle',
      fillRect: vi.fn(),
      fillText: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    }
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => contextMock,
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
      delete (
        HTMLCanvasElement.prototype as {
          getContext?: unknown
        }
      ).getContext
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
    const vm = wrapper.vm as unknown as {
      generateSVG: (scale?: number) => string
    }
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
  it('draws gradient backgrounds to canvas', async () => {
    const wrapper = mount(PlaceholderPreview, {
      props: {
        ...baseProps,
        bgType: 'linear-gradient',
      },
    })
    const vm = wrapper.vm as unknown as {
      drawToCanvas: (canvas: HTMLCanvasElement, scale?: number) => void
    }
    const canvas = document.createElement('canvas')
    vm.drawToCanvas(canvas)
    expect(contextMock.createLinearGradient).toHaveBeenCalled()
    await wrapper.setProps({ bgType: 'radial-gradient' })
    vm.drawToCanvas(canvas)
    expect(contextMock.createRadialGradient).toHaveBeenCalled()
  })
  it('returns early when canvas context is missing', () => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => null,
      writable: true,
    })
    const wrapper = mount(PlaceholderPreview, {
      props: baseProps,
    })
    const vm = wrapper.vm as unknown as {
      drawToCanvas: (canvas: HTMLCanvasElement, scale?: number) => void
    }
    const canvas = document.createElement('canvas')
    expect(() => vm.drawToCanvas(canvas)).not.toThrow()
  })
})
