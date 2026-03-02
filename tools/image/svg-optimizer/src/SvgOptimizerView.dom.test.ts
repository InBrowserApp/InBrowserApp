import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import SvgOptimizerView from './SvgOptimizerView.vue'
import { optimize } from 'svgo/browser'

const messageSuccess = vi.fn()
const messageError = vi.fn()

vi.mock('svgo/browser', () => ({
  optimize: vi.fn(),
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      success: messageSuccess,
      error: messageError,
    }),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watch } = await import('vue')
  return {
    ...actual,
    useStorage: (_key: string, defaultValue: unknown) => ref(defaultValue),
    watchDebounced: (source: unknown, cb: () => void, options?: Record<string, unknown>) =>
      watch(source as never, cb, options),
  }
})

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  template: '<div class="layout"><slot /></div>',
})

const SvgInputStub = defineComponent({
  name: 'SvgInput',
  emits: ['update:svgString', 'update:fileName'],
  template: '<div class="svg-input" />',
})

const OptimizationOptionsStub = defineComponent({
  name: 'OptimizationOptions',
  emits: ['update:options'],
  template: '<div class="options" />',
})

const OptimizationResultsStub = defineComponent({
  name: 'OptimizationResults',
  props: {
    optimizedSvg: {
      type: String,
      default: '',
    },
  },
  template: '<div class="results" />',
})

const WhatIsSvgOptimizerStub = defineComponent({
  name: 'WhatIsSvgOptimizer',
  template: '<div class="what-is" />',
})

const defaultOptions = {
  multipass: true,
  removeComments: true,
  removeMetadata: true,
  cleanupIds: true,
  convertColors: true,
  removeDimensions: true,
  inlineStyles: false,
}

describe('SvgOptimizerView', () => {
  const optimizeMock = vi.mocked(optimize)

  beforeEach(() => {
    optimizeMock.mockReset()
    messageSuccess.mockReset()
    messageError.mockReset()
  })

  it('optimizes SVG input and shows results', async () => {
    optimizeMock.mockReturnValue({ data: '<svg optimized />' })

    const wrapper = mount(SvgOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          SvgInput: SvgInputStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          WhatIsSvgOptimizer: WhatIsSvgOptimizerStub,
        },
      },
    })

    const input = wrapper.findComponent(SvgInputStub)
    input.vm.$emit('update:svgString', '<svg></svg>')
    input.vm.$emit('update:fileName', 'icon.svg')
    await flushPromises()

    const optionsPanel = wrapper.findComponent(OptimizationOptionsStub)
    optionsPanel.vm.$emit('update:options', defaultOptions)
    await flushPromises()

    expect(optimizeMock).toHaveBeenCalled()
    const hasRemoveDimensions = optimizeMock.mock.calls.some(([, config]) => {
      const plugins = (config as { plugins?: Array<{ name?: string }> }).plugins ?? []
      return plugins.some((plugin) => plugin.name === 'removeDimensions')
    })
    expect(hasRemoveDimensions).toBe(true)
    expect(messageSuccess).toHaveBeenCalledWith('SVG optimized successfully!')
    expect(wrapper.find('.results').exists()).toBe(true)
  })

  it('clears optimized output when SVG input is removed', async () => {
    optimizeMock.mockReturnValue({ data: '<svg optimized />' })

    const wrapper = mount(SvgOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          SvgInput: SvgInputStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          WhatIsSvgOptimizer: WhatIsSvgOptimizerStub,
        },
      },
    })

    const input = wrapper.findComponent(SvgInputStub)
    input.vm.$emit('update:svgString', '<svg></svg>')
    await flushPromises()
    expect(wrapper.find('.results').exists()).toBe(true)

    input.vm.$emit('update:svgString', '')
    await flushPromises()
    expect(wrapper.find('.results').exists()).toBe(false)
  })

  it('returns early when optimizeSvg runs without input', async () => {
    const wrapper = mount(SvgOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          SvgInput: SvgInputStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          WhatIsSvgOptimizer: WhatIsSvgOptimizerStub,
        },
      },
    })

    const setupState = (
      wrapper.vm as unknown as {
        $: { setupState: { optimizeSvg?: () => Promise<void> } }
      }
    ).$.setupState
    expect(typeof setupState.optimizeSvg).toBe('function')

    await setupState.optimizeSvg?.()

    expect(optimizeMock).not.toHaveBeenCalled()
    expect(messageSuccess).not.toHaveBeenCalled()
    expect(messageError).not.toHaveBeenCalled()
  })

  it('handles optimization errors', async () => {
    optimizeMock.mockImplementationOnce(() => {
      throw new Error('fail')
    })

    const wrapper = mount(SvgOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          SvgInput: SvgInputStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          WhatIsSvgOptimizer: WhatIsSvgOptimizerStub,
        },
      },
    })

    const input = wrapper.findComponent(SvgInputStub)
    input.vm.$emit('update:svgString', '<svg></svg>')
    await flushPromises()

    expect(messageError).toHaveBeenCalledWith('Failed to optimize SVG')
    expect(wrapper.find('.results').exists()).toBe(false)
  })
})
