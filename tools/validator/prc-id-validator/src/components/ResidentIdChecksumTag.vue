<template>
  <NTag :type="isChecksumValid ? 'success' : 'error'" size="small">
    {{ isChecksumValid ? t('pass') : t('fail') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  isChecksumValid: boolean
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "pass": "Pass",
    "fail": "Fail"
  },
  "zh": {
    "pass": "通过",
    "fail": "失败"
  },
  "zh-CN": {
    "pass": "通过",
    "fail": "失败"
  },
  "zh-TW": {
    "pass": "通過",
    "fail": "失敗"
  },
  "zh-HK": {
    "pass": "通過",
    "fail": "失敗"
  },
  "es": {
    "pass": "Correcto",
    "fail": "Falló"
  },
  "fr": {
    "pass": "Réussi",
    "fail": "Échec"
  },
  "de": {
    "pass": "Bestanden",
    "fail": "Fehlgeschlagen"
  },
  "it": {
    "pass": "Superato",
    "fail": "Fallito"
  },
  "ja": {
    "pass": "合格",
    "fail": "失敗"
  },
  "ko": {
    "pass": "통과",
    "fail": "실패"
  },
  "ru": {
    "pass": "Пройдено",
    "fail": "Не пройдено"
  },
  "pt": {
    "pass": "Aprovado",
    "fail": "Reprovado"
  },
  "ar": {
    "pass": "نجاح",
    "fail": "فشل"
  },
  "hi": {
    "pass": "पास",
    "fail": "फेल"
  },
  "tr": {
    "pass": "Geçti",
    "fail": "Başarısız"
  },
  "nl": {
    "pass": "Geslaagd",
    "fail": "Mislukt"
  },
  "sv": {
    "pass": "Godkänd",
    "fail": "Misslyckades"
  },
  "pl": {
    "pass": "Zaliczone",
    "fail": "Nieudane"
  },
  "vi": {
    "pass": "Đạt",
    "fail": "Không đạt"
  },
  "th": {
    "pass": "ผ่าน",
    "fail": "ไม่ผ่าน"
  },
  "id": {
    "pass": "Lulus",
    "fail": "Gagal"
  },
  "he": {
    "pass": "עבר",
    "fail": "נכשל"
  },
  "ms": {
    "pass": "Lulus",
    "fail": "Gagal"
  },
  "no": {
    "pass": "Bestått",
    "fail": "Feilet"
  }
}
</i18n>
