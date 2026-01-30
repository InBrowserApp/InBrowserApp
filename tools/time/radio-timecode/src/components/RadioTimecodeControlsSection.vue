<template>
  <n-flex vertical :size="12">
    <n-flex align="center" justify="space-between" :size="12">
      <n-select v-model:value="stationId" :options="stationOptions" style="min-width: 260px" />
      <n-flex :size="8">
        <n-button
          v-if="!isPlaying"
          type="primary"
          :loading="isStarting"
          :disabled="!audioAvailable || isStarting"
          @click="emit('start')"
        >
          <template #icon>
            <n-icon :component="PlayIcon" />
          </template>
          {{ t('start') }}
        </n-button>
        <n-button v-else type="error" @click="emit('stop')">
          <template #icon>
            <n-icon :component="StopIcon" />
          </template>
          {{ t('stop') }}
        </n-button>
      </n-flex>
    </n-flex>
    <n-alert v-if="!audioAvailable" type="error" :show-icon="false">
      {{ t('unsupported') }}
    </n-alert>
    <n-alert v-if="startError" type="error" :show-icon="false">
      {{ t('startFailed') }}
    </n-alert>
  </n-flex>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFlex, NIcon, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Regular'
import type { StationId } from '../core/encoders'

defineProps<{
  stationOptions: Array<{ label: string; value: StationId }>
  isPlaying: boolean
  isStarting: boolean
  audioAvailable: boolean
  startError: boolean
}>()

const emit = defineEmits<{ (event: 'start'): void; (event: 'stop'): void }>()

const stationId = defineModel<StationId>('stationId', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "zh": {
    "start": "开始",
    "stop": "停止",
    "unsupported": "当前浏览器不支持 AudioContext。",
    "startFailed": "音频启动失败，请检查浏览器权限后重试。"
  },
  "zh-CN": {
    "start": "开始",
    "stop": "停止",
    "unsupported": "当前浏览器不支持 AudioContext。",
    "startFailed": "音频启动失败，请检查浏览器权限后重试。"
  },
  "zh-TW": {
    "start": "開始",
    "stop": "停止",
    "unsupported": "目前瀏覽器不支援 AudioContext。",
    "startFailed": "音訊啟動失敗，請檢查瀏覽器權限後重試。"
  },
  "zh-HK": {
    "start": "開始",
    "stop": "停止",
    "unsupported": "目前瀏覽器不支援 AudioContext。",
    "startFailed": "音訊啟動失敗，請檢查瀏覽器權限後重試。"
  },
  "es": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "fr": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "de": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "it": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "ja": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "ko": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "ru": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "pt": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "ar": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "hi": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "tr": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "nl": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "sv": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "pl": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "vi": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "th": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "id": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "he": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "ms": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  },
  "no": {
    "start": "Start",
    "stop": "Stop",
    "unsupported": "AudioContext is not supported in this browser.",
    "startFailed": "Audio output failed to start. Check browser permissions and try again."
  }
}
</i18n>
