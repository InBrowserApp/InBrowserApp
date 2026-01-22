import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) => {
      const url = ref<string | null>(null)
      watchEffect(() => {
        let value: unknown = source
        if (isRef(source)) {
          value = source.value
        } else if (typeof source === 'function') {
          value = source()
        }
        url.value = value ? 'blob:mock' : null
      })
      return url
    },
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

import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NInputNumber, NMessageProvider } from 'naive-ui'
import DiceSimulatorView from './DiceSimulatorView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'

const Wrapper = {
  render() {
    return h(NMessageProvider, () => h(DiceSimulatorView))
  },
}

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
      ToolSection: {
        template: '<section><slot /></section>',
      },
      ToolSectionHeader: {
        template: '<h2><slot /></h2>',
      },
    },
  },
}

const createCanvasContext = () => ({
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  measureText: vi.fn((text: string) => ({ width: text.length * 7 })),
})

describe('DiceSimulator', () => {
  let originalCrypto: Crypto | undefined
  let originalClipboard: typeof navigator.clipboard | undefined
  let originalClipboardItem: typeof ClipboardItem | undefined
  let getContextSpy: ReturnType<typeof vi.spyOn> | null = null
  let toBlobSpy: ReturnType<typeof vi.spyOn> | null = null
  let messageWriteSpy: ReturnType<typeof vi.fn> | null = null

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    originalCrypto = global.crypto
    originalClipboard = navigator.clipboard
    originalClipboardItem = (
      globalThis as typeof globalThis & { ClipboardItem?: typeof ClipboardItem }
    ).ClipboardItem

    vi.stubGlobal('crypto', {
      getRandomValues: (buffer: Uint32Array) => {
        buffer[0] = 0
        return buffer
      },
      randomUUID: () => 'mock-id',
    })

    messageWriteSpy = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { write: messageWriteSpy },
      configurable: true,
    })
    ;(globalThis as typeof globalThis & { ClipboardItem?: typeof ClipboardItem }).ClipboardItem =
      class ClipboardItem {
        constructor(_data: Record<string, Blob>) {}
      }

    vi.stubGlobal(
      'ResizeObserver',
      class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(1000), 0)
    })
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => window.clearTimeout(handle))

    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(createCanvasContext() as unknown as CanvasRenderingContext2D)
    toBlobSpy = vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    })
  })

  afterEach(() => {
    if (originalCrypto) {
      global.crypto = originalCrypto
    }
    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      })
    } else {
      delete (navigator as { clipboard?: typeof navigator.clipboard }).clipboard
    }

    if (originalClipboardItem) {
      ;(globalThis as typeof globalThis & { ClipboardItem?: typeof ClipboardItem }).ClipboardItem =
        originalClipboardItem
    } else {
      delete (globalThis as typeof globalThis & { ClipboardItem?: typeof ClipboardItem })
        .ClipboardItem
    }

    vi.unstubAllGlobals()
    vi.useRealTimers()
    getContextSpy?.mockRestore()
    toBlobSpy?.mockRestore()
  })

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('dice-simulator')
    const route = routes[0]
    if (!route || !route.component) {
      throw new Error('Missing route definition')
    }
    expect(route.path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)

    const routeModule = await (route.component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('renders empty states and copy hint', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })

    const wrapper = mount(Wrapper, mountOptions)
    await flushPromises()

    expect(wrapper.find('[data-testid="results-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="history-empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Image copy is not supported')
  })

  it('rolls dice, updates results, and exports', async () => {
    localStorage.setItem('tools:dice-simulator:faces', '6')
    localStorage.setItem('tools:dice-simulator:count', '3')

    const wrapper = mount(Wrapper, mountOptions)
    await flushPromises()

    const rollButton = wrapper.find('[data-testid="roll-button"]')
    await rollButton.trigger('click')
    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const resultsArea = wrapper.find('[data-testid="results-text"]')
    expect(resultsArea.exists()).toBe(true)
    const resultsTextarea = resultsArea.find('textarea')
    expect(resultsTextarea.exists()).toBe(true)
    expect((resultsTextarea.element as HTMLTextAreaElement).value).toBe('1, 1, 1')

    expect(wrapper.find('[data-testid="total-value"]').text()).toBe('3')

    expect(wrapper.findAll('.history-card')).toHaveLength(1)

    const downloadText = wrapper.find('[data-testid="download-text"]')
    expect(downloadText.attributes('href')).toBe('blob:mock')

    const downloadStage = wrapper.find('[data-testid="download-stage"]')
    expect(downloadStage.attributes('href')).toBe('blob:mock')

    const downloadResultsImage = wrapper.find('[data-testid="download-results-image"]')
    expect(downloadResultsImage.attributes('href')).toBe('blob:mock')

    const copyStageButton = wrapper.find('[data-testid="copy-stage"]')
    await copyStageButton.trigger('click')
    expect(messageWriteSpy).toHaveBeenCalled()
  })

  it('applies history selection and clears history', async () => {
    localStorage.setItem('tools:dice-simulator:faces', '8')
    localStorage.setItem('tools:dice-simulator:count', '2')

    const wrapper = mount(Wrapper, mountOptions)
    await flushPromises()

    await wrapper.find('[data-testid="roll-button"]').trigger('click')
    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    const facesInput = inputNumbers.find((input) => input.props('min') === 2)
    const countInput = inputNumbers.find((input) => input.props('min') === 1)

    if (!facesInput || !countInput) {
      throw new Error('Expected input numbers were not found')
    }

    await facesInput.vm.$emit('update:value', 4)
    await countInput.vm.$emit('update:value', 5)
    await flushPromises()

    const useButton = wrapper.findAll('button').find((button) => button.text().trim() === 'Use')
    if (!useButton) {
      throw new Error('Use button not found')
    }
    await useButton.trigger('click')
    await flushPromises()

    const historyResults = wrapper.find('[data-testid="results-text"] textarea')
    expect(historyResults.exists()).toBe(true)
    expect((historyResults.element as HTMLTextAreaElement).value).toBe('1, 1')

    const clearButton = wrapper
      .findAll('button')
      .find((button) => button.text().trim() === 'Clear history')
    if (!clearButton) {
      throw new Error('Clear history button not found')
    }
    await clearButton.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="history-empty"]').exists()).toBe(true)
  })

  it('handles copy errors gracefully', async () => {
    localStorage.setItem('tools:dice-simulator:faces', '6')
    localStorage.setItem('tools:dice-simulator:count', '1')

    if (messageWriteSpy) {
      messageWriteSpy.mockRejectedValueOnce(new Error('copy failed'))
    }

    const wrapper = mount(Wrapper, mountOptions)
    await flushPromises()

    await wrapper.find('[data-testid="roll-button"]').trigger('click')
    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const copyButton = wrapper.find('[data-testid="copy-results-image"]')
    await copyButton.trigger('click')

    expect(messageWriteSpy).toHaveBeenCalled()
  })
})
