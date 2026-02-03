import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import QRContentTabs from './QRContentTabs.vue'
import type { WifiModel } from './content/WifiTab.vue'
import type { VcardModel } from './content/VcardTab.vue'
import type { SmsModel } from './content/SmsTab.vue'
import type { MailtoModel } from './content/MailtoTab.vue'
import type { GeoModel } from './content/GeoTab.vue'
import type { CalendarModel } from './content/CalendarTab.vue'

const widthRef = ref(1200)

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  return {
    ...actual,
    useWindowSize: () => ({ width: widthRef }),
  }
})

vi.mock('@vicons/fluent/TextDescription20Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Wifi224Filled', () => ({ default: {} }))
vi.mock('@vicons/fluent/ContactCard20Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Chat16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Mail16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/GlobeLocation20Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/CalendarLtr20Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Call16Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div class="n-alert"><slot /></div>',
    }),
    NDivider: defineComponent({
      name: 'NDivider',
      template: '<div class="n-divider" />',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: ['label', 'showFeedback'],
      template: '<div class="n-form-item"><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon"><slot /></span>',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options'],
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
    NTabPane: defineComponent({
      name: 'NTabPane',
      props: ['name'],
      template: '<div class="n-tab-pane"><slot /><slot name="tab" /></div>',
    }),
    NTabs: defineComponent({
      name: 'NTabs',
      props: ['value', 'type', 'animated'],
      emits: ['update:value'],
      template: '<div class="n-tabs"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

type QRContentTab = 'text' | 'wifi' | 'vcard' | 'sms' | 'tel' | 'mailto' | 'geo' | 'calendar'

type BaseModels = {
  activeTab: QRContentTab
  text: string
  wifi: WifiModel
  vcard: VcardModel
  sms: SmsModel
  tel: string
  mailto: MailtoModel
  geo: GeoModel
  calendar: CalendarModel
}

const baseModels: BaseModels = {
  activeTab: 'text',
  text: 'hello',
  wifi: { ssid: '', auth: 'WPA', password: '', hidden: false },
  vcard: {
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    url: '',
    address: '',
  },
  sms: { phone: '', message: '' },
  tel: '',
  mailto: { to: '', subject: '', body: '' },
  geo: { lat: null, lng: null, alt: null },
  calendar: { title: '', start: null, end: null, location: '', description: '' },
}

const stubs = {
  TextTab: { template: '<div class="text-tab" />' },
  WifiTab: { template: '<div class="wifi-tab" />' },
  VcardTab: { template: '<div class="vcard-tab" />' },
  SmsTab: { template: '<div class="sms-tab" />' },
  TelTab: { template: '<div class="tel-tab" />' },
  MailtoTab: { template: '<div class="mailto-tab" />' },
  GeoTab: { template: '<div class="geo-tab" />' },
  CalendarTab: { template: '<div class="calendar-tab" />' },
}

describe('QRContentTabs', () => {
  beforeEach(() => {
    widthRef.value = 1200
  })

  it('renders tab panes in wide layouts', () => {
    const wrapper = mount(QRContentTabs, {
      props: {
        payload: '',
        ...baseModels,
      },
      global: { stubs },
    })

    expect(wrapper.findAll('.n-tab-pane')).toHaveLength(8)
    expect(wrapper.find('.text-tab').exists()).toBe(true)
  })

  it('renders a select and payload preview in narrow layouts', () => {
    widthRef.value = 600

    const wrapper = mount(QRContentTabs, {
      props: {
        payload: 'sms:123',
        ...baseModels,
        activeTab: 'sms',
      },
      global: { stubs },
    })

    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(true)
    expect(wrapper.find('.sms-tab').exists()).toBe(true)
    expect(wrapper.find('.n-alert').exists()).toBe(true)
  })
})
