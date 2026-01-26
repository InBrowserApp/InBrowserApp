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
        <n-alert v-else-if="microphoneDenied" type="error" :show-icon="false">
          {{ t('microphoneDenied') }}
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
          <n-button v-if="permissionDenied || microphoneDenied" tertiary @click="startRecording">
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

  <ToolSectionHeader>{{ t('settings') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="10">
      <n-flex align="center" :size="8" class="setting-row">
        <n-text depth="3">{{ t('systemAudio') }}</n-text>
        <n-switch v-model:value="includeSystemAudio" :disabled="settingsDisabled" />
      </n-flex>
      <n-flex align="center" :size="8" class="setting-row">
        <n-text depth="3">{{ t('microphone') }}</n-text>
        <n-switch
          v-model:value="includeMicrophone"
          :disabled="settingsDisabled || !isMicSupported"
        />
      </n-flex>
      <n-flex align="center" :size="8" class="setting-row">
        <n-text depth="3">{{ t('cursor') }}</n-text>
        <n-select
          v-model:value="cursorMode"
          :options="cursorOptions"
          :disabled="settingsDisabled"
          class="cursor-select"
        />
      </n-flex>
    </n-flex>
  </ToolSection>

  <template v-if="recordingBlob">
    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <video class="video-player" :src="recordingUrl" controls />

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
      <n-text>{{ t('sourceNote') }}</n-text>
      <n-text>{{ t('audioNote') }}</n-text>
      <n-text>{{ t('permissionNote') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NFlex,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NSelect,
  NSwitch,
  NTag,
  NText,
} from 'naive-ui'
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
const microphoneDenied = ref(false)
const errorMessage = ref('')
const isPreparing = ref(false)

const includeSystemAudio = ref(true)
const includeMicrophone = ref(false)
const cursorMode = ref<'always' | 'motion' | 'never'>('always')

const recorderState = ref<'inactive' | 'recording' | 'paused'>('inactive')
const displayStream = ref<MediaStream | null>(null)
const microphoneStream = ref<MediaStream | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordingBlob = ref<Blob | null>(null)
const mimeType = ref('')
const fileName = ref('')
const elapsedMs = ref(0)

const recordingUrl = useObjectUrl(recordingBlob)

let timer: number | null = null
let startTimestamp = 0
let audioContext: AudioContext | null = null
let audioSources: MediaStreamAudioSourceNode[] = []
const recordedChunks: Blob[] = []
const screenPermissionErrors = ['NotAllowedError', 'PermissionDeniedError', 'AbortError'] as const
const microphonePermissionErrors = ['NotAllowedError', 'PermissionDeniedError'] as const

const isSupported = computed(
  () =>
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia &&
    typeof MediaRecorder !== 'undefined',
)

const isMicSupported = computed(
  () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
)

const isRecording = computed(() => recorderState.value !== 'inactive')
const isPaused = computed(() => recorderState.value === 'paused')
const settingsDisabled = computed(() => isRecording.value || isPreparing.value)

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

const cursorOptions = computed(() => [
  { label: t('cursorAlways'), value: 'always' },
  { label: t('cursorMotion'), value: 'motion' },
  { label: t('cursorNever'), value: 'never' },
])

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
  return `screen-recording-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
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

function stopStream(stream: MediaStream | null) {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}

function cleanupAudioContext() {
  if (audioContext) {
    audioSources.forEach((source) => source.disconnect())
    audioSources = []
    audioContext.close()
    audioContext = null
  }
}

function cleanupStreams() {
  stopStream(displayStream.value)
  stopStream(microphoneStream.value)
  displayStream.value = null
  microphoneStream.value = null
  cleanupAudioContext()
}

function pickAudioTrack(tracks: MediaStreamTrack[]) {
  if (tracks.length === 0) return null
  if (tracks.length === 1) return tracks[0]

  const context = new AudioContext()
  const destination = context.createMediaStreamDestination()
  audioContext = context
  audioSources = tracks.map((track) => {
    const source = context.createMediaStreamSource(new MediaStream([track]))
    source.connect(destination)
    return source
  })
  return destination.stream.getAudioTracks()[0] ?? null
}

function isNamedError(err: unknown, names: readonly string[]) {
  return err instanceof Error && names.includes(err.name)
}

function attachRecorderEvents(recorder: MediaRecorder, nextMimeType: string) {
  recorder.onstart = () => {
    recorderState.value = 'recording'
    recordingBlob.value = null
    fileName.value = defaultFileName()
    mimeType.value = nextMimeType
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
    const blobType = recorder.mimeType || nextMimeType || mimeType.value
    const blob = new Blob(recordedChunks, { type: blobType })
    recordingBlob.value = blob
    mimeType.value = blob.type || blobType
    mediaRecorder.value = null
    recordedChunks.length = 0
    cleanupStreams()
  }
}

async function startRecording() {
  if (!isSupported.value || isPreparing.value) return
  if (isRecording.value) return
  permissionDenied.value = false
  microphoneDenied.value = false
  errorMessage.value = ''
  isPreparing.value = true
  recordedChunks.length = 0

  if (includeMicrophone.value && !isMicSupported.value) {
    errorMessage.value = t('microphoneNotSupported')
    isPreparing.value = false
    return
  }

  try {
    const videoConstraints = { cursor: cursorMode.value } as MediaTrackConstraints
    const display = await navigator.mediaDevices.getDisplayMedia({
      video: videoConstraints,
      audio: includeSystemAudio.value,
    })
    displayStream.value = display

    const videoTrack = display.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.addEventListener('ended', () => {
        stopRecording()
      })
    }

    let mic: MediaStream | null = null
    if (includeMicrophone.value) {
      try {
        mic = await navigator.mediaDevices.getUserMedia({ audio: true })
        microphoneStream.value = mic
      } catch (err) {
        cleanupStreams()
        if (isNamedError(err, microphonePermissionErrors)) {
          microphoneDenied.value = true
        } else {
          errorMessage.value = t('recordingFailed')
        }
        return
      }
    }

    const recordingStream = new MediaStream()
    display.getVideoTracks().forEach((track) => recordingStream.addTrack(track))
    const audioTracks = [...display.getAudioTracks(), ...(mic ? mic.getAudioTracks() : [])]
    const mixedTrack = pickAudioTrack(audioTracks)
    if (mixedTrack) recordingStream.addTrack(mixedTrack)

    const supportedMimeType = getSupportedMimeType(MediaRecorder.isTypeSupported)
    const options = supportedMimeType ? { mimeType: supportedMimeType } : undefined
    let recorder: MediaRecorder
    try {
      recorder = options
        ? new MediaRecorder(recordingStream, options)
        : new MediaRecorder(recordingStream)
    } catch {
      recorder = new MediaRecorder(recordingStream)
    }
    mediaRecorder.value = recorder
    const nextMimeType = recorder.mimeType || supportedMimeType
    attachRecorderEvents(recorder, nextMimeType)
    recorder.start(1000)
  } catch (err) {
    cleanupStreams()
    if (isNamedError(err, screenPermissionErrors)) {
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
  cleanupStreams()
  stopTimer()
})
</script>

<style scoped>
.video-player {
  width: 100%;
}

.filename-row :deep(.n-input) {
  flex: 1;
}

.setting-row {
  justify-content: space-between;
}

.cursor-select {
  width: 200px;
}
</style>

<i18n lang="json">
{
  "en": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "zh": {
    "controls": "控制",
    "settings": "设置",
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
    "fileNamePlaceholder": "屏幕录制",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "systemAudio": "系统声音",
    "microphone": "麦克风",
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "cursor": "鼠标光标",
    "cursorAlways": "始终显示",
    "cursorMotion": "移动时显示",
    "cursorNever": "隐藏",
    "notSupported": "当前浏览器不支持屏幕录制。",
    "permissionDenied": "屏幕权限被拒绝，请允许共享屏幕。",
    "microphoneDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "recordingFailed": "无法开始录制。",
    "sourceNote": "使用浏览器屏幕共享录制屏幕、窗口或标签页（离线）。",
    "audioNote": "系统声音取决于浏览器支持情况；可单独加入麦克风。",
    "permissionNote": "弹出提示时请允许屏幕共享与麦克风访问。"
  },
  "zh-CN": {
    "controls": "控制",
    "settings": "设置",
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
    "fileNamePlaceholder": "屏幕录制",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "systemAudio": "系统声音",
    "microphone": "麦克风",
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "cursor": "鼠标光标",
    "cursorAlways": "始终显示",
    "cursorMotion": "移动时显示",
    "cursorNever": "隐藏",
    "notSupported": "当前浏览器不支持屏幕录制。",
    "permissionDenied": "屏幕权限被拒绝，请允许共享屏幕。",
    "microphoneDenied": "麦克风权限被拒绝，请允许访问。",
    "retryPermission": "重试",
    "recordingFailed": "无法开始录制。",
    "sourceNote": "使用浏览器屏幕共享录制屏幕、窗口或标签页（离线）。",
    "audioNote": "系统声音取决于浏览器支持情况；可单独加入麦克风。",
    "permissionNote": "弹出提示时请允许屏幕共享与麦克风访问。"
  },
  "zh-TW": {
    "controls": "控制",
    "settings": "設定",
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
    "fileNamePlaceholder": "螢幕錄製",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "systemAudio": "系統聲音",
    "microphone": "麥克風",
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "cursor": "滑鼠游標",
    "cursorAlways": "始終顯示",
    "cursorMotion": "移動時顯示",
    "cursorNever": "隱藏",
    "notSupported": "目前瀏覽器不支援螢幕錄製。",
    "permissionDenied": "螢幕權限被拒絕，請允許共享螢幕。",
    "microphoneDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "recordingFailed": "無法開始錄製。",
    "sourceNote": "使用瀏覽器螢幕共享錄製螢幕、視窗或分頁（離線）。",
    "audioNote": "系統聲音取決於瀏覽器支援；可單獨加入麥克風。",
    "permissionNote": "出現提示時請允許螢幕共享與麥克風存取。"
  },
  "zh-HK": {
    "controls": "控制",
    "settings": "設定",
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
    "fileNamePlaceholder": "螢幕錄製",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "systemAudio": "系統聲音",
    "microphone": "麥克風",
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "cursor": "滑鼠游標",
    "cursorAlways": "始終顯示",
    "cursorMotion": "移動時顯示",
    "cursorNever": "隱藏",
    "notSupported": "目前瀏覽器不支援螢幕錄製。",
    "permissionDenied": "螢幕權限被拒絕，請允許共享螢幕。",
    "microphoneDenied": "麥克風權限被拒絕，請允許存取。",
    "retryPermission": "重試",
    "recordingFailed": "無法開始錄製。",
    "sourceNote": "使用瀏覽器螢幕共享錄製螢幕、視窗或分頁（離線）。",
    "audioNote": "系統聲音取決於瀏覽器支援；可單獨加入麥克風。",
    "permissionNote": "出現提示時請允許螢幕共享與麥克風存取。"
  },
  "es": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "fr": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "de": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "it": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ja": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ko": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ru": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "pt": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ar": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "hi": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "tr": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "nl": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "sv": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "pl": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "vi": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "th": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "id": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "he": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "ms": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  },
  "no": {
    "controls": "Controls",
    "settings": "Settings",
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
    "fileNamePlaceholder": "screen-recording",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "systemAudio": "System audio",
    "microphone": "Microphone",
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "cursor": "Cursor",
    "cursorAlways": "Always show",
    "cursorMotion": "Show on motion",
    "cursorNever": "Hide",
    "notSupported": "Screen recording is not supported in this browser.",
    "permissionDenied": "Screen permission denied. Please allow screen sharing.",
    "microphoneDenied": "Microphone permission denied. Please allow microphone access.",
    "retryPermission": "Retry",
    "recordingFailed": "Failed to start recording.",
    "sourceNote": "Uses browser screen sharing to record your screen, window, or tab (offline).",
    "audioNote": "System audio depends on browser support; microphone can be included separately.",
    "permissionNote": "Allow screen sharing and microphone access when prompted."
  }
}
</i18n>
