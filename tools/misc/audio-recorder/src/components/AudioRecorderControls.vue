<template>
  <ToolSectionHeader>{{ t('controls') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert v-if="!isSupported" type="warning" :show-icon="false">
        {{ t('notSupported') }}
      </n-alert>
      <template v-else>
        <n-alert v-if="permissionDenied" type="error" :show-icon="false">
          {{ t('permissionDenied') }}
        </n-alert>
        <n-alert v-else-if="errorMessage" type="error" :show-icon="false">
          {{ errorMessage }}
        </n-alert>

        <n-flex align="center" :size="8">
          <n-button
            v-if="!isRecording"
            type="error"
            :loading="isPreparing"
            :disabled="isPreparing"
            @click="onStart"
          >
            <template #icon>
              <n-icon :component="RecordIcon" />
            </template>
            {{ t('record') }}
          </n-button>
          <n-button v-else-if="isPaused" type="primary" @click="onResume">
            <template #icon>
              <n-icon :component="PlayIcon" />
            </template>
            {{ t('resume') }}
          </n-button>
          <n-button v-else type="warning" @click="onPause">
            <template #icon>
              <n-icon :component="PauseIcon" />
            </template>
            {{ t('pause') }}
          </n-button>
          <n-button v-if="isRecording" type="error" @click="onStop">
            <template #icon>
              <n-icon :component="StopIcon" />
            </template>
            {{ t('stop') }}
          </n-button>
          <n-button v-if="permissionDenied" tertiary @click="onStart">
            {{ t('retryPermission') }}
          </n-button>
        </n-flex>

        <n-flex align="center" :size="12">
          <n-text depth="3">{{ t('status') }}</n-text>
          <n-tag :type="statusType">{{ statusLabel }}</n-tag>
          <n-text depth="3">{{ t('duration') }}</n-text>
          <n-text>{{ formattedDuration }}</n-text>
        </n-flex>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NIcon, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import RecordIcon from '@vicons/fluent/Record16Filled'
import PauseIcon from '@vicons/fluent/Pause16Filled'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Filled'

const props = defineProps<{
  isSupported: boolean
  permissionDenied: boolean
  errorMessage: string
  isPreparing: boolean
  isRecording: boolean
  isPaused: boolean
  formattedDuration: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}>()

const { t } = useI18n({ useScope: 'local' })

const statusLabel = computed(() => {
  if (props.isRecording) {
    return props.isPaused ? t('statusPaused') : t('statusRecording')
  }
  return t('statusIdle')
})

const statusType = computed(() => {
  if (props.isPaused) return 'warning'
  if (props.isRecording) return 'success'
  return 'default'
})
</script>

<i18n lang="json">
{
  "en": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "zh": {
    "controls": "控制",
    "record": "录制",
    "pause": "暂停",
    "resume": "继续",
    "stop": "停止",
    "status": "状态",
    "statusIdle": "空闲",
    "statusRecording": "录制中",
    "statusPaused": "已暂停",
    "duration": "时长",
    "notSupported": "当前浏览器不支持录音。",
    "permissionDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试"
  },
  "zh-CN": {
    "controls": "控制",
    "record": "录制",
    "pause": "暂停",
    "resume": "继续",
    "stop": "停止",
    "status": "状态",
    "statusIdle": "空闲",
    "statusRecording": "录制中",
    "statusPaused": "已暂停",
    "duration": "时长",
    "notSupported": "当前浏览器不支持录音。",
    "permissionDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试"
  },
  "zh-TW": {
    "controls": "控制",
    "record": "錄製",
    "pause": "暫停",
    "resume": "繼續",
    "stop": "停止",
    "status": "狀態",
    "statusIdle": "空閒",
    "statusRecording": "錄製中",
    "statusPaused": "已暫停",
    "duration": "時長",
    "notSupported": "目前瀏覽器不支援錄音。",
    "permissionDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試"
  },
  "zh-HK": {
    "controls": "控制",
    "record": "錄製",
    "pause": "暫停",
    "resume": "繼續",
    "stop": "停止",
    "status": "狀態",
    "statusIdle": "空閒",
    "statusRecording": "錄製中",
    "statusPaused": "已暫停",
    "duration": "時長",
    "notSupported": "目前瀏覽器不支援錄音。",
    "permissionDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試"
  },
  "es": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "fr": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "de": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "it": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "ja": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "ko": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "ru": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "pt": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "ar": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "hi": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "tr": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "nl": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "sv": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "pl": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "vi": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "th": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "id": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "he": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "ms": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  },
  "no": {
    "controls": "Controls",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry"
  }
}
</i18n>
