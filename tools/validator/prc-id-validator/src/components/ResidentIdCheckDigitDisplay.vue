<template>
  <NFlex align="center" :size="8">
    <NText depth="3">{{ t('expected') }}: {{ expectedDisplay }}</NText>
    <NText depth="3">{{ t('actual') }}: {{ actualDisplay }}</NText>
  </NFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  expected?: string | null
  actual?: string | null
}>()

const expectedDisplay = computed(() => props.expected ?? t('notAvailable'))

const actualDisplay = computed(() => props.actual ?? t('notAvailable'))
</script>

<i18n lang="json">
{
  "en": {
    "expected": "Expected",
    "actual": "Actual",
    "notAvailable": "Not available"
  },
  "zh": {
    "expected": "期望",
    "actual": "实际",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "expected": "期望",
    "actual": "实际",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "expected": "期望",
    "actual": "實際",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "expected": "期望",
    "actual": "實際",
    "notAvailable": "不可用"
  },
  "es": {
    "expected": "Esperado",
    "actual": "Actual",
    "notAvailable": "No disponible"
  },
  "fr": {
    "expected": "Attendu",
    "actual": "Réel",
    "notAvailable": "Non disponible"
  },
  "de": {
    "expected": "Erwartet",
    "actual": "Tatsächlich",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "expected": "Atteso",
    "actual": "Reale",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "expected": "期待値",
    "actual": "実際",
    "notAvailable": "利用不可"
  },
  "ko": {
    "expected": "예상",
    "actual": "실제",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "expected": "Ожидается",
    "actual": "Фактически",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "expected": "Esperado",
    "actual": "Atual",
    "notAvailable": "Não disponível"
  },
  "ar": {
    "expected": "المتوقع",
    "actual": "الفعلي",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "expected": "अपेक्षित",
    "actual": "वास्तविक",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "expected": "Beklenen",
    "actual": "Gerçek",
    "notAvailable": "Mevcut değil"
  },
  "nl": {
    "expected": "Verwacht",
    "actual": "Werkelijk",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "expected": "Förväntad",
    "actual": "Faktisk",
    "notAvailable": "Inte tillgängligt"
  },
  "pl": {
    "expected": "Oczekiwane",
    "actual": "Rzeczywiste",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "expected": "Kỳ vọng",
    "actual": "Thực tế",
    "notAvailable": "Không có"
  },
  "th": {
    "expected": "ที่คาดไว้",
    "actual": "จริง",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "expected": "Diharapkan",
    "actual": "Aktual",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "expected": "צפוי",
    "actual": "בפועל",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "expected": "Dijangka",
    "actual": "Sebenar",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "expected": "Forventet",
    "actual": "Faktisk",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
