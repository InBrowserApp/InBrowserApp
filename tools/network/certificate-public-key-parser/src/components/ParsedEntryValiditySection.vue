<template>
  <section>
    <n-text strong class="section-title">{{ t('validity') }}</n-text>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item :label="t('notBefore')">
        <FieldValue :value="notBefore" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('notAfter')">
        <FieldValue :value="notAfter" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
    </n-descriptions>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import FieldValue from './FieldValue.vue'

defineProps<{
  notBefore: string
  notAfter: string
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
    "validity": "Validity",
    "notBefore": "Not Before",
    "notAfter": "Not After",
    "notAvailable": "Not available"
  },
  "zh": {
    "validity": "有效期",
    "notBefore": "起始时间",
    "notAfter": "截止时间",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "validity": "有效期",
    "notBefore": "起始时间",
    "notAfter": "截止时间",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "validity": "有效期",
    "notBefore": "起始時間",
    "notAfter": "截止時間",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "validity": "有效期",
    "notBefore": "起始時間",
    "notAfter": "截止時間",
    "notAvailable": "不可用"
  },
  "es": {
    "validity": "Validez",
    "notBefore": "No antes de",
    "notAfter": "No después de",
    "notAvailable": "No disponible"
  },
  "fr": {
    "validity": "Validité",
    "notBefore": "Pas avant",
    "notAfter": "Pas après",
    "notAvailable": "Indisponible"
  },
  "de": {
    "validity": "Gültigkeit",
    "notBefore": "Nicht vor",
    "notAfter": "Nicht nach",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "validity": "Validità",
    "notBefore": "Non prima",
    "notAfter": "Non dopo",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "validity": "有効期間",
    "notBefore": "有効開始",
    "notAfter": "有効終了",
    "notAvailable": "利用不可"
  },
  "ko": {
    "validity": "유효 기간",
    "notBefore": "유효 시작",
    "notAfter": "유효 종료",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "validity": "Срок действия",
    "notBefore": "Не раньше",
    "notAfter": "Не позже",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "validity": "Validade",
    "notBefore": "Não antes de",
    "notAfter": "Não depois de",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "validity": "الصلاحية",
    "notBefore": "غير صالح قبل",
    "notAfter": "غير صالح بعد",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "validity": "वैधता",
    "notBefore": "इससे पहले नहीं",
    "notAfter": "इसके बाद नहीं",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "validity": "Geçerlilik",
    "notBefore": "Başlangıç",
    "notAfter": "Bitiş",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "validity": "Geldigheid",
    "notBefore": "Niet vóór",
    "notAfter": "Niet ná",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "validity": "Giltighet",
    "notBefore": "Inte före",
    "notAfter": "Inte efter",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "validity": "Ważność",
    "notBefore": "Nie wcześniej niż",
    "notAfter": "Nie później niż",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "validity": "Hiệu lực",
    "notBefore": "Không trước",
    "notAfter": "Không sau",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "validity": "ระยะเวลาใช้งาน",
    "notBefore": "เริ่มใช้",
    "notAfter": "หมดอายุ",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "validity": "Masa berlaku",
    "notBefore": "Tidak sebelum",
    "notAfter": "Tidak setelah",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "validity": "תוקף",
    "notBefore": "לא לפני",
    "notAfter": "לא אחרי",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "validity": "Tempoh sah",
    "notBefore": "Tidak sebelum",
    "notAfter": "Tidak selepas",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "validity": "Gyldighet",
    "notBefore": "Ikke før",
    "notAfter": "Ikke etter",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
