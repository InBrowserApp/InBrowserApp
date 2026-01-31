<template>
  <NText depth="3">{{ countryDisplay }}</NText>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { VATValidationResult } from '../data/vat'

const props = defineProps<{
  validationResult: VATValidationResult
}>()

const { t, locale } = useI18n()

const displayNames = computed(() => {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') return null

  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' })
  } catch {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  }
})

const countryRegionCode = computed(() => {
  const code = props.validationResult.countryCode
  if (!code) return null
  return code === 'EL' ? 'GR' : code
})

const countryName = computed(() => {
  const code = countryRegionCode.value
  if (!code || !props.validationResult.isCountryCodeValid || !displayNames.value) return null
  return displayNames.value.of(code) ?? null
})

const countryDisplay = computed(() => {
  const resolvedName = countryName.value
  const code = props.validationResult.countryCode
  if (!code) return t('notAvailable')
  if (!props.validationResult.isCountryCodeValid) return code
  if (resolvedName) return `${resolvedName} (${code})`
  return code
})
</script>

<i18n lang="json">
{
  "en": {
    "notAvailable": "Not available"
  },
  "zh": {
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "notAvailable": "不可用"
  },
  "es": {
    "notAvailable": "No disponible"
  },
  "fr": {
    "notAvailable": "Non disponible"
  },
  "de": {
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "notAvailable": "利用不可"
  },
  "ko": {
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "notAvailable": "Недоступно"
  },
  "pt": {
    "notAvailable": "Não disponível"
  },
  "ar": {
    "notAvailable": "غير متاح"
  },
  "hi": {
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "notAvailable": "Inte tillgänglig"
  },
  "pl": {
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "notAvailable": "Không có sẵn"
  },
  "th": {
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "notAvailable": "לא זמין"
  },
  "ms": {
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
