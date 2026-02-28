import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import EncryptResult from './EncryptResult.vue'

let urlIndex = 0
const urls = ['blob:binary', 'blob:base64', 'blob:hex', 'blob:jwe']

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (source?: { value?: unknown }) => {
    if (source && typeof source === 'object' && 'value' in source) {
      void source.value
    }
    return ref(urls[urlIndex++] ?? 'blob:url')
  },
}))

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
    props: ['content', 'size'],
    template: '<button class="copy" />',
  },
}))

vi.mock('@vicons/fluent/ArrowDownload16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ArrowDownloadIcon',
      template: '<svg class="arrow-download" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NAlert = defineComponent({
    name: 'NAlert',
    props: ['type', 'title'],
    template: '<div class="n-alert"><slot /></div>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: ['value'],
    template: '<textarea class="n-input" :value="value" />',
  })
  const NButton = defineComponent({
    name: 'NButton',
    props: ['tag', 'download', 'disabled', 'href', 'text'],
    template:
      '<button class="n-button" :data-tag="tag" :data-download="download" :data-disabled="disabled" :data-href="href"><slot name="icon" /><slot /></button>',
  })
  const NPopover = defineComponent({
    name: 'NPopover',
    template: '<div class="n-popover"><slot name="trigger" /><slot /></div>',
  })
  return {
    NSpace: Base,
    NAlert,
    NInput,
    NButton,
    NIcon: Base,
    NPopover,
    NFlex: Base,
    NCollapse: Base,
    NCollapseItem: Base,
    NDescriptions: Base,
    NDescriptionsItem: Base,
  }
})

describe('EncryptResult', () => {
  beforeEach(() => {
    urlIndex = 0
  })

  it('renders an error alert', () => {
    const wrapper = mount(EncryptResult, {
      props: {
        result: '',
        error: 'boom',
        salt: '',
        iv: '',
        binary: null,
        outputMode: 'jwe',
        outputFormat: 'base64',
      },
    })

    expect(wrapper.find('.n-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('boom')
  })

  it('renders raw download links and parameter details', () => {
    const wrapper = mount(EncryptResult, {
      props: {
        result: 'deadbeef',
        error: '',
        salt: 'aa',
        iv: 'bb',
        binary: new ArrayBuffer(1),
        outputMode: 'raw',
        outputFormat: 'hex',
      },
    })

    const downloadLinks = wrapper.findAll('[data-download]')
    expect(downloadLinks).toHaveLength(3)
    expect(wrapper.text()).toContain('aa')
    expect(wrapper.text()).toContain('bb')
  })

  it('renders base64 and hex links when binary output is missing', () => {
    const wrapper = mount(EncryptResult, {
      props: {
        result: 'AQID',
        error: '',
        salt: '',
        iv: '',
        binary: null,
        outputMode: 'raw',
        outputFormat: 'base64',
      },
    })

    const downloadLinks = wrapper.findAll('[data-download]')
    expect(downloadLinks).toHaveLength(2)
    expect(wrapper.text()).toContain('Base64')
    expect(wrapper.text()).toContain('Hex')
  })

  it('renders a single JWE download link', () => {
    const wrapper = mount(EncryptResult, {
      props: {
        result: 'token',
        error: '',
        salt: '',
        iv: '',
        binary: null,
        outputMode: 'jwe',
        outputFormat: 'base64',
      },
    })

    const downloadLinks = wrapper.findAll('[data-download]')
    expect(downloadLinks).toHaveLength(1)
    expect(downloadLinks[0]?.attributes('data-download')).toBe('encrypted.jwe')
  })

  it('evaluates JWE-only computed exports as empty text payloads', () => {
    const wrapper = mount(EncryptResult, {
      props: {
        result: 'token',
        error: '',
        salt: '',
        iv: '',
        binary: null,
        outputMode: 'jwe',
        outputFormat: 'hex',
      },
    })

    const vm = wrapper.vm as unknown as {
      $?: {
        setupState?: {
          base64Content: string
          hexContent: string
        }
      }
    }

    expect(vm.$?.setupState?.base64Content).toBe('')
    expect(vm.$?.setupState?.hexContent).toBe('')
  })
})
