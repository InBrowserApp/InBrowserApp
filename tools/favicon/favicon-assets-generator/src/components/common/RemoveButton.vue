<template>
  <n-button size="small" text @click="emits('click')">
    <template #icon>
      <n-icon :component="Icon" />
    </template>
    {{ t('remove') }}
  </n-button>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import Icon from '@vicons/fluent/Delete16Regular'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['click'])
</script>

<i18n lang="json">
{
  "en": {
    "remove": "Remove"
  },
  "zh": {
    "remove": "移除"
  },
  "zh-CN": {
    "remove": "移除"
  },
  "zh-TW": {
    "remove": "移除"
  },
  "zh-HK": {
    "remove": "移除"
  },
  "es": {
    "remove": "Eliminar"
  },
  "fr": {
    "remove": "Supprimer"
  },
  "de": {
    "remove": "Entfernen"
  },
  "it": {
    "remove": "Rimuovi"
  },
  "ja": {
    "remove": "削除"
  },
  "ko": {
    "remove": "제거"
  },
  "ru": {
    "remove": "Удалить"
  },
  "pt": {
    "remove": "Remover"
  },
  "ar": {
    "remove": "إزالة"
  },
  "hi": {
    "remove": "हटाएं"
  },
  "tr": {
    "remove": "Kaldır"
  },
  "nl": {
    "remove": "Verwijderen"
  },
  "sv": {
    "remove": "Ta bort"
  },
  "pl": {
    "remove": "Usuń"
  },
  "vi": {
    "remove": "Xóa"
  },
  "th": {
    "remove": "ลบ"
  },
  "id": {
    "remove": "Hapus"
  },
  "he": {
    "remove": "הסר"
  },
  "ms": {
    "remove": "Keluarkan"
  },
  "no": {
    "remove": "Fjern"
  }
}
</i18n>
