<template>
  <n-flex vertical size="large">
    <n-tabs v-model:value="activeTab" type="segment" animated v-if="width > 900">
      <n-tab-pane name="text">
        <template #tab>
          <n-text><n-icon :component="TextIcon" class="icon" /> {{ t('tab-text') }}</n-text>
        </template>
        <TextTab v-model="text" />
      </n-tab-pane>
      <n-tab-pane name="wifi">
        <template #tab>
          <n-text><n-icon :component="WifiIcon" class="icon" /> {{ t('tab-wifi') }}</n-text>
        </template>
        <WifiTab v-model="wifi" />
      </n-tab-pane>
      <n-tab-pane name="vcard">
        <template #tab>
          <n-text><n-icon :component="VcardIcon" class="icon" /> {{ t('tab-vcard') }}</n-text>
        </template>
        <VcardTab v-model="vcard" />
      </n-tab-pane>
      <n-tab-pane name="sms">
        <template #tab>
          <n-text><n-icon :component="SmsIcon" class="icon" /> {{ t('tab-sms') }}</n-text>
        </template>
        <SmsTab v-model="sms" />
      </n-tab-pane>
      <n-tab-pane name="tel">
        <template #tab>
          <n-text><n-icon :component="TelIcon" class="icon" /> {{ t('tab-tel') }}</n-text>
        </template>
        <TelTab v-model="tel" />
      </n-tab-pane>
      <n-tab-pane name="mailto">
        <template #tab>
          <n-text><n-icon :component="MailtoIcon" class="icon" /> {{ t('tab-mailto') }}</n-text>
        </template>
        <MailtoTab v-model="mailto" />
      </n-tab-pane>
      <n-tab-pane name="geo">
        <template #tab>
          <n-text><n-icon :component="GeoIcon" class="icon" /> {{ t('tab-geo') }}</n-text>
        </template>
        <GeoTab v-model="geo" />
      </n-tab-pane>
      <n-tab-pane name="calendar">
        <template #tab>
          <n-text><n-icon :component="CalendarIcon" class="icon" /> {{ t('tab-calendar') }}</n-text>
        </template>
        <CalendarTab v-model="calendar" />
      </n-tab-pane>
    </n-tabs>

    <n-flex vertical v-else>
      <n-form-item :label="t('content-type')" :show-feedback="false">
        <n-select :options="options" v-model:value="activeTab" />
      </n-form-item>

      <n-divider />
      <TextTab v-model="text" v-if="activeTab === 'text'" />
      <WifiTab v-model="wifi" v-if="activeTab === 'wifi'" />
      <VcardTab v-model="vcard" v-if="activeTab === 'vcard'" />
      <SmsTab v-model="sms" v-if="activeTab === 'sms'" />
      <TelTab v-model="tel" v-if="activeTab === 'tel'" />
      <MailtoTab v-model="mailto" v-if="activeTab === 'mailto'" />
      <GeoTab v-model="geo" v-if="activeTab === 'geo'" />
      <CalendarTab v-model="calendar" v-if="activeTab === 'calendar'" />
    </n-flex>

    <n-alert type="info" v-if="activeTab !== 'text' && model != ''" :show-icon="false">
      {{ t('payload-preview') }}
      <br />
      <n-text code>{{ model }}</n-text>
    </n-alert>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NTabs,
  NTabPane,
  NAlert,
  NFlex,
  NText,
  NIcon,
  NSelect,
  NDivider,
  NFormItem,
} from 'naive-ui'
import TextTab from './content/TextTab.vue'
import WifiTab, { type WifiModel } from './content/WifiTab.vue'
import VcardTab, { type VcardModel } from './content/VcardTab.vue'
import SmsTab, { type SmsModel } from './content/SmsTab.vue'
import TelTab from './content/TelTab.vue'
import MailtoTab, { type MailtoModel } from './content/MailtoTab.vue'
import GeoTab, { type GeoModel } from './content/GeoTab.vue'
import CalendarTab, { type CalendarModel } from './content/CalendarTab.vue'
import { useWindowSize } from '@vueuse/core'
import TextIcon from '@vicons/fluent/TextDescription20Regular'
import WifiIcon from '@vicons/fluent/Wifi224Filled'
import VcardIcon from '@vicons/fluent/ContactCard20Regular'
import SmsIcon from '@vicons/fluent/Chat16Regular'
import MailtoIcon from '@vicons/fluent/Mail16Regular'
import GeoIcon from '@vicons/fluent/GlobeLocation20Regular'
import CalendarIcon from '@vicons/fluent/CalendarLtr20Regular'
import TelIcon from '@vicons/fluent/Call16Regular'
const model = defineModel<string>({ required: true })

const { t } = useI18n()

const { width } = useWindowSize()

const activeTab = ref<'text' | 'wifi' | 'vcard' | 'sms' | 'tel' | 'mailto' | 'geo' | 'calendar'>(
  'text',
)

const options = computed(() => [
  { label: t('tab-text'), value: 'text' },
  { label: t('tab-wifi'), value: 'wifi' },
  { label: t('tab-vcard'), value: 'vcard' },
  { label: t('tab-sms'), value: 'sms' },
  { label: t('tab-tel'), value: 'tel' },
  { label: t('tab-mailto'), value: 'mailto' },
  { label: t('tab-geo'), value: 'geo' },
  { label: t('tab-calendar'), value: 'calendar' },
])

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

// Per-type payloads
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

// Final payload switcher
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

<style scoped>
.icon {
  vertical-align: -0.15em;
}
</style>

<i18n lang="json">
{
  "en": {
    "tab-text": "Text / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contact",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mailto",
    "tab-geo": "Geo",
    "tab-calendar": "Calendar",
    "payload-preview": "Payload preview for this type:",
    "content-type": "Content type"
  },
  "zh": {
    "tab-text": "文本 / 链接",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "联系人",
    "tab-sms": "短信",
    "tab-tel": "电话",
    "tab-mailto": "邮件",
    "tab-geo": "地理位置",
    "tab-calendar": "日历",
    "payload-preview": "此类型的有效负载预览：",
    "content-type": "内容类型"
  },
  "zh-CN": {
    "tab-text": "文本 / 链接",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "联系人",
    "tab-sms": "短信",
    "tab-tel": "电话",
    "tab-mailto": "邮件",
    "tab-geo": "地理位置",
    "tab-calendar": "日历",
    "payload-preview": "此类型的有效负载预览：",
    "content-type": "内容类型"
  },
  "zh-TW": {
    "tab-text": "文字 / 連結",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "聯絡人",
    "tab-sms": "簡訊",
    "tab-tel": "電話",
    "tab-mailto": "電子郵件",
    "tab-geo": "地理位置",
    "tab-calendar": "行事曆",
    "payload-preview": "此類型的負載預覽：",
    "content-type": "內容類型"
  },
  "zh-HK": {
    "tab-text": "文字 / 連結",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "聯絡人",
    "tab-sms": "短訊",
    "tab-tel": "電話",
    "tab-mailto": "電郵",
    "tab-geo": "地理位置",
    "tab-calendar": "日曆",
    "payload-preview": "此類型的負載預覽：",
    "content-type": "內容類型"
  },
  "es": {
    "tab-text": "Texto / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contacto",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Correo",
    "tab-geo": "Geo",
    "tab-calendar": "Calendario",
    "payload-preview": "Vista previa de la carga útil:",
    "content-type": "Tipo de contenido"
  },
  "fr": {
    "tab-text": "Texte / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contact",
    "tab-sms": "SMS",
    "tab-tel": "Tél",
    "tab-mailto": "Courriel",
    "tab-geo": "Géo",
    "tab-calendar": "Calendrier",
    "payload-preview": "Aperçu de la charge utile :",
    "content-type": "Type de contenu"
  },
  "de": {
    "tab-text": "Text / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kontakt",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "E‑Mail",
    "tab-geo": "Geo",
    "tab-calendar": "Kalender",
    "payload-preview": "Nutzlast‑Vorschau:",
    "content-type": "Inhaltstyp"
  },
  "it": {
    "tab-text": "Testo / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contatto",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mail",
    "tab-geo": "Geo",
    "tab-calendar": "Calendario",
    "payload-preview": "Anteprima payload:",
    "content-type": "Tipo di contenuto"
  },
  "ja": {
    "tab-text": "テキスト / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "連絡先",
    "tab-sms": "SMS",
    "tab-tel": "電話",
    "tab-mailto": "メール",
    "tab-geo": "位置",
    "tab-calendar": "カレンダー",
    "payload-preview": "この種類のペイロード:",
    "content-type": "コンテンツの種類"
  },
  "ko": {
    "tab-text": "텍스트 / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "연락처",
    "tab-sms": "SMS",
    "tab-tel": "전화",
    "tab-mailto": "메일",
    "tab-geo": "위치",
    "tab-calendar": "캘린더",
    "payload-preview": "이 타입의 페이로드 미리보기:",
    "content-type": "콘텐츠 유형"
  },
  "ru": {
    "tab-text": "Текст / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Контакт",
    "tab-sms": "SMS",
    "tab-tel": "Тел",
    "tab-mailto": "Почта",
    "tab-geo": "Гео",
    "tab-calendar": "Календарь",
    "payload-preview": "Предпросмотр полезной нагрузки:",
    "content-type": "Тип содержимого"
  },
  "pt": {
    "tab-text": "Texto / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contato",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Email",
    "tab-geo": "Geo",
    "tab-calendar": "Calendário",
    "payload-preview": "Prévia da carga útil:",
    "content-type": "Tipo de conteúdo"
  },
  "ar": {
    "tab-text": "نص / رابط",
    "tab-wifi": "واي فاي",
    "tab-vcard": "جهة اتصال",
    "tab-sms": "رسالة نصية",
    "tab-tel": "هاتف",
    "tab-mailto": "بريد",
    "tab-geo": "الموقع",
    "tab-calendar": "التقويم",
    "payload-preview": "معاينة الحمولة:",
    "content-type": "نوع المحتوى"
  },
  "hi": {
    "tab-text": "टेक्स्ट / URL",
    "tab-wifi": "वाई‑फाई",
    "tab-vcard": "संपर्क",
    "tab-sms": "SMS",
    "tab-tel": "फोन",
    "tab-mailto": "मेल",
    "tab-geo": "स्थान",
    "tab-calendar": "कैलेंडर",
    "payload-preview": "पेलोड पूर्वावलोकन:",
    "content-type": "सामग्री प्रकार"
  },
  "tr": {
    "tab-text": "Metin / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kişi",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "E‑posta",
    "tab-geo": "Konum",
    "tab-calendar": "Takvim",
    "payload-preview": "Yük önizlemesi:",
    "content-type": "İçerik türü"
  },
  "nl": {
    "tab-text": "Tekst / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Contact",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mailto",
    "tab-geo": "Geo",
    "tab-calendar": "Agenda",
    "payload-preview": "Voorbeeld van payload:",
    "content-type": "Inhoudstype"
  },
  "sv": {
    "tab-text": "Text / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kontakt",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mail",
    "tab-geo": "Geo",
    "tab-calendar": "Kalender",
    "payload-preview": "Förhandsvisning av payload:",
    "content-type": "Innehållstyp"
  },
  "pl": {
    "tab-text": "Tekst / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kontakt",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mail",
    "tab-geo": "Geo",
    "tab-calendar": "Kalendarz",
    "payload-preview": "Podgląd ładunku:",
    "content-type": "Typ treści"
  },
  "vi": {
    "tab-text": "Văn bản / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Liên hệ",
    "tab-sms": "SMS",
    "tab-tel": "Điện thoại",
    "tab-mailto": "Mailto",
    "tab-geo": "Vị trí",
    "tab-calendar": "Lịch",
    "payload-preview": "Xem trước payload:",
    "content-type": "Loại nội dung"
  },
  "th": {
    "tab-text": "ข้อความ / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "ผู้ติดต่อ",
    "tab-sms": "SMS",
    "tab-tel": "โทร",
    "tab-mailto": "อีเมล",
    "tab-geo": "ตำแหน่ง",
    "tab-calendar": "ปฏิทิน",
    "payload-preview": "ตัวอย่างเพย์โหลด:",
    "content-type": "ประเภทเนื้อหา"
  },
  "id": {
    "tab-text": "Teks / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kontak",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Email",
    "tab-geo": "Geo",
    "tab-calendar": "Kalender",
    "payload-preview": "Pratinjau payload:",
    "content-type": "Jenis konten"
  },
  "he": {
    "tab-text": "טקסט / כתובת",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "איש קשר",
    "tab-sms": "SMS",
    "tab-tel": "טלפון",
    "tab-mailto": "דואל",
    "tab-geo": "מיקום",
    "tab-calendar": "לוח שנה",
    "payload-preview": "תצוגה מקדימה של המטען:",
    "content-type": "סוג תוכן"
  },
  "ms": {
    "tab-text": "Teks / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kenalan",
    "tab-sms": "SMS",
    "tab-tel": "Tel",
    "tab-mailto": "Mel",
    "tab-geo": "Geo",
    "tab-calendar": "Kalendar",
    "payload-preview": "Pratonton beban:",
    "content-type": "Jenis kandungan"
  },
  "no": {
    "tab-text": "Tekst / URL",
    "tab-wifi": "Wi‑Fi",
    "tab-vcard": "Kontakt",
    "tab-sms": "SMS",
    "tab-tel": "Tlf",
    "tab-mailto": "E‑post",
    "tab-geo": "Geo",
    "tab-calendar": "Kalender",
    "payload-preview": "Forhåndsvisning av nyttelast:",
    "content-type": "Innholdstype"
  }
}
</i18n>
