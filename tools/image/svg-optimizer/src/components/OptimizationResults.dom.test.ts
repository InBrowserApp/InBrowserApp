import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import OptimizationResults from './OptimizationResults.vue'

const objectUrlValue = ref<string | null>('blob:download')

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useObjectUrl: (source: { value: Blob | null }) => {
      // Access source so the computed blob path is exercised in tests.
      void source.value
      return objectUrlValue
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

vi.mock('@vicons/fluent/ArrowDownload24Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'DownloadIcon',
      template: '<svg class="download-icon" />',
    }),
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
      label: {
        type: String,
        default: '',
      },
      value: {
        type: String,
        default: '',
      },
    },
    template: '<div><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
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
    template: '<a><slot name="icon" /><slot /></a>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      type: {
        type: String,
        default: 'default',
      },
    },
    template: '<span><slot /></span>',
  })

  return {
    NGrid: makeStub('NGrid'),
    NGi: makeStub('NGi'),
    NSpace: makeStub('NSpace'),
    NIcon: makeStub('NIcon'),
    NStatistic,
    NButton,
    NText,
  }
})

describe('OptimizationResults', () => {
  it('computes sizes and download name', () => {
    objectUrlValue.value = 'blob:download'
    const wrapper = mount(OptimizationResults, {
      props: {
        originalSvg: '<svg><rect /></svg>',
        optimizedSvg: '<svg />',
        fileName: 'icon.svg',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          CopyToClipboardButton: {
            template: '<button class="copy-button"><slot /></button>',
            props: ['value', 'feedback', 'type'],
          },
        },
      },
    })

    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('href')).toBe('blob:download')
    expect(button.props('download')).toBe('icon.optimized.svg')
    expect(button.props('disabled')).toBe(false)

    const stats = wrapper.findAllComponents({ name: 'NStatistic' })
    expect(stats[0]?.props('value')).toContain('size-')
    expect(stats[1]?.props('value')).toContain('size-')
    expect(wrapper.findComponent({ name: 'NIcon' }).exists()).toBe(true)
  })

  it('renders zero saved percent and disables download when object url is missing', () => {
    objectUrlValue.value = null

    const wrapper = mount(OptimizationResults, {
      props: {
        originalSvg: '',
        optimizedSvg: '<svg />',
        fileName: 'icon',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          CopyToClipboardButton: {
            template: '<button class="copy-button"><slot /></button>',
            props: ['value', 'feedback', 'type'],
          },
        },
      },
    })

    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('disabled')).toBe(true)
    expect(button.props('href')).toBeUndefined()
    expect(button.props('download')).toBe('icon.optimized.svg')
    expect(wrapper.text()).toContain('0.0%')
  })
})
