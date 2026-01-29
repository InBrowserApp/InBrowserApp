<template>
  <NTag :type="isValid ? 'success' : 'error'" size="small">
    {{ isValid ? t('valid') : t('invalid') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isValid: boolean
}>()
</script>

<i18n lang="json">
{
  "en": {
    "valid": "Valid",
    "invalid": "Invalid"
  },
  "zh": {
    "valid": "有效",
    "invalid": "无效"
  },
  "zh-CN": {
    "valid": "有效",
    "invalid": "无效"
  },
  "zh-TW": {
    "valid": "有效",
    "invalid": "無效"
  },
  "zh-HK": {
    "valid": "有效",
    "invalid": "無效"
  },
  "es": {
    "valid": "Válido",
    "invalid": "Inválido"
  },
  "fr": {
    "valid": "Valide",
    "invalid": "Invalide"
  },
  "de": {
    "valid": "Gültig",
    "invalid": "Ungültig"
  },
  "it": {
    "valid": "Valido",
    "invalid": "Non valido"
  },
  "ja": {
    "valid": "有効",
    "invalid": "無効"
  },
  "ko": {
    "valid": "유효",
    "invalid": "유효하지 않음"
  },
  "ru": {
    "valid": "Действителен",
    "invalid": "Недействителен"
  },
  "pt": {
    "valid": "Válido",
    "invalid": "Inválido"
  },
  "ar": {
    "valid": "صالح",
    "invalid": "غير صالح"
  },
  "hi": {
    "valid": "मान्य",
    "invalid": "अमान्य"
  },
  "tr": {
    "valid": "Geçerli",
    "invalid": "Geçersiz"
  },
  "nl": {
    "valid": "Geldig",
    "invalid": "Ongeldig"
  },
  "sv": {
    "valid": "Giltig",
    "invalid": "Ogiltig"
  },
  "pl": {
    "valid": "Prawidłowy",
    "invalid": "Nieprawidłowy"
  },
  "vi": {
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ"
  },
  "th": {
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง"
  },
  "id": {
    "valid": "Valid",
    "invalid": "Tidak valid"
  },
  "he": {
    "valid": "תקין",
    "invalid": "לא תקין"
  },
  "ms": {
    "valid": "Sah",
    "invalid": "Tidak sah"
  },
  "no": {
    "valid": "Gyldig",
    "invalid": "Ugyldig"
  }
}
</i18n>
