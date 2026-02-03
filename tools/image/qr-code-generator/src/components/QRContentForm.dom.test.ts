import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import QRContentForm from './QRContentForm.vue'
import type { WifiModel } from './content/WifiTab.vue'
import type { SmsModel } from './content/SmsTab.vue'
import type { GeoModel } from './content/GeoTab.vue'
import type { CalendarModel } from './content/CalendarTab.vue'

const QRContentTabsStub = defineComponent({
  name: 'QRContentTabs',
  props: [
    'activeTab',
    'text',
    'wifi',
    'vcard',
    'sms',
    'tel',
    'mailto',
    'geo',
    'calendar',
    'payload',
  ],
  emits: [
    'update:activeTab',
    'update:text',
    'update:wifi',
    'update:vcard',
    'update:sms',
    'update:tel',
    'update:mailto',
    'update:geo',
    'update:calendar',
  ],
  template: '<div class="qr-content-tabs" />',
})

const mountForm = (modelValue: string) =>
  mount(QRContentForm, {
    props: { modelValue },
    global: {
      stubs: {
        QRContentTabs: QRContentTabsStub,
      },
    },
  })

describe('QRContentForm', () => {
  it('emits text payload updates', async () => {
    const wrapper = mountForm('hello')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    tabs.vm.$emit('update:text', 'updated')
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['updated'])
  })

  it('builds wifi payload with escaping', async () => {
    const wrapper = mountForm('')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    const wifi: WifiModel = {
      ssid: 'AC;DC',
      auth: 'WPA',
      password: 'p:1',
      hidden: true,
    }

    tabs.vm.$emit('update:activeTab', 'wifi')
    tabs.vm.$emit('update:wifi', wifi)
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['WIFI:T:WPA;S:AC\\;DC;P:p\\:1;H:true;;'])
  })

  it('builds sms and geo payloads', async () => {
    const wrapper = mountForm('')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    const sms: SmsModel = { phone: '123', message: 'hi there' }
    tabs.vm.$emit('update:activeTab', 'sms')
    tabs.vm.$emit('update:sms', sms)
    await nextTick()

    let emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['sms:123?body=hi%20there'])

    const geo: GeoModel = { lat: 1, lng: 2, alt: null }
    tabs.vm.$emit('update:activeTab', 'geo')
    tabs.vm.$emit('update:geo', geo)
    await nextTick()

    emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['geo:1,2'])
  })

  it('builds calendar payloads', async () => {
    const wrapper = mountForm('')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    const calendar: CalendarModel = {
      title: 'Meeting',
      start: Date.UTC(2024, 0, 1, 10, 0, 0),
      end: Date.UTC(2024, 0, 1, 11, 0, 0),
      location: 'HQ',
      description: 'Review',
    }

    tabs.vm.$emit('update:activeTab', 'calendar')
    tabs.vm.$emit('update:calendar', calendar)
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue') ?? []
    const payload = emitted[emitted.length - 1]?.[0] as string
    expect(payload).toContain('SUMMARY:Meeting')
    expect(payload).toContain('LOCATION:HQ')
    expect(payload).toContain('DTSTART:20240101T100000Z')
    expect(payload).toContain('DTEND:20240101T110000Z')
  })
})
