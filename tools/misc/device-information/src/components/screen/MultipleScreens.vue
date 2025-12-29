<template>
  <InfoStatistic
    v-if="screenIsExtended !== undefined"
    :label="t('multiple-screens')"
    :value="screenIsExtended ? t('yes') : t('no')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const screenIsExtended = computed(() => (screen as unknown as { isExtended?: boolean }).isExtended)
</script>

<i18n lang="json">
{
  "en": {
    "multiple-screens": "Multiple Screens",
    "yes": "Yes",
    "no": "No"
  },
  "zh": {
    "multiple-screens": "多屏幕",
    "yes": "是",
    "no": "否"
  },
  "zh-CN": {
    "multiple-screens": "多屏幕",
    "yes": "是",
    "no": "否"
  },
  "zh-TW": {
    "multiple-screens": "多螢幕",
    "yes": "是",
    "no": "否"
  },
  "zh-HK": {
    "multiple-screens": "多螢幕",
    "yes": "是",
    "no": "否"
  },
  "es": {
    "multiple-screens": "Múltiples pantallas",
    "yes": "Sí",
    "no": "No"
  },
  "fr": {
    "multiple-screens": "Écrans multiples",
    "yes": "Oui",
    "no": "Non"
  },
  "de": {
    "multiple-screens": "Mehrere Bildschirme",
    "yes": "Ja",
    "no": "Nein"
  },
  "it": {
    "multiple-screens": "Schermi multipli",
    "yes": "Sì",
    "no": "No"
  },
  "ja": {
    "multiple-screens": "マルチスクリーン",
    "yes": "はい",
    "no": "いいえ"
  },
  "ko": {
    "multiple-screens": "다중 화면",
    "yes": "예",
    "no": "아니요"
  },
  "ru": {
    "multiple-screens": "Несколько экранов",
    "yes": "Да",
    "no": "Нет"
  },
  "pt": {
    "multiple-screens": "Múltiplas telas",
    "yes": "Sim",
    "no": "Não"
  },
  "ar": {
    "multiple-screens": "شاشات متعددة",
    "yes": "نعم",
    "no": "لا"
  },
  "hi": {
    "multiple-screens": "एकाधिक स्क्रीन",
    "yes": "हाँ",
    "no": "नहीं"
  },
  "tr": {
    "multiple-screens": "Birden Fazla Ekran",
    "yes": "Evet",
    "no": "Hayır"
  },
  "nl": {
    "multiple-screens": "Meerdere schermen",
    "yes": "Ja",
    "no": "Nee"
  },
  "sv": {
    "multiple-screens": "Flera skärmar",
    "yes": "Ja",
    "no": "Nej"
  },
  "pl": {
    "multiple-screens": "Wiele ekranów",
    "yes": "Tak",
    "no": "Nie"
  },
  "vi": {
    "multiple-screens": "Nhiều màn hình",
    "yes": "Có",
    "no": "Không"
  },
  "th": {
    "multiple-screens": "หลายหน้าจอ",
    "yes": "ใช่",
    "no": "ไม่"
  },
  "id": {
    "multiple-screens": "Beberapa Layar",
    "yes": "Ya",
    "no": "Tidak"
  },
  "he": {
    "multiple-screens": "מסכים מרובים",
    "yes": "כן",
    "no": "לא"
  },
  "ms": {
    "multiple-screens": "Berbilang Skrin",
    "yes": "Ya",
    "no": "Tidak"
  },
  "no": {
    "multiple-screens": "Flere skjermer",
    "yes": "Ja",
    "no": "Nei"
  }
}
</i18n>
