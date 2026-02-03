import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DecryptResult from './DecryptResult.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy-button" :data-content="content">Copy</button>',
  },
}))

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (value: Blob | null) => ref(value ? `blob:${value.type}` : null),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NAlert = defineComponent({
    name: 'NAlert',
    template: '<div class="n-alert"><slot /></div>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    template: '<textarea class="n-input" />',
  })
  const NButton = defineComponent({
    name: 'NButton',
    props: {
      download: {
        type: String,
        default: undefined,
      },
      href: {
        type: String,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    template:
      '<button class="n-button" :data-download="download" :data-href="href" :data-disabled="disabled"><slot /></button>',
  })
  const NPopover = defineComponent({
    name: 'NPopover',
    template: '<div class="n-popover"><slot name="trigger" /><slot /></div>',
  })
  const NTabs = defineComponent({
    name: 'NTabs',
    template: '<div class="n-tabs"><slot /></div>',
  })
  const NTabPane = defineComponent({
    name: 'NTabPane',
    template: '<div class="n-tab-pane"><slot /></div>',
  })
  return {
    NSpace: Base,
    NAlert,
    NInput,
    NButton,
    NIcon: Base,
    NPopover,
    NFlex: Base,
    NTabs,
    NTabPane,
  }
})

vi.mock('@vicons/fluent/ArrowDownload16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ArrowDownloadIcon',
      template: '<svg class="download-icon" />',
    }),
  }
})

describe('DecryptResult', () => {
  it('shows an error alert when provided', () => {
    const wrapper = mount(DecryptResult, {
      props: {
        result: '',
        resultHex: '',
        resultBinary: null,
        error: 'boom',
      },
    })

    expect(wrapper.find('.n-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('boom')
  })

  it('renders download links for text and binary output', () => {
    const wrapper = mount(DecryptResult, {
      props: {
        result: 'hello',
        resultHex: '6869',
        resultBinary: new ArrayBuffer(2),
        error: '',
      },
    })

    const copyButton = wrapper.find('.copy-button')
    expect(copyButton.attributes('data-content')).toBe('hello')

    const downloadButtons = wrapper
      .findAll('button[data-download]')
      .filter((button) => button.attributes('data-download'))

    const downloads = downloadButtons.map((button) => button.attributes('data-download'))

    expect(downloads).toContain('decrypted.txt')
    expect(downloads).toContain('decrypted.bin')
  })
})
