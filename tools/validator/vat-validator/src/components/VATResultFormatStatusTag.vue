<template>
  <NTag :type="isFormatValid ? 'success' : 'error'" size="small">
    {{ isFormatValid ? t('pass') : t('fail') }}
  </NTag>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isFormatValid: boolean
}>()
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
    "pass": "Aprobado",
    "fail": "Fallido"
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
    "fail": "不合格"
  },
  "ko": {
    "pass": "통과",
    "fail": "실패"
  },
  "ru": {
    "pass": "Пройдено",
    "fail": "Ошибка"
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
    "fail": "Kaldı"
  },
  "nl": {
    "pass": "Geslaagd",
    "fail": "Mislukt"
  },
  "sv": {
    "pass": "Godkänd",
    "fail": "Underkänd"
  },
  "pl": {
    "pass": "Zaliczony",
    "fail": "Nieudany"
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
    "fail": "Ikke bestått"
  }
}
</i18n>
