import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import QRResult from './QRResult.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2 class="tool-section-header"><slot /></h2>',
})

const NAlertStub = defineComponent({
  name: 'NAlert',
  props: { title: { type: String, default: '' } },
  template: '<div class="n-alert"><slot /></div>',
})

const NFlexStub = defineComponent({
  name: 'NFlex',
  template: '<div class="n-flex"><slot /></div>',
})

const NCardStub = defineComponent({
  name: 'NCard',
  template: '<div class="n-card"><slot /></div>',
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span class="n-text"><slot /></span>',
})

const NTagStub = defineComponent({
  name: 'NTag',
  props: { type: { type: String, default: '' } },
  template: '<span class="n-tag" :data-type="type"><slot /></span>',
})

const NButtonStub = defineComponent({
  name: 'NButton',
  props: { href: { type: String, default: '' } },
  template: '<a class="n-button" :href="href"><slot /></a>',
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: { content: { type: String, default: '' } },
  template: '<button class="copy">copy</button>',
})

describe('QRResult', () => {
  it('renders an error alert when no result is available', () => {
    const wrapper = mount(QRResult, {
      props: {
        result: null,
        error: 'No QR code',
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NAlert: NAlertStub,
          NFlex: NFlexStub,
          NCard: NCardStub,
          NText: NTextStub,
          NTag: NTagStub,
          NButton: NButtonStub,
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.find('.n-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('No QR code')
  })

  it('identifies URL results and shows a link', () => {
    const wrapper = mount(QRResult, {
      props: {
        result: 'https://example.com',
        error: null,
      },
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NAlert: NAlertStub,
          NFlex: NFlexStub,
          NCard: NCardStub,
          NText: NTextStub,
          NTag: NTagStub,
          NButton: NButtonStub,
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const tag = wrapper.find('.n-tag')
    expect(tag.text()).toBe('URL')
    const link = wrapper.find('a.n-button')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })
})
