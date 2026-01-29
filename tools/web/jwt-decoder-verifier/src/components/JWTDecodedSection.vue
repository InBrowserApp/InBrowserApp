<template>
  <ToolSectionHeader v-if="decodedPayload">{{ t('decoded') }}</ToolSectionHeader>
  <ToolSection v-if="decodedPayload">
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-h3>{{ t('payload') }}</n-h3>
        <JWTJsonCard :json="decodedPayload" />
      </n-gi>
      <n-gi>
        <n-h3>{{ t('header') }}</n-h3>
        <JWTJsonCard :json="decodedHeader" />
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NH3 } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import JWTJsonCard from './JWTJsonCard.vue'

defineProps<{
  decodedPayload: object | null
  decodedHeader: object | null
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "zh": {
    "decoded": "解码结果",
    "header": "Header",
    "payload": "Payload"
  },
  "zh-CN": {
    "decoded": "解码结果",
    "header": "Header",
    "payload": "Payload"
  },
  "zh-TW": {
    "decoded": "解碼結果",
    "header": "Header",
    "payload": "Payload"
  },
  "zh-HK": {
    "decoded": "解碼結果",
    "header": "Header",
    "payload": "Payload"
  },
  "es": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "fr": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "de": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "it": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "ja": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "ko": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "ru": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "pt": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "ar": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "hi": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "tr": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "nl": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "sv": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "pl": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "vi": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "th": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "id": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "he": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "ms": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  },
  "no": {
    "decoded": "Decoded",
    "header": "Header",
    "payload": "Payload"
  }
}
</i18n>
