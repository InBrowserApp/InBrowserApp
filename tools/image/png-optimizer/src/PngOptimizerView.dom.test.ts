import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PngOptimizerView from './PngOptimizerView.vue'

const optimizeMocks = vi.hoisted(() => ({
  optimizePNG: vi.fn(),
}))

const messageMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('@utils/image', () => ({
  optimizePNG: (...args: unknown[]) => optimizeMocks.optimizePNG(...args),
}))

vi.mock('naive-ui', () => ({
  useMessage: () => messageMocks,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const FileUploadStub = defineComponent({
  name: 'FileUpload',
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:file'],
  template: '<div data-testid="file-upload" />',
})

const OptimizationOptionsStub = defineComponent({
  name: 'OptimizationOptions',
  props: {
    options: {
      type: Object,
      required: true,
    },
    isOptimizing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:options', 'optimize'],
  template: '<button data-testid="optimize" @click="$emit(\'optimize\')" />',
})

const OptimizationResultsStub = defineComponent({
  name: 'OptimizationResults',
  props: {
    originalFile: {
      type: Object,
      required: true,
    },
    optimizedFile: {
      type: Object,
      required: true,
    },
  },
  template: '<div data-testid="results" />',
})

const ErrorDisplayStub = defineComponent({
  name: 'ErrorDisplay',
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  template: '<div data-testid="error-display">{{ error }}</div>',
})

const HowToOptimizePNGStub = defineComponent({
  name: 'HowToOptimizePNG',
  template: '<div data-testid="how-to" />',
})

describe('PngOptimizerView', () => {
  beforeEach(() => {
    optimizeMocks.optimizePNG.mockReset()
    messageMocks.success.mockReset()
    messageMocks.error.mockReset()
  })

  it('optimizes an image and shows results', async () => {
    optimizeMocks.optimizePNG.mockResolvedValueOnce(new Blob(['optimized']))

    const wrapper = mount(PngOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          FileUpload: FileUploadStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          ErrorDisplay: ErrorDisplayStub,
          HowToOptimizePNG: HowToOptimizePNGStub,
        },
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    await wrapper.findComponent(FileUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    expect(wrapper.findComponent(OptimizationOptionsStub).exists()).toBe(true)

    await wrapper.findComponent(OptimizationOptionsStub).vm.$emit('optimize')
    await flushPromises()

    expect(optimizeMocks.optimizePNG).toHaveBeenCalledTimes(1)
    const [passedFile, options] = optimizeMocks.optimizePNG.mock.calls[0] ?? []
    expect(passedFile).toMatchObject({ name: 'sample.png', type: 'image/png' })
    expect(options).toMatchObject({ level: 2, interlace: false, optimiseAlpha: true })

    expect(messageMocks.success).toHaveBeenCalledWith('optimizationComplete')
    expect(wrapper.find('[data-testid="results"]').exists()).toBe(true)
  })

  it('uses a fallback error message for non-Error rejections', async () => {
    optimizeMocks.optimizePNG.mockRejectedValueOnce('failed')

    const wrapper = mount(PngOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          FileUpload: FileUploadStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          ErrorDisplay: ErrorDisplayStub,
          HowToOptimizePNG: HowToOptimizePNGStub,
        },
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    await wrapper.findComponent(FileUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    await wrapper.findComponent(OptimizationOptionsStub).vm.$emit('optimize')
    await flushPromises()

    expect(messageMocks.error).toHaveBeenCalledWith('optimizationFailed')
    expect(wrapper.find('[data-testid="error-display"]').text()).toContain('optimizationFailed')
  })
  it('surfaces optimization errors and clears on new file', async () => {
    optimizeMocks.optimizePNG.mockRejectedValueOnce(new Error('boom'))

    const wrapper = mount(PngOptimizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          FileUpload: FileUploadStub,
          OptimizationOptions: OptimizationOptionsStub,
          OptimizationResults: OptimizationResultsStub,
          ErrorDisplay: ErrorDisplayStub,
          HowToOptimizePNG: HowToOptimizePNGStub,
        },
      },
    })

    const file = new File(['data'], 'sample.png', { type: 'image/png' })
    await wrapper.findComponent(FileUploadStub).vm.$emit('update:file', file)
    await flushPromises()

    await wrapper.findComponent(OptimizationOptionsStub).vm.$emit('optimize')
    await flushPromises()

    expect(messageMocks.error).toHaveBeenCalledWith('optimizationFailed')
    expect(wrapper.find('[data-testid="error-display"]').text()).toContain('boom')

    const nextFile = new File(['more'], 'next.png', { type: 'image/png' })
    await wrapper.findComponent(FileUploadStub).vm.$emit('update:file', nextFile)
    await flushPromises()

    expect(wrapper.find('[data-testid="error-display"]').text()).toBe('')
    expect(wrapper.find('[data-testid="results"]').exists()).toBe(false)
  })
})
