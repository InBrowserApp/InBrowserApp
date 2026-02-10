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

const globalStubs = {
  ToolSection: ToolSectionStub,
  ToolSectionHeader: ToolSectionHeaderStub,
  NAlert: NAlertStub,
  NFlex: NFlexStub,
  NCard: NCardStub,
  NText: NTextStub,
  NTag: NTagStub,
  NButton: NButtonStub,
  CopyToClipboardButton: CopyToClipboardButtonStub,
}

const mountResult = (props: { result: string | null; error: string | null }) =>
  mount(QRResult, {
    props,
    global: {
      stubs: globalStubs,
    },
  })

describe('QRResult', () => {
  it('renders an error alert when no result is available', () => {
    const wrapper = mountResult({ result: null, error: 'No QR code' })

    expect(wrapper.find('.n-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('No QR code')
  })

  it('identifies URL results and shows a link', () => {
    const wrapper = mountResult({ result: 'https://example.com', error: null })

    const tag = wrapper.find('.n-tag')
    expect(tag.text()).toBe('URL')
    const link = wrapper.find('a.n-button')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it.each([
    { result: 'mailto:test@example.com', label: 'Email', link: true },
    { result: 'tel:+1234567890', label: 'phone', link: true },
    { result: 'sms:+1234567890', label: 'SMS', link: true },
    { result: 'WIFI:S:MyNetwork;T:WPA;P:secret;;', label: 'WiFi', link: false },
    { result: 'BEGIN:VCARD\nFN:Jane Doe', label: 'vCard', link: false },
    { result: 'BEGIN:VCALENDAR\nSUMMARY:Event', label: 'calendar', link: false },
    { result: 'geo:37.7749,-122.4194', label: 'location', link: true },
    { result: 'Just some text', label: 'text', link: false },
  ])('labels %s correctly', ({ result, label, link }) => {
    const wrapper = mountResult({ result, error: null })

    expect(wrapper.find('.n-tag').text()).toBe(label)
    expect(wrapper.find('a.n-button').exists()).toBe(link)
  })
})
