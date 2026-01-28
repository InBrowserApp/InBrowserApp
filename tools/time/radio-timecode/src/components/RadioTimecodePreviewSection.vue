<template>
  <n-flex vertical :size="6">
    <n-flex align="center" :size="12">
      <n-text depth="3">{{ t('timeNow') }}</n-text>
      <n-text>{{ stationTime }}</n-text>
    </n-flex>
    <n-flex align="center" :size="12">
      <n-text depth="3">{{ t('timezone') }}</n-text>
      <n-text>{{ timeZone }}</n-text>
    </n-flex>
    <n-flex align="center" :size="12">
      <n-text depth="3">{{ t('symbolNow') }}</n-text>
      <n-text>{{ currentSymbol }}</n-text>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  stationTime: string
  timeZone?: string
  currentSymbol: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "zh": {
    "timeNow": "台站时间",
    "timezone": "时区",
    "symbolNow": "当前符号"
  },
  "zh-CN": {
    "timeNow": "台站时间",
    "timezone": "时区",
    "symbolNow": "当前符号"
  },
  "zh-TW": {
    "timeNow": "台站時間",
    "timezone": "時區",
    "symbolNow": "目前符號"
  },
  "zh-HK": {
    "timeNow": "台站時間",
    "timezone": "時區",
    "symbolNow": "目前符號"
  },
  "es": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "fr": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "de": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "it": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "ja": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "ko": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "ru": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "pt": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "ar": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "hi": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "tr": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "nl": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "sv": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "pl": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "vi": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "th": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "id": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "he": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "ms": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  },
  "no": {
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol"
  }
}
</i18n>
