<template>
  <section>
    <n-text strong class="section-title">{{ t('subjectIssuer') }}</n-text>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item :label="t('subject')">
        <FieldValue :value="subject" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('issuer')">
        <FieldValue :value="issuer" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
    </n-descriptions>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import FieldValue from './FieldValue.vue'

defineProps<{
  subject: string
  issuer: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.section-title {
  display: block;
  margin-bottom: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "subjectIssuer": "Subject & Issuer",
    "subject": "Subject",
    "issuer": "Issuer",
    "notAvailable": "Not available"
  },
  "zh": {
    "subjectIssuer": "主体与颁发者",
    "subject": "主体",
    "issuer": "颁发者",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "subjectIssuer": "主体与颁发者",
    "subject": "主体",
    "issuer": "颁发者",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "subjectIssuer": "主體與簽發者",
    "subject": "主體",
    "issuer": "簽發者",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "subjectIssuer": "主體與簽發者",
    "subject": "主體",
    "issuer": "簽發者",
    "notAvailable": "不可用"
  },
  "es": {
    "subjectIssuer": "Sujeto y emisor",
    "subject": "Sujeto",
    "issuer": "Emisor",
    "notAvailable": "No disponible"
  },
  "fr": {
    "subjectIssuer": "Sujet et émetteur",
    "subject": "Sujet",
    "issuer": "Émetteur",
    "notAvailable": "Indisponible"
  },
  "de": {
    "subjectIssuer": "Subjekt und Aussteller",
    "subject": "Subjekt",
    "issuer": "Aussteller",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "subjectIssuer": "Soggetto e emittente",
    "subject": "Soggetto",
    "issuer": "Emittente",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "subjectIssuer": "サブジェクトと発行者",
    "subject": "サブジェクト",
    "issuer": "発行者",
    "notAvailable": "利用不可"
  },
  "ko": {
    "subjectIssuer": "주체 및 발급자",
    "subject": "주체",
    "issuer": "발급자",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "subjectIssuer": "Субъект и издатель",
    "subject": "Субъект",
    "issuer": "Издатель",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "subjectIssuer": "Sujeito e emissor",
    "subject": "Sujeito",
    "issuer": "Emissor",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "subjectIssuer": "الموضوع والجهة المُصدِرة",
    "subject": "الموضوع",
    "issuer": "الجهة المُصدِرة",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "subjectIssuer": "विषय और जारीकर्ता",
    "subject": "विषय",
    "issuer": "जारीकर्ता",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "subjectIssuer": "Konu ve Düzenleyici",
    "subject": "Konu",
    "issuer": "Düzenleyici",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "subjectIssuer": "Subject en uitgever",
    "subject": "Subject",
    "issuer": "Uitgever",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "subjectIssuer": "Subjekt och utfärdare",
    "subject": "Subjekt",
    "issuer": "Utfärdare",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "subjectIssuer": "Podmiot i wystawca",
    "subject": "Podmiot",
    "issuer": "Wystawca",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "subjectIssuer": "Chủ thể và tổ chức phát hành",
    "subject": "Chủ thể",
    "issuer": "Tổ chức phát hành",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "subjectIssuer": "ผู้ถือและผู้ออก",
    "subject": "ผู้ถือ",
    "issuer": "ผู้ออก",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "subjectIssuer": "Subjek dan penerbit",
    "subject": "Subjek",
    "issuer": "Penerbit",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "subjectIssuer": "נושא ומנפיק",
    "subject": "נושא",
    "issuer": "מנפיק",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "subjectIssuer": "Subjek dan pengeluar",
    "subject": "Subjek",
    "issuer": "Pengeluar",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "subjectIssuer": "Subjekt og utsteder",
    "subject": "Subjekt",
    "issuer": "Utsteder",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
