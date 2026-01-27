<template>
  <n-flex vertical size="large">
    <n-tabs v-if="width > 900" v-model:value="activeTab" type="segment" animated>
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

    <n-flex v-else vertical>
      <n-form-item :label="t('content-type')" :show-feedback="false">
        <n-select v-model:value="activeTab" :options="options" />
      </n-form-item>

      <n-divider />
      <TextTab v-if="activeTab === 'text'" v-model="text" />
      <WifiTab v-if="activeTab === 'wifi'" v-model="wifi" />
      <VcardTab v-if="activeTab === 'vcard'" v-model="vcard" />
      <SmsTab v-if="activeTab === 'sms'" v-model="sms" />
      <TelTab v-if="activeTab === 'tel'" v-model="tel" />
      <MailtoTab v-if="activeTab === 'mailto'" v-model="mailto" />
      <GeoTab v-if="activeTab === 'geo'" v-model="geo" />
      <CalendarTab v-if="activeTab === 'calendar'" v-model="calendar" />
    </n-flex>

    <n-alert v-if="activeTab !== 'text' && payload !== ''" type="info" :show-icon="false">
      {{ t('payload-preview') }}
      <br />
      <n-text code>{{ payload }}</n-text>
    </n-alert>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NDivider,
  NFlex,
  NFormItem,
  NIcon,
  NSelect,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui'
import { useWindowSize } from '@vueuse/core'
import TextTab from './content/TextTab.vue'
import WifiTab, { type WifiModel } from './content/WifiTab.vue'
import VcardTab, { type VcardModel } from './content/VcardTab.vue'
import SmsTab, { type SmsModel } from './content/SmsTab.vue'
import TelTab from './content/TelTab.vue'
import MailtoTab, { type MailtoModel } from './content/MailtoTab.vue'
import GeoTab, { type GeoModel } from './content/GeoTab.vue'
import CalendarTab, { type CalendarModel } from './content/CalendarTab.vue'
import TextIcon from '@vicons/fluent/TextDescription20Regular'
import WifiIcon from '@vicons/fluent/Wifi224Filled'
import VcardIcon from '@vicons/fluent/ContactCard20Regular'
import SmsIcon from '@vicons/fluent/Chat16Regular'
import MailtoIcon from '@vicons/fluent/Mail16Regular'
import GeoIcon from '@vicons/fluent/GlobeLocation20Regular'
import CalendarIcon from '@vicons/fluent/CalendarLtr20Regular'
import TelIcon from '@vicons/fluent/Call16Regular'

type QRContentTab = 'text' | 'wifi' | 'vcard' | 'sms' | 'tel' | 'mailto' | 'geo' | 'calendar'

const props = defineProps<{ payload: string }>()
const payload = toRef(props, 'payload')

const activeTab = defineModel<QRContentTab>('active-tab', { required: true })
const text = defineModel<string>('text', { required: true })
const wifi = defineModel<WifiModel>('wifi', { required: true })
const vcard = defineModel<VcardModel>('vcard', { required: true })
const sms = defineModel<SmsModel>('sms', { required: true })
const tel = defineModel<string>('tel', { required: true })
const mailto = defineModel<MailtoModel>('mailto', { required: true })
const geo = defineModel<GeoModel>('geo', { required: true })
const calendar = defineModel<CalendarModel>('calendar', { required: true })

const { t } = useI18n({ useScope: 'local' })
const { width } = useWindowSize()

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
