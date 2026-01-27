<template>
  <QRContentTabs
    v-model:active-tab="activeTab"
    v-model:text="text"
    v-model:wifi="wifi"
    v-model:vcard="vcard"
    v-model:sms="sms"
    v-model:tel="tel"
    v-model:mailto="mailto"
    v-model:geo="geo"
    v-model:calendar="calendar"
    :payload="model"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import QRContentTabs from './QRContentTabs.vue'
import type { WifiModel } from './content/WifiTab.vue'
import type { VcardModel } from './content/VcardTab.vue'
import type { SmsModel } from './content/SmsTab.vue'
import type { MailtoModel } from './content/MailtoTab.vue'
import type { GeoModel } from './content/GeoTab.vue'
import type { CalendarModel } from './content/CalendarTab.vue'

type QRContentTab = 'text' | 'wifi' | 'vcard' | 'sms' | 'tel' | 'mailto' | 'geo' | 'calendar'

const model = defineModel<string>({ required: true })

const activeTab = ref<QRContentTab>('text')

const text = ref<string>(model.value)

const wifi = reactive<WifiModel>({
  ssid: '',
  auth: 'WPA' as 'WPA' | 'WEP' | 'nopass',
  password: '',
  hidden: false,
})

const vcard = reactive<VcardModel>({
  firstName: '',
  lastName: '',
  organization: '',
  title: '',
  phone: '',
  email: '',
  url: '',
  address: '',
})

const sms = reactive<SmsModel>({ phone: '', message: '' })
const tel = ref<string>('')
const mailto = reactive<MailtoModel>({ to: '', subject: '', body: '' })
const geo = reactive<GeoModel>({
  lat: null,
  lng: null,
  alt: null,
})
const calendar = reactive<CalendarModel>({
  title: '',
  start: null,
  end: null,
  location: '',
  description: '',
})

function escapeSemicolonsAndBackslashes(input: string): string {
  return input.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,')
}

const textPayload = computed<string>(() => text.value)

const wifiPayload = computed<string>(() => {
  const parts = [
    'WIFI:',
    `T:${wifi.auth};`,
    `S:${escapeSemicolonsAndBackslashes(wifi.ssid)};`,
    wifi.auth !== 'nopass' && wifi.password
      ? `P:${escapeSemicolonsAndBackslashes(wifi.password)};`
      : '',
    wifi.hidden ? 'H:true;' : '',
    ';',
  ]
  return parts.filter(Boolean).join('')
})

const vcardPayload = computed<string>(() => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vcard.lastName};${vcard.firstName};;;`,
    vcard.firstName || vcard.lastName
      ? `FN:${[vcard.firstName, vcard.lastName].filter(Boolean).join(' ')}`
      : '',
    vcard.organization ? `ORG:${vcard.organization}` : '',
    vcard.title ? `TITLE:${vcard.title}` : '',
    vcard.phone ? `TEL;TYPE=CELL:${vcard.phone}` : '',
    vcard.email ? `EMAIL:${vcard.email}` : '',
    vcard.url ? `URL:${vcard.url}` : '',
    vcard.address ? `ADR:;;${vcard.address};;;;` : '',
    'END:VCARD',
  ]
  return lines.filter(Boolean).join('\n')
})

const smsPayload = computed<string>(() => {
  const to = sms.phone.trim()
  const body = sms.message ? `?body=${encodeURIComponent(sms.message)}` : ''
  return to ? `sms:${to}${body}` : ''
})

const telPayload = computed<string>(() => {
  const to = tel.value.trim()
  return to ? `tel:${to}` : ''
})

const mailtoPayload = computed<string>(() => {
  const to = mailto.to.trim()
  const params = new URLSearchParams()
  if (mailto.subject) params.set('subject', mailto.subject)
  if (mailto.body) params.set('body', mailto.body)
  const qs = params.toString()
  return to ? `mailto:${to}${qs ? `?${qs}` : ''}` : ''
})

const geoPayload = computed<string>(() => {
  const lat = geo.lat
  const lng = geo.lng
  const alt = geo.alt
  if (lat == null || lng == null) return ''
  return alt == null ? `geo:${lat},${lng}` : `geo:${lat},${lng},${alt}`
})

function formatAsICSDateTime(ms: number): string {
  const dt = new Date(ms)
  const yyyy = dt.getUTCFullYear().toString().padStart(4, '0')
  const mm = (dt.getUTCMonth() + 1).toString().padStart(2, '0')
  const dd = dt.getUTCDate().toString().padStart(2, '0')
  const hh = dt.getUTCHours().toString().padStart(2, '0')
  const mi = dt.getUTCMinutes().toString().padStart(2, '0')
  const ss = dt.getUTCSeconds().toString().padStart(2, '0')
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`
}

const calendarPayload = computed<string>(() => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//inbrowser.app//qr-code-generator//EN',
    'BEGIN:VEVENT',
    calendar.title ? `SUMMARY:${calendar.title}` : '',
    calendar.location ? `LOCATION:${calendar.location}` : '',
    calendar.description ? `DESCRIPTION:${calendar.description}` : '',
    calendar.start != null ? `DTSTART:${formatAsICSDateTime(calendar.start)}` : '',
    calendar.end != null ? `DTEND:${formatAsICSDateTime(calendar.end)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.filter(Boolean).join('\n')
})

const payload = computed<string>(() => {
  switch (activeTab.value) {
    case 'text':
      return textPayload.value
    case 'wifi':
      return wifiPayload.value
    case 'vcard':
      return vcardPayload.value
    case 'sms':
      return smsPayload.value
    case 'tel':
      return telPayload.value
    case 'mailto':
      return mailtoPayload.value
    case 'geo':
      return geoPayload.value
    case 'calendar':
      return calendarPayload.value
    default:
      return ''
  }
})

watch(payload, (v) => (model.value = v))
watch(model, (v) => {
  if (activeTab.value === 'text') text.value = v
})
</script>
