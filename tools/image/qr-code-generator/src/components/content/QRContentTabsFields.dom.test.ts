import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextTab from './TextTab.vue'
import WifiTab from './WifiTab.vue'
import VcardTab from './VcardTab.vue'
import SmsTab from './SmsTab.vue'
import TelTab from './TelTab.vue'
import MailtoTab from './MailtoTab.vue'
import GeoTab from './GeoTab.vue'
import CalendarTab from './CalendarTab.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItem: defineComponent({
      name: 'NFormItem',
      props: ['label', 'showFeedback'],
      template: '<div class="n-form-item"><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label', 'showFeedback'],
      template: '<div class="n-form-item-gi"><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value', 'placeholder', 'type', 'autosize'],
      emits: ['update:value'],
      template: '<input class="n-input" />',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value', 'precision', 'step', 'placeholder'],
      emits: ['update:value'],
      template: '<input class="n-input-number" />',
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options'],
      emits: ['update:value'],
      template: '<div class="n-select" />',
    }),
    NSwitch: defineComponent({
      name: 'NSwitch',
      props: ['value'],
      emits: ['update:value'],
      template: '<div class="n-switch" />',
    }),
    NDatePicker: defineComponent({
      name: 'NDatePicker',
      props: ['value', 'type'],
      emits: ['update:value'],
      template: '<div class="n-date-picker" />',
    }),
  }
})

describe('QR content tabs', () => {
  it('renders the text tab input', () => {
    const wrapper = mount(TextTab, {
      props: { modelValue: 'hello' },
    })

    expect(wrapper.findComponent({ name: 'NInput' }).exists()).toBe(true)
  })

  it('renders WiFi options', () => {
    const wrapper = mount(WifiTab, {
      props: {
        modelValue: { ssid: '', auth: 'WPA', password: '', hidden: false },
      },
    })

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ label: string; value: string }>
    expect(options).toHaveLength(3)
    expect(options[2]?.label).toBe('wifi-no-pass')
  })

  it('renders vCard inputs', () => {
    const wrapper = mount(VcardTab, {
      props: {
        modelValue: {
          firstName: '',
          lastName: '',
          organization: '',
          title: '',
          phone: '',
          email: '',
          url: '',
          address: '',
        },
      },
    })

    expect(wrapper.findAllComponents({ name: 'NInput' })).toHaveLength(8)
  })

  it('renders SMS inputs', () => {
    const wrapper = mount(SmsTab, {
      props: { modelValue: { phone: '', message: '' } },
    })

    expect(wrapper.findAllComponents({ name: 'NInput' })).toHaveLength(2)
  })

  it('renders telephone input', () => {
    const wrapper = mount(TelTab, {
      props: { modelValue: '' },
    })

    expect(wrapper.findAllComponents({ name: 'NInput' })).toHaveLength(1)
  })

  it('renders mailto inputs', () => {
    const wrapper = mount(MailtoTab, {
      props: { modelValue: { to: '', subject: '', body: '' } },
    })

    expect(wrapper.findAllComponents({ name: 'NInput' })).toHaveLength(3)
  })

  it('renders geo coordinate inputs', () => {
    const wrapper = mount(GeoTab, {
      props: { modelValue: { lat: null, lng: null, alt: null } },
    })

    expect(wrapper.findAllComponents({ name: 'NInputNumber' })).toHaveLength(3)
  })

  it('renders calendar inputs and date pickers', () => {
    const wrapper = mount(CalendarTab, {
      props: {
        modelValue: {
          title: '',
          start: null,
          end: null,
          location: '',
          description: '',
        },
      },
    })

    expect(wrapper.findAllComponents({ name: 'NInput' })).toHaveLength(3)
    expect(wrapper.findAllComponents({ name: 'NDatePicker' })).toHaveLength(2)
  })
})
