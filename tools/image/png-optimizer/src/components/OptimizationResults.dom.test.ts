import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import OptimizationResults from './OptimizationResults.vue'

const objectUrlState = vi.hoisted(() => ({
  downloadUrl: 'blob:download' as string | null,
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: (source: { value?: unknown }) => {
      // Read the source once so the computed callback path is covered.
      void source?.value
      return ref(objectUrlState.downloadUrl)
    },
  }
})

vi.mock('filesize', () => ({
  filesize: (value: number) => `size-${value}`,
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NStatistic = defineComponent({
    name: 'NStatistic',
    props: {
      value: {
        type: Number,
        default: undefined,
      },
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div><slot /><slot name="suffix" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      type: {
        type: String,
        default: '',
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
    template: '<a v-bind="$attrs"><slot name="icon" /><slot /></a>',
  })

  return {
    NFlex: makeStub('NFlex'),
    NGrid: makeStub('NGrid'),
    NGridItem: makeStub('NGridItem'),
    NIcon: makeStub('NIcon'),
    NStatistic,
    NButton,
  }
})

describe('OptimizationResults', () => {
  beforeEach(() => {
    objectUrlState.downloadUrl = 'blob:download'
  })

  it('computes compression ratio and download link', () => {
    const originalFile = new File(['data'], 'original.png', { type: 'image/png' })
    Object.defineProperty(originalFile, 'size', { value: 1000 })

    const optimizedFile = new Blob(['data'])
    Object.defineProperty(optimizedFile, 'size', { value: 600 })

    const wrapper = mount(OptimizationResults, {
      props: {
        originalFile,
        optimizedFile,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    const stats = wrapper.findAllComponents({ name: 'NStatistic' })
    expect(stats[0]?.props('value')).toBe(40)

    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('href')).toBe('blob:download')
    expect(button.props('download')).toBe('original.png')
    expect(button.props('disabled')).toBe(false)
  })

  it('disables download and clamps negative reductions', () => {
    objectUrlState.downloadUrl = null

    const originalFile = new File(['data'], 'original.png', { type: 'image/png' })
    Object.defineProperty(originalFile, 'size', { value: 1000 })

    const optimizedFile = new Blob(['data'])
    Object.defineProperty(optimizedFile, 'size', { value: 1200 })

    const wrapper = mount(OptimizationResults, {
      props: {
        originalFile,
        optimizedFile,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    const stats = wrapper.findAllComponents({ name: 'NStatistic' })
    expect(stats[0]?.props('value')).toBe(0)

    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('href')).toBeUndefined()
    expect(button.props('disabled')).toBe(true)
  })
})
