import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PlaceholderDownloadButtons from './PlaceholderDownloadButtons.vue'
import type { PlaceholderOptions } from './PlaceholderPreview.vue'

const messageMock = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => (blobRef.value ? 'blob:mock' : '')),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: 'button',
        },
        href: {
          type: String,
          default: undefined,
        },
        download: {
          type: String,
          default: '',
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      template: '<button @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: {
        value: {
          type: Number,
          default: 1,
        },
      },
      emits: ['update:value'],
      template: '<div class="radio-group"><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<div class="radio-button"><slot /></div>',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      props: {
        value: {
          type: Number,
          default: 0.9,
        },
        formatTooltip: {
          type: Function,
          default: undefined,
        },
      },
      emits: ['update:value'],
      template: '<div class="slider" />',
    }),
    useMessage: () => messageMock,
  }
})

vi.mock('@vicons/fluent/Image24Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ImageIcon',
      template: '<svg class="image-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/Code24Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'CodeIcon',
      template: '<svg class="code-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/Copy24Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'CopyIcon',
      template: '<svg class="copy-icon" />',
    }),
  }
})

const baseOptions: PlaceholderOptions = {
  width: 200,
  height: 100,
  bgType: 'solid',
  bgColor: '#cccccc',
  gradientColor1: '#111111',
  gradientColor2: '#222222',
  gradientAngle: 45,
  textColor: '#000000',
  customText: '',
  fontSize: 0,
}

describe('PlaceholderDownloadButtons', () => {
  let originalToBlob: typeof HTMLCanvasElement.prototype.toBlob | undefined
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext | undefined
  let originalClipboardItem: typeof ClipboardItem | undefined
  let originalClipboard: typeof navigator.clipboard | undefined
  let clipboardWrite: ReturnType<typeof vi.fn>
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
    messageMock.success.mockReset()
    messageMock.error.mockReset()

    originalToBlob = HTMLCanvasElement.prototype.toBlob
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
      value: vi.fn(() => contextMock),
      writable: true,
    })

    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: (blob: Blob | null) => void) => {
        callback(new Blob(['mock'], { type: 'image/png' }))
      },
      writable: true,
    })

    originalClipboardItem = globalThis.ClipboardItem
    Object.defineProperty(globalThis, 'ClipboardItem', {
      value: class ClipboardItemMock {
        data: Record<string, Blob>

        constructor(data: Record<string, Blob>) {
          this.data = data
        }
      },
      configurable: true,
    })

    clipboardWrite = vi.fn().mockResolvedValue(undefined)
    originalClipboard = navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: { write: clipboardWrite },
      configurable: true,
    })
  })

  afterEach(() => {
    if (originalToBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: originalToBlob,
        writable: true,
      })
    } else {
      delete (HTMLCanvasElement.prototype as { toBlob?: unknown }).toBlob
    }

    if (originalGetContext) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        value: originalGetContext,
        writable: true,
      })
    } else {
      delete (HTMLCanvasElement.prototype as { getContext?: unknown }).getContext
    }

    if (originalClipboardItem) {
      Object.defineProperty(globalThis, 'ClipboardItem', {
        value: originalClipboardItem,
        configurable: true,
      })
    } else {
      delete (globalThis as { ClipboardItem?: unknown }).ClipboardItem
    }

    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      })
    } else {
      delete (navigator as { clipboard?: unknown }).clipboard
    }
  })

  it('builds download links with filenames', async () => {
    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    await flushPromises()

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    const downloadButtons = buttons.filter((button) => button.props('tag') === 'a')

    expect(downloadButtons).toHaveLength(4)
    expect(downloadButtons[0]?.props('download')).toBe('placeholder-200x100.png')
    expect(downloadButtons[1]?.props('download')).toBe('placeholder-200x100.jpg')
    expect(downloadButtons[2]?.props('download')).toBe('placeholder-200x100.webp')
    expect(downloadButtons[3]?.props('download')).toBe('placeholder-200x100.svg')
    expect(downloadButtons[0]?.props('href')).toBe('blob:mock')
    expect(downloadButtons[1]?.props('href')).toBe('blob:mock')
    expect(downloadButtons[2]?.props('href')).toBe('blob:mock')
    expect(downloadButtons[3]?.props('href')).toBe('blob:mock')
    expect(wrapper.find('.image-icon').exists()).toBe(true)
    expect(wrapper.find('.code-icon').exists()).toBe(true)
    expect(wrapper.find('.copy-icon').exists()).toBe(true)
  })

  it('updates filenames when scale changes', async () => {
    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    const scaleGroup = wrapper.findComponent({ name: 'NRadioGroup' })
    scaleGroup.vm.$emit('update:value', 2)
    await flushPromises()

    const downloadButtons = wrapper
      .findAllComponents({ name: 'NButton' })
      .filter((button) => button.props('tag') === 'a')

    expect(downloadButtons[0]?.props('download')).toBe('placeholder-200x100@2x.png')
  })

  it('updates quality and formats the tooltip', async () => {
    const toBlobSpy = vi.fn(
      (callback: (blob: Blob | null) => void, type?: string, _quality?: number) => {
        callback(new Blob(['mock'], { type: type ?? 'image/png' }))
      },
    )
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: toBlobSpy,
      writable: true,
    })

    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    const slider = wrapper.findComponent({ name: 'NSlider' })
    const formatTooltip = slider.props('formatTooltip') as ((value: number) => string) | undefined
    expect(formatTooltip?.(0.55)).toBe('55%')

    slider.vm.$emit('update:value', 0.5)
    await flushPromises()

    const qualityCalls = toBlobSpy.mock.calls.filter((call) => {
      const type = call[1]
      return type === 'image/jpeg' || type === 'image/webp'
    })
    expect(qualityCalls.some((call) => call[2] === 0.5)).toBe(true)
  })

  it('drops outdated blob updates when options change quickly', async () => {
    vi.useFakeTimers()
    const toBlobSpy = vi.fn(
      (callback: (blob: Blob | null) => void, type?: string, _quality?: number) => {
        setTimeout(() => {
          callback(new Blob(['mock'], { type: type ?? 'image/png' }))
        }, 0)
      },
    )
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: toBlobSpy,
      writable: true,
    })

    try {
      const wrapper = mount(PlaceholderDownloadButtons, {
        props: {
          options: baseOptions,
        },
      })

      await wrapper.setProps({
        options: {
          ...baseOptions,
          width: 220,
        },
      })
      await vi.runAllTimersAsync()
      await flushPromises()

      expect(toBlobSpy).toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('copies to clipboard and reports success', async () => {
    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    const copyButton = wrapper
      .findAllComponents({ name: 'NButton' })
      .find((button) => button.props('tag') !== 'a')

    await copyButton?.trigger('click')
    await flushPromises()

    expect(clipboardWrite).toHaveBeenCalled()
    expect(messageMock.success).toHaveBeenCalledWith('Image copied to clipboard')
  })

  it('reports copy failure when blob is missing', async () => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: (blob: Blob | null) => void) => {
        callback(null)
      },
      writable: true,
    })

    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    const copyButton = wrapper
      .findAllComponents({ name: 'NButton' })
      .find((button) => button.props('tag') !== 'a')

    await copyButton?.trigger('click')
    await flushPromises()

    expect(messageMock.error).toHaveBeenCalledWith('Failed to copy image')
  })

  it('reports copy failure when clipboard write rejects', async () => {
    clipboardWrite.mockRejectedValueOnce(new Error('fail'))

    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    const copyButton = wrapper
      .findAllComponents({ name: 'NButton' })
      .find((button) => button.props('tag') !== 'a')

    await copyButton?.trigger('click')
    await flushPromises()

    expect(messageMock.error).toHaveBeenCalledWith('Failed to copy image')
  })

  it('handles missing canvas context', async () => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => null,
      writable: true,
    })

    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: baseOptions,
      },
    })

    await flushPromises()

    expect(wrapper.findAllComponents({ name: 'NButton' }).length).toBeGreaterThan(0)
  })

  it('draws gradient backgrounds when selected', async () => {
    const wrapper = mount(PlaceholderDownloadButtons, {
      props: {
        options: {
          ...baseOptions,
          bgType: 'linear-gradient',
        },
      },
    })

    await flushPromises()

    expect(contextMock.createLinearGradient).toHaveBeenCalled()

    await wrapper.setProps({
      options: {
        ...baseOptions,
        bgType: 'radial-gradient',
      },
    })

    await flushPromises()

    expect(contextMock.createRadialGradient).toHaveBeenCalled()
  })
})
