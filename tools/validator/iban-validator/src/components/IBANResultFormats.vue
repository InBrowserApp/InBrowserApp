<template>
  <NDescriptionsItem :label="t('normalized')">
    <NFlex align="center" :size="8">
      <NText code>{{ normalized }}</NText>
      <CopyToClipboardButton v-if="normalizedRaw" :content="normalizedRaw" size="small" />
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('formatted')">
    <NFlex align="center" :size="8">
      <NText code>{{ formatted }}</NText>
      <CopyToClipboardButton v-if="formattedRaw" :content="formattedRaw" size="small" />
    </NFlex>
  </NDescriptionsItem>
  <NDescriptionsItem :label="t('bban')">
    <NFlex align="center" :size="8">
      <NText code>{{ bban }}</NText>
      <CopyToClipboardButton v-if="bbanRaw" :content="bbanRaw" size="small" />
    </NFlex>
  </NDescriptionsItem>
</template>

<script setup lang="ts">
import { NDescriptionsItem, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  normalized: string
  normalizedRaw?: string | null
  formatted: string
  formattedRaw?: string | null
  bban: string
  bbanRaw?: string | null
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "normalized": "Normalized IBAN",
    "formatted": "Formatted IBAN",
    "bban": "BBAN"
  },
  "zh": {
    "normalized": "标准化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN"
  },
  "zh-CN": {
    "normalized": "标准化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN"
  },
  "zh-TW": {
    "normalized": "標準化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN"
  },
  "zh-HK": {
    "normalized": "標準化 IBAN",
    "formatted": "格式化 IBAN",
    "bban": "BBAN"
  },
  "es": {
    "normalized": "IBAN normalizado",
    "formatted": "IBAN formateado",
    "bban": "BBAN"
  },
  "fr": {
    "normalized": "IBAN normalisé",
    "formatted": "IBAN formaté",
    "bban": "BBAN"
  },
  "de": {
    "normalized": "Normalisierte IBAN",
    "formatted": "Formatierte IBAN",
    "bban": "BBAN"
  },
  "it": {
    "normalized": "IBAN normalizzato",
    "formatted": "IBAN formattato",
    "bban": "BBAN"
  },
  "ja": {
    "normalized": "正規化 IBAN",
    "formatted": "整形 IBAN",
    "bban": "BBAN"
  },
  "ko": {
    "normalized": "정규화된 IBAN",
    "formatted": "서식화된 IBAN",
    "bban": "BBAN"
  },
  "ru": {
    "normalized": "Нормализованный IBAN",
    "formatted": "Отформатированный IBAN",
    "bban": "BBAN"
  },
  "pt": {
    "normalized": "IBAN normalizado",
    "formatted": "IBAN formatado",
    "bban": "BBAN"
  },
  "ar": {
    "normalized": "IBAN القياسي",
    "formatted": "IBAN المنسق",
    "bban": "BBAN"
  },
  "hi": {
    "normalized": "मानकीकृत IBAN",
    "formatted": "स्वरूपित IBAN",
    "bban": "BBAN"
  },
  "tr": {
    "normalized": "Normalize edilmiş IBAN",
    "formatted": "Biçimlendirilmiş IBAN",
    "bban": "BBAN"
  },
  "nl": {
    "normalized": "Genormaliseerde IBAN",
    "formatted": "Geformatteerde IBAN",
    "bban": "BBAN"
  },
  "sv": {
    "normalized": "Normaliserad IBAN",
    "formatted": "Formaterad IBAN",
    "bban": "BBAN"
  },
  "pl": {
    "normalized": "Znormalizowany IBAN",
    "formatted": "Sformatowany IBAN",
    "bban": "BBAN"
  },
  "vi": {
    "normalized": "IBAN chuẩn hóa",
    "formatted": "IBAN định dạng",
    "bban": "BBAN"
  },
  "th": {
    "normalized": "IBAN มาตรฐาน",
    "formatted": "IBAN จัดรูปแบบ",
    "bban": "BBAN"
  },
  "id": {
    "normalized": "IBAN ternormalisasi",
    "formatted": "IBAN terformat",
    "bban": "BBAN"
  },
  "he": {
    "normalized": "IBAN מנורמל",
    "formatted": "IBAN מעוצב",
    "bban": "BBAN"
  },
  "ms": {
    "normalized": "IBAN dinormalkan",
    "formatted": "IBAN diformat",
    "bban": "BBAN"
  },
  "no": {
    "normalized": "Normalisert IBAN",
    "formatted": "Formatert IBAN",
    "bban": "BBAN"
  }
}
</i18n>
