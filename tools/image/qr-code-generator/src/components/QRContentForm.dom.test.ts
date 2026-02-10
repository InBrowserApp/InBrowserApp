import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import QRContentForm from './QRContentForm.vue'
import type { WifiModel } from './content/WifiTab.vue'
import type { SmsModel } from './content/SmsTab.vue'
import type { VcardModel } from './content/VcardTab.vue'
import type { MailtoModel } from './content/MailtoTab.vue'
import type { GeoModel } from './content/GeoTab.vue'
import type { CalendarModel } from './content/CalendarTab.vue'

type QRContentTab = 'text' | 'wifi' | 'vcard' | 'sms' | 'tel' | 'mailto' | 'geo' | 'calendar'

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

const latestModelValue = (wrapper: ReturnType<typeof mountForm>): string => {
  const emitted = wrapper.emitted('update:modelValue') ?? []
  return (emitted[emitted.length - 1] ?? [''])[0] as string
}

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

  it('builds vCard payloads', async () => {
    const wrapper = mountForm('')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    const vcard: VcardModel = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      organization: 'Analytical Engine',
      title: 'Engineer',
      phone: '+1',
      email: 'ada@example.com',
      url: 'https://example.com',
      address: 'London',
    }

    tabs.vm.$emit('update:activeTab', 'vcard')
    tabs.vm.$emit('update:vcard', vcard)
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue') ?? []
    const payload = emitted[emitted.length - 1]?.[0] as string
    expect(payload).toContain('BEGIN:VCARD')
    expect(payload).toContain('FN:Ada Lovelace')
    expect(payload).toContain('ORG:Analytical Engine')
    expect(payload).toContain('EMAIL:ada@example.com')
  })

  it('builds tel and mailto payloads', async () => {
    const wrapper = mountForm('')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    tabs.vm.$emit('update:activeTab', 'tel')
    tabs.vm.$emit('update:tel', '+123')
    await nextTick()

    let emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['tel:+123'])

    const mailto: MailtoModel = {
      to: 'user@example.com',
      subject: 'Hello',
      body: 'Body',
    }
    tabs.vm.$emit('update:activeTab', 'mailto')
    tabs.vm.$emit('update:mailto', mailto)
    await nextTick()

    emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual(['mailto:user@example.com?subject=Hello&body=Body'])
  })

  it('covers optional payload branches across tabs', async () => {
    const wifiWrapper = mountForm('seed')
    const wifiTabs = wifiWrapper.findComponent(QRContentTabsStub)
    wifiTabs.vm.$emit('update:activeTab', 'wifi')
    wifiTabs.vm.$emit('update:wifi', {
      ssid: 'Guest',
      auth: 'nopass',
      password: 'secret',
      hidden: false,
    } as WifiModel)
    await nextTick()
    expect(latestModelValue(wifiWrapper)).toBe('WIFI:T:nopass;S:Guest;;')

    const vcardWrapper = mountForm('seed')
    const vcardTabs = vcardWrapper.findComponent(QRContentTabsStub)
    vcardTabs.vm.$emit('update:activeTab', 'vcard')
    vcardTabs.vm.$emit('update:vcard', {
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      phone: '',
      email: '',
      url: '',
      address: '',
    } as VcardModel)
    await nextTick()
    expect(latestModelValue(vcardWrapper)).toBe('BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nEND:VCARD')

    const smsWrapper = mountForm('seed')
    const smsTabs = smsWrapper.findComponent(QRContentTabsStub)
    smsTabs.vm.$emit('update:activeTab', 'sms')
    smsTabs.vm.$emit('update:sms', { phone: '123', message: '' } as SmsModel)
    await nextTick()
    expect(latestModelValue(smsWrapper)).toBe('sms:123')

    const telWrapper = mountForm('seed')
    const telTabs = telWrapper.findComponent(QRContentTabsStub)
    telTabs.vm.$emit('update:activeTab', 'tel')
    telTabs.vm.$emit('update:tel', '   ')
    await nextTick()
    expect(latestModelValue(telWrapper)).toBe('')

    const mailtoWrapper = mountForm('seed')
    const mailtoTabs = mailtoWrapper.findComponent(QRContentTabsStub)
    mailtoTabs.vm.$emit('update:activeTab', 'mailto')
    mailtoTabs.vm.$emit('update:mailto', {
      to: 'user@example.com',
      subject: '',
      body: '',
    } as MailtoModel)
    await nextTick()
    expect(latestModelValue(mailtoWrapper)).toBe('mailto:user@example.com')

    const geoWrapper = mountForm('seed')
    const geoTabs = geoWrapper.findComponent(QRContentTabsStub)
    geoTabs.vm.$emit('update:activeTab', 'geo')
    geoTabs.vm.$emit('update:geo', { lat: 1, lng: 2, alt: 3 } as GeoModel)
    await nextTick()
    expect(latestModelValue(geoWrapper)).toBe('geo:1,2,3')

    const calendarWrapper = mountForm('seed')
    const calendarTabs = calendarWrapper.findComponent(QRContentTabsStub)
    calendarTabs.vm.$emit('update:activeTab', 'calendar')
    calendarTabs.vm.$emit('update:calendar', {
      title: '',
      start: null,
      end: null,
      location: '',
      description: '',
    } as CalendarModel)
    await nextTick()

    const calendarPayload = latestModelValue(calendarWrapper)
    expect(calendarPayload).toContain('BEGIN:VCALENDAR')
    expect(calendarPayload).not.toContain('SUMMARY:')
    expect(calendarPayload).not.toContain('LOCATION:')
    expect(calendarPayload).not.toContain('DESCRIPTION:')
    expect(calendarPayload).not.toContain('DTSTART:')
    expect(calendarPayload).not.toContain('DTEND:')
  })

  it('returns empty payloads for incomplete geo and unknown tab', async () => {
    const wrapper = mountForm('seed')
    const tabs = wrapper.findComponent(QRContentTabsStub)

    const geo: GeoModel = { lat: null, lng: 2, alt: null }
    tabs.vm.$emit('update:activeTab', 'geo')
    tabs.vm.$emit('update:geo', geo)
    await nextTick()

    let emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual([''])

    tabs.vm.$emit('update:activeTab', 'text')
    tabs.vm.$emit('update:text', 'content')
    await nextTick()

    tabs.vm.$emit('update:activeTab', 'unknown' as unknown as QRContentTab)
    await nextTick()

    emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual([''])
  })
})
