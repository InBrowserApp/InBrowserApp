<template>
  <section>
    <n-text strong class="section-title">{{ t('fingerprints') }}</n-text>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item :label="t('fingerprintSha1')">
        <FieldValue :value="sha1" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('fingerprintSha256')">
        <FieldValue :value="sha256" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
    </n-descriptions>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import FieldValue from './FieldValue.vue'

defineProps<{
  sha1: string
  sha256: string
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
    "fingerprints": "Fingerprints",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Not available"
  },
  "zh": {
    "fingerprints": "指纹",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "fingerprints": "指纹",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "fingerprints": "指紋",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "fingerprints": "指紋",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "不可用"
  },
  "es": {
    "fingerprints": "Huellas digitales",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "No disponible"
  },
  "fr": {
    "fingerprints": "Empreintes",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Indisponible"
  },
  "de": {
    "fingerprints": "Fingerabdrücke",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "fingerprints": "Impronte digitali",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "fingerprints": "フィンガープリント",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "利用不可"
  },
  "ko": {
    "fingerprints": "지문",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "fingerprints": "Отпечатки",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "fingerprints": "Impressões digitais",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "fingerprints": "البصمات",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "fingerprints": "फिंगरप्रिंट",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "fingerprints": "Parmak izleri",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "fingerprints": "Vingerafdrukken",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "fingerprints": "Fingeravtryck",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "fingerprints": "Odciski palca",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "fingerprints": "Dấu vân tay",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "fingerprints": "ลายนิ้วมือ",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "fingerprints": "Sidik jari",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "fingerprints": "טביעות אצבע",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "fingerprints": "Cap jari",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "fingerprints": "Fingeravtrykk",
    "fingerprintSha1": "SHA-1",
    "fingerprintSha256": "SHA-256",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
