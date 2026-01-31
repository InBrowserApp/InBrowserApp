<template>
  <NFlex align="center" :size="8">
    <NText code>{{ branchCodeDisplay }}</NText>
    <CopyToClipboardButton v-if="branchCopyValue" :content="branchCopyValue" size="small" />
  </NFlex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { BICValidationResult } from '../data/bic'

const props = defineProps<{
  type: BICValidationResult['type']
  branchCode?: string | null
}>()

const { t } = useI18n()

const branchCodeDisplay = computed(() => {
  if (props.type === 'bic-8') return 'XXX'
  return props.branchCode || t('notAvailable')
})

const branchCopyValue = computed(() => {
  if (props.type === 'bic-8') return 'XXX'
  return props.branchCode || ''
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
    "notAvailable": "사용 불가"
  },
  "ru": {
    "notAvailable": "Недоступно"
  },
  "pt": {
    "notAvailable": "Não disponível"
  },
  "ar": {
    "notAvailable": "غير متوفر"
  },
  "hi": {
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "notAvailable": "Kullanılamaz"
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
    "notAvailable": "Không có"
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
