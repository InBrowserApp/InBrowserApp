<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" :wrap="true">
      <n-button @click="emit('swap')" secondary>
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
        {{ t('swap') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'

const emit = defineEmits<{
  (event: 'swap'): void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "swap": "Swap"
  },
  "zh": {
    "swap": "交换"
  },
  "zh-CN": {
    "swap": "交换"
  },
  "zh-TW": {
    "swap": "交換"
  },
  "zh-HK": {
    "swap": "交換"
  },
  "es": {
    "swap": "Intercambiar"
  },
  "fr": {
    "swap": "Inverser"
  },
  "de": {
    "swap": "Tauschen"
  },
  "it": {
    "swap": "Scambia"
  },
  "ja": {
    "swap": "入れ替え"
  },
  "ko": {
    "swap": "바꾸기"
  },
  "ru": {
    "swap": "Поменять"
  },
  "pt": {
    "swap": "Trocar"
  },
  "ar": {
    "swap": "تبديل"
  },
  "hi": {
    "swap": "अदला-बदली"
  },
  "tr": {
    "swap": "Değiştir"
  },
  "nl": {
    "swap": "Wisselen"
  },
  "sv": {
    "swap": "Byt"
  },
  "pl": {
    "swap": "Zamień"
  },
  "vi": {
    "swap": "Hoán đổi"
  },
  "th": {
    "swap": "สลับ"
  },
  "id": {
    "swap": "Tukar"
  },
  "he": {
    "swap": "החלפה"
  },
  "ms": {
    "swap": "Tukar"
  },
  "no": {
    "swap": "Bytt"
  }
}
</i18n>
