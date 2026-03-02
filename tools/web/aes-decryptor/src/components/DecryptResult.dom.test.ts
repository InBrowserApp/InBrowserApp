import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import DecryptResult from './DecryptResult.vue'
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
const createObjectUrlRef = (value: unknown) => {
  const resolved =
    value && typeof value === 'object' && 'value' in value
      ? (
          value as {
            value: Blob | null
          }
        ).value
      : (value as Blob | null)
  return ref(resolved ? `blob:${resolved.type}` : null)
}
const useObjectUrlMock = vi.fn(createObjectUrlRef)
vi.mock('@vueuse/core', () => ({
  useObjectUrl: (...args: [unknown]) => useObjectUrlMock(...args),
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
      '<button class="n-button" :data-download="download" :data-href="href" :data-disabled="disabled"><slot name="icon" /><slot /></button>',
  })
  const NPopover = defineComponent({
    name: 'NPopover',
    template: '<div class="n-popover"><slot name="trigger" /><slot /></div>',
  })
  const NTabs = defineComponent({
    name: 'NTabs',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div class="n-tabs"><slot /></div>',
  })
  const NTabPane = defineComponent({
    name: 'NTabPane',
    template: '<div class="n-tab-pane"><slot /></div>',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NSpace: Base,
    NAlert,
    NInput,
    NButton,
    NIcon: Base,
    NPopover,
    NTabs,
    NTabPane,
  }
})
describe('DecryptResult', () => {
  beforeEach(() => {
    useObjectUrlMock.mockReset()
    useObjectUrlMock.mockImplementation(createObjectUrlRef)
  })
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
  it('switches copy content when changing tabs', async () => {
    const wrapper = mount(DecryptResult, {
      props: {
        result: 'hello',
        resultHex: '6869',
        resultBinary: null,
        error: '',
      },
    })
    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'hex')
    await nextTick()
    const copyButton = wrapper.find('.copy-button')
    expect(copyButton.attributes('data-content')).toBe('6869')
  })
  it('renders only text download when binary output is missing', () => {
    const wrapper = mount(DecryptResult, {
      props: {
        result: 'hello',
        resultHex: '6869',
        resultBinary: null,
        error: '',
      },
    })
    const downloadButtons = wrapper
      .findAll('button[data-download]')
      .filter((button) => button.attributes('data-download'))
    const downloads = downloadButtons.map((button) => button.attributes('data-download'))
    expect(downloads).toEqual(['decrypted.txt'])
  })
  it('falls back to undefined href when object URLs are unavailable', () => {
    useObjectUrlMock.mockImplementationOnce(() => ref(null)).mockImplementationOnce(() => ref(null))
    const wrapper = mount(DecryptResult, {
      props: {
        result: 'hello',
        resultHex: '6869',
        resultBinary: new ArrayBuffer(2),
        error: '',
      },
    })
    const downloadButtons = wrapper
      .findAll('button[data-download]')
      .filter((button) => button.attributes('data-download'))
    const textButton = downloadButtons.find(
      (button) => button.attributes('data-download') === 'decrypted.txt',
    )
    expect(textButton?.attributes('data-href')).toBeUndefined()
    expect(textButton?.attributes('data-disabled')).toBe('true')
  })
})
