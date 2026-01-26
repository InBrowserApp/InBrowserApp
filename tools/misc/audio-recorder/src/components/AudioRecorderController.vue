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
            @click="startRecording"
          >
            <template #icon>
              <n-icon :component="RecordIcon" />
            </template>
            {{ t('record') }}
          </n-button>
          <n-button v-else-if="isPaused" type="primary" @click="resumeRecording">
            <template #icon>
              <n-icon :component="PlayIcon" />
            </template>
            {{ t('resume') }}
          </n-button>
          <n-button v-else type="warning" @click="pauseRecording">
            <template #icon>
              <n-icon :component="PauseIcon" />
            </template>
            {{ t('pause') }}
          </n-button>
          <n-button v-if="isRecording" type="error" @click="stopRecording">
            <template #icon>
              <n-icon :component="StopIcon" />
            </template>
            {{ t('stop') }}
          </n-button>
          <n-button v-if="permissionDenied" tertiary @click="startRecording">
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

  <template v-if="recordingBlob">
    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <audio class="audio-player" :src="recordingUrl" controls />

        <n-grid :cols="2" :x-gap="16" :y-gap="8">
          <n-gi>
            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('format') }}</n-text>
              <n-text>{{ displayMimeType }}</n-text>
            </n-flex>
          </n-gi>
          <n-gi>
            <n-flex vertical :size="4">
              <n-text depth="3">{{ t('fileSize') }}</n-text>
              <n-text>{{ fileSizeLabel }}</n-text>
            </n-flex>
          </n-gi>
        </n-grid>

        <n-flex align="center" :size="8" class="filename-row">
          <n-text depth="3">{{ t('fileName') }}</n-text>
          <n-input v-model:value="fileName" :placeholder="t('fileNamePlaceholder')" />
          <n-text>.{{ fileExtension }}</n-text>
        </n-flex>

        <n-flex :size="8">
          <n-button tag="a" type="primary" :href="recordingUrl" :download="downloadName">
            <template #icon>
              <n-icon :component="DownloadIcon" />
            </template>
            {{ t('download') }}
          </n-button>
          <n-button tertiary @click="clearRecording">
            <template #icon>
              <n-icon :component="ClearIcon" />
            </template>
            {{ t('clear') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </template>

  <ToolSectionHeader>{{ t('notes') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="6">
      <n-text>{{ t('offlineNote') }}</n-text>
      <n-text>{{ t('formatNote') }}</n-text>
      <n-text>{{ t('permissionNote') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NButton, NFlex, NGi, NGrid, NIcon, NInput, NTag, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import RecordIcon from '@vicons/fluent/Record16Filled'
import PauseIcon from '@vicons/fluent/Pause16Filled'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Filled'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Filled'
import ClearIcon from '@vicons/fluent/Delete16Regular'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedMimeType,
} from '../utils/recorder'

const { t } = useI18n()

const permissionDenied = ref(false)
const errorMessage = ref('')
const isPreparing = ref(false)

const recorderState = ref<'inactive' | 'recording' | 'paused'>('inactive')
const mediaStream = ref<MediaStream | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordingBlob = ref<Blob | null>(null)
const mimeType = ref('')
const fileName = ref('')
const elapsedMs = ref(0)

const recordingUrl = useObjectUrl(recordingBlob)

let timer: number | null = null
let startTimestamp = 0
const recordedChunks: Blob[] = []

const isSupported = computed(
  () =>
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined',
)

const isRecording = computed(() => recorderState.value !== 'inactive')
const isPaused = computed(() => recorderState.value === 'paused')

const statusLabel = computed(() => {
  if (isRecording.value) {
    return isPaused.value ? t('statusPaused') : t('statusRecording')
  }
  return t('statusIdle')
})

const statusType = computed(() => {
  if (isPaused.value) return 'warning'
  if (isRecording.value) return 'success'
  return 'default'
})

const formattedDuration = computed(() => formatDuration(elapsedMs.value))
const fileExtension = computed(() => getExtensionForMimeType(mimeType.value))
const displayMimeType = computed(() => mimeType.value || t('formatUnknown'))
const fileSizeLabel = computed(() =>
  recordingBlob.value ? formatFileSize(recordingBlob.value.size) : '0 B',
)
const downloadName = computed(() => {
  const base = fileName.value.trim() || t('fileNamePlaceholder')
  return `${base}.${fileExtension.value}`
})

function defaultFileName() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `recording-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

function startTimer() {
  stopTimer()
  startTimestamp = Date.now() - elapsedMs.value
  timer = window.setInterval(() => {
    elapsedMs.value = Date.now() - startTimestamp
  }, 200)
}

function stopTimer() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function cleanupStream() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop())
    mediaStream.value = null
  }
}

function attachRecorderEvents(recorder: MediaRecorder) {
  recorder.onstart = () => {
    recorderState.value = 'recording'
    elapsedMs.value = 0
    startTimer()
  }
  recorder.onpause = () => {
    recorderState.value = 'paused'
    stopTimer()
  }
  recorder.onresume = () => {
    recorderState.value = 'recording'
    startTimer()
  }
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) recordedChunks.push(event.data)
  }
  recorder.onstop = () => {
    recorderState.value = 'inactive'
    stopTimer()
    const blob = new Blob(recordedChunks, { type: recorder.mimeType || mimeType.value })
    recordingBlob.value = blob
    mimeType.value = blob.type || recorder.mimeType || mimeType.value
    mediaRecorder.value = null
    cleanupStream()
  }
}

async function startRecording() {
  if (!isSupported.value || isPreparing.value) return
  if (isRecording.value) return
  permissionDenied.value = false
  errorMessage.value = ''
  isPreparing.value = true
  recordedChunks.length = 0
  recordingBlob.value = null
  mimeType.value = ''
  elapsedMs.value = 0

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStream.value = stream
    const supportedMimeType = getSupportedMimeType(MediaRecorder.isTypeSupported)
    const options = supportedMimeType ? { mimeType: supportedMimeType } : undefined
    let recorder: MediaRecorder
    try {
      recorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream)
    } catch {
      recorder = new MediaRecorder(stream)
    }
    mediaRecorder.value = recorder
    mimeType.value = recorder.mimeType || supportedMimeType
    fileName.value = defaultFileName()
    attachRecorderEvents(recorder)
    recorder.start(1000)
  } catch (err) {
    cleanupStream()
    if (
      err instanceof Error &&
      (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
    ) {
      permissionDenied.value = true
    } else {
      errorMessage.value = t('recordingFailed')
    }
  } finally {
    isPreparing.value = false
  }
}

function pauseRecording() {
  if (!mediaRecorder.value || mediaRecorder.value.state !== 'recording') return
  mediaRecorder.value.pause()
}

function resumeRecording() {
  if (!mediaRecorder.value || mediaRecorder.value.state !== 'paused') return
  mediaRecorder.value.resume()
}

function stopRecording() {
  if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') return
  mediaRecorder.value.stop()
}

function clearRecording() {
  recordingBlob.value = null
  mimeType.value = ''
  fileName.value = ''
  elapsedMs.value = 0
}

onBeforeUnmount(() => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  cleanupStream()
  stopTimer()
})
</script>

<style scoped>
.audio-player {
  width: 100%;
}

.filename-row :deep(.n-input) {
  flex: 1;
}
</style>

<i18n lang="json">
{
  "en": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "zh": {
    "controls": "控制",
    "output": "输出",
    "notes": "说明",
    "record": "录制",
    "pause": "暂停",
    "resume": "继续",
    "stop": "停止",
    "status": "状态",
    "statusIdle": "空闲",
    "statusRecording": "录制中",
    "statusPaused": "已暂停",
    "duration": "时长",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "文件名",
    "fileNamePlaceholder": "录音",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "notSupported": "当前浏览器不支持录音。",
    "permissionDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "recordingFailed": "无法开始录音。",
    "offlineNote": "仅使用本地麦克风（离线）。",
    "formatNote": "输出格式取决于浏览器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "弹出提示时请允许麦克风访问。"
  },
  "zh-CN": {
    "controls": "控制",
    "output": "输出",
    "notes": "说明",
    "record": "录制",
    "pause": "暂停",
    "resume": "继续",
    "stop": "停止",
    "status": "状态",
    "statusIdle": "空闲",
    "statusRecording": "录制中",
    "statusPaused": "已暂停",
    "duration": "时长",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "文件名",
    "fileNamePlaceholder": "录音",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "notSupported": "当前浏览器不支持录音。",
    "permissionDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "recordingFailed": "无法开始录音。",
    "offlineNote": "仅使用本地麦克风（离线）。",
    "formatNote": "输出格式取决于浏览器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "弹出提示时请允许麦克风访问。"
  },
  "zh-TW": {
    "controls": "控制",
    "output": "輸出",
    "notes": "說明",
    "record": "錄製",
    "pause": "暫停",
    "resume": "繼續",
    "stop": "停止",
    "status": "狀態",
    "statusIdle": "空閒",
    "statusRecording": "錄製中",
    "statusPaused": "已暫停",
    "duration": "時長",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "檔案名稱",
    "fileNamePlaceholder": "錄音",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "notSupported": "目前瀏覽器不支援錄音。",
    "permissionDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "recordingFailed": "無法開始錄音。",
    "offlineNote": "僅使用本機麥克風（離線）。",
    "formatNote": "輸出格式取決於瀏覽器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "出現提示時請允許麥克風存取。"
  },
  "zh-HK": {
    "controls": "控制",
    "output": "輸出",
    "notes": "說明",
    "record": "錄製",
    "pause": "暫停",
    "resume": "繼續",
    "stop": "停止",
    "status": "狀態",
    "statusIdle": "空閒",
    "statusRecording": "錄製中",
    "statusPaused": "已暫停",
    "duration": "時長",
    "format": "格式",
    "formatUnknown": "未知",
    "fileName": "檔案名稱",
    "fileNamePlaceholder": "錄音",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "notSupported": "目前瀏覽器不支援錄音。",
    "permissionDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "recordingFailed": "無法開始錄音。",
    "offlineNote": "僅使用本機麥克風（離線）。",
    "formatNote": "輸出格式取決於瀏覽器（WebM/Opus、OGG 或 M4A）。",
    "permissionNote": "出現提示時請允許麥克風存取。"
  },
  "es": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "fr": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "de": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "it": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ja": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ko": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ru": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "pt": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ar": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "hi": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "tr": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "nl": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "sv": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "pl": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "vi": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "th": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "id": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "he": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "ms": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  },
  "no": {
    "controls": "Controls",
    "output": "Output",
    "notes": "Notes",
    "record": "Record",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "status": "Status",
    "statusIdle": "Idle",
    "statusRecording": "Recording",
    "statusPaused": "Paused",
    "duration": "Duration",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileName": "File name",
    "fileNamePlaceholder": "recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notSupported": "Audio recording is not supported in this browser.",
    "permissionDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "offlineNote": "Uses your local microphone only (offline).",
    "formatNote": "Output format depends on the browser (WebM/Opus, OGG, or M4A).",
    "permissionNote": "Allow microphone access when prompted."
  }
}
</i18n>
