import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
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

  it('emits updates from the text tab input', async () => {
    const wrapper = mount(TextTab, {
      props: { modelValue: '' },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    await input.vm.$emit('update:value', 'https://example.com')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['https://example.com'])
  })

  it('updates wifi model fields from inputs', async () => {
    const model = { ssid: '', auth: 'WPA' as const, password: '', hidden: false }
    const wrapper = mount(WifiTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    const select = wrapper.findComponent({ name: 'NSelect' })
    const toggle = wrapper.findComponent({ name: 'NSwitch' })

    await inputs[0]?.vm.$emit('update:value', 'OfficeWifi')
    await select.vm.$emit('update:value', 'WEP')
    await inputs[1]?.vm.$emit('update:value', 'secret')
    await toggle.vm.$emit('update:value', true)
    await nextTick()

    expect(model).toEqual({
      ssid: 'OfficeWifi',
      auth: 'WEP',
      password: 'secret',
      hidden: true,
    })
  })

  it('updates vCard model fields from inputs', async () => {
    const model = {
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      phone: '',
      email: '',
      url: '',
      address: '',
    }
    const wrapper = mount(VcardTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    const values = [
      'Ada',
      'Lovelace',
      'Analytical Engine',
      'Engineer',
      '+1',
      'ada@example.com',
      'https://example.com',
      'London',
    ]
    for (const [index, value] of values.entries()) {
      await inputs[index]?.vm.$emit('update:value', value)
    }
    await nextTick()

    expect(model).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      organization: 'Analytical Engine',
      title: 'Engineer',
      phone: '+1',
      email: 'ada@example.com',
      url: 'https://example.com',
      address: 'London',
    })
  })

  it('updates sms model fields from inputs', async () => {
    const model = { phone: '', message: '' }
    const wrapper = mount(SmsTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    await inputs[0]?.vm.$emit('update:value', '123')
    await inputs[1]?.vm.$emit('update:value', 'hello')
    await nextTick()

    expect(model).toEqual({ phone: '123', message: 'hello' })
  })

  it('emits updates from tel tab input', async () => {
    const wrapper = mount(TelTab, {
      props: { modelValue: '' },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    await input.vm.$emit('update:value', '+123')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['+123'])
  })

  it('updates mailto model fields from inputs', async () => {
    const model = { to: '', subject: '', body: '' }
    const wrapper = mount(MailtoTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    await inputs[0]?.vm.$emit('update:value', 'user@example.com')
    await inputs[1]?.vm.$emit('update:value', 'Hello')
    await inputs[2]?.vm.$emit('update:value', 'Body')
    await nextTick()

    expect(model).toEqual({
      to: 'user@example.com',
      subject: 'Hello',
      body: 'Body',
    })
  })

  it('updates geo model fields from inputs', async () => {
    const model = { lat: null, lng: null, alt: null }
    const wrapper = mount(GeoTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    await inputs[0]?.vm.$emit('update:value', 40.7)
    await inputs[1]?.vm.$emit('update:value', -74.0)
    await inputs[2]?.vm.$emit('update:value', 10)
    await nextTick()

    expect(model).toEqual({ lat: 40.7, lng: -74.0, alt: 10 })
  })

  it('updates calendar model fields from inputs', async () => {
    const model = {
      title: '',
      start: null,
      end: null,
      location: '',
      description: '',
    }
    const wrapper = mount(CalendarTab, {
      props: { modelValue: model },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInput' })
    const datePickers = wrapper.findAllComponents({ name: 'NDatePicker' })

    await inputs[0]?.vm.$emit('update:value', 'Standup')
    await inputs[1]?.vm.$emit('update:value', 'HQ')
    await datePickers[0]?.vm.$emit('update:value', 1700000000000)
    await datePickers[1]?.vm.$emit('update:value', 1700003600000)
    await inputs[2]?.vm.$emit('update:value', 'Daily sync')
    await nextTick()

    expect(model).toEqual({
      title: 'Standup',
      start: 1700000000000,
      end: 1700003600000,
      location: 'HQ',
      description: 'Daily sync',
    })
  })
})
