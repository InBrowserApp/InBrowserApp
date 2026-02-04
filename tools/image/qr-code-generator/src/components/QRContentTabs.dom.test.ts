import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
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

const createStub = (name: string, className: string) =>
  defineComponent({
    name,
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `<div class="${className}" />`,
  })

const stubs = {
  TextTab: createStub('TextTab', 'text-tab'),
  WifiTab: createStub('WifiTab', 'wifi-tab'),
  VcardTab: createStub('VcardTab', 'vcard-tab'),
  SmsTab: createStub('SmsTab', 'sms-tab'),
  TelTab: createStub('TelTab', 'tel-tab'),
  MailtoTab: createStub('MailtoTab', 'mailto-tab'),
  GeoTab: createStub('GeoTab', 'geo-tab'),
  CalendarTab: createStub('CalendarTab', 'calendar-tab'),
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

  it('emits updates from wide tab models', async () => {
    const wrapper = mount(QRContentTabs, {
      props: {
        payload: '',
        ...baseModels,
      },
      global: { stubs },
    })

    const tabs = wrapper.findComponent({ name: 'NTabs' })
    tabs.vm.$emit('update:value', 'wifi')
    await nextTick()

    wrapper.findComponent({ name: 'TextTab' }).vm.$emit('update:modelValue', 'hello')
    wrapper.findComponent({ name: 'WifiTab' }).vm.$emit('update:modelValue', {
      ...baseModels.wifi,
      ssid: 'Net',
    })
    wrapper.findComponent({ name: 'VcardTab' }).vm.$emit('update:modelValue', {
      ...baseModels.vcard,
      firstName: 'Ada',
    })
    wrapper.findComponent({ name: 'SmsTab' }).vm.$emit('update:modelValue', {
      ...baseModels.sms,
      phone: '123',
    })
    wrapper.findComponent({ name: 'TelTab' }).vm.$emit('update:modelValue', '+1')
    wrapper.findComponent({ name: 'MailtoTab' }).vm.$emit('update:modelValue', {
      ...baseModels.mailto,
      to: 'user@example.com',
    })
    wrapper.findComponent({ name: 'GeoTab' }).vm.$emit('update:modelValue', {
      ...baseModels.geo,
      lat: 1,
      lng: 2,
    })
    wrapper.findComponent({ name: 'CalendarTab' }).vm.$emit('update:modelValue', {
      ...baseModels.calendar,
      title: 'Meet',
    })
    await nextTick()

    expect(wrapper.find('.text-tab').exists()).toBe(true)
    expect(wrapper.find('.wifi-tab').exists()).toBe(true)
    expect(wrapper.find('.vcard-tab').exists()).toBe(true)
    expect(wrapper.find('.sms-tab').exists()).toBe(true)
    expect(wrapper.find('.tel-tab').exists()).toBe(true)
    expect(wrapper.find('.mailto-tab').exists()).toBe(true)
    expect(wrapper.find('.geo-tab').exists()).toBe(true)
    expect(wrapper.find('.calendar-tab').exists()).toBe(true)
  })

  it('renders a select and payload preview in narrow layouts', async () => {
    const wrapper = mount(QRContentTabs, {
      props: {
        payload: 'sms:123',
        ...baseModels,
        activeTab: 'sms',
      },
      global: { stubs },
    })

    widthRef.value = 600
    await nextTick()

    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(true)
    expect(wrapper.find('.sms-tab').exists()).toBe(true)
    expect(wrapper.find('.n-alert').exists()).toBe(true)
  })

  it('switches narrow layout content panes', async () => {
    const onUpdateActiveTab = vi.fn()

    const wrapper = mount(QRContentTabs, {
      props: {
        payload: '',
        ...baseModels,
        activeTab: 'text',
        'onUpdate:activeTab': onUpdateActiveTab,
      },
      global: { stubs },
    })

    widthRef.value = 600
    await nextTick()

    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(true)

    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'wifi')
    await nextTick()
    expect(onUpdateActiveTab).toHaveBeenCalledWith('wifi')

    const tabCases: Record<
      QRContentTab,
      { selector: string; component: string; payload: unknown }
    > = {
      text: { selector: '.text-tab', component: 'TextTab', payload: 'next' },
      wifi: {
        selector: '.wifi-tab',
        component: 'WifiTab',
        payload: { ...baseModels.wifi, ssid: 'Cafe' },
      },
      vcard: {
        selector: '.vcard-tab',
        component: 'VcardTab',
        payload: { ...baseModels.vcard, firstName: 'Ada' },
      },
      sms: {
        selector: '.sms-tab',
        component: 'SmsTab',
        payload: { ...baseModels.sms, message: 'Hi' },
      },
      tel: { selector: '.tel-tab', component: 'TelTab', payload: '+123' },
      mailto: {
        selector: '.mailto-tab',
        component: 'MailtoTab',
        payload: { ...baseModels.mailto, to: 'user@example.com' },
      },
      geo: {
        selector: '.geo-tab',
        component: 'GeoTab',
        payload: { ...baseModels.geo, lat: 51.5, lng: -0.12 },
      },
      calendar: {
        selector: '.calendar-tab',
        component: 'CalendarTab',
        payload: { ...baseModels.calendar, title: 'Call' },
      },
    }

    for (const [tab, { selector, component, payload }] of Object.entries(tabCases)) {
      await wrapper.setProps({ activeTab: tab as QRContentTab })
      await nextTick()
      expect(wrapper.find(selector).exists()).toBe(true)

      const tabComponent = wrapper.findComponent({ name: component })
      tabComponent.vm.$emit('update:modelValue', payload)
      await nextTick()
    }
  })
})
