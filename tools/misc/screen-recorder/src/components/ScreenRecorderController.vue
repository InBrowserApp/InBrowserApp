<template>
  <ScreenRecorderControls
    :is-supported="isSupported"
    :permission-denied="permissionDenied"
    :microphone-denied="microphoneDenied"
    :error-message="errorMessage"
    :is-preparing="isPreparing"
    :is-recording="isRecording"
    :is-paused="isPaused"
    :formatted-duration="formattedDuration"
    :retry-permission-label="t('retryPermission')"
    :on-start="startRecording"
    :on-pause="pauseRecording"
    :on-resume="resumeRecording"
    :on-stop="stopRecording"
  />

  <ScreenRecorderSettings
    v-model:include-system-audio="includeSystemAudio"
    v-model:include-microphone="includeMicrophone"
    :settings-disabled="settingsDisabled"
    :is-mic-supported="isMicSupported"
  />

  <ScreenRecorderOutput
    v-if="recordingBlob"
    v-model:file-name="fileName"
    :recording-blob="recordingBlob"
    :recording-url="recordingUrl"
    :mime-type="mimeType"
    :on-clear="clearRecording"
  />

  <ScreenRecorderNotes />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ScreenRecorderControls from './ScreenRecorderControls.vue'
import ScreenRecorderNotes from './ScreenRecorderNotes.vue'
import ScreenRecorderOutput from './ScreenRecorderOutput.vue'
import ScreenRecorderSettings from './ScreenRecorderSettings.vue'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedMimeType,
} from '../utils/recorder'

const { t } = useI18n({ useScope: 'local' })

const permissionDenied = ref(false)
const microphoneDenied = ref(false)
const errorMessage = ref('')
const isPreparing = ref(false)

const includeSystemAudio = ref(true)
const includeMicrophone = ref(false)
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
const formattedDuration = computed(() => formatDuration(elapsedMs.value))
const fileExtension = computed(() => getExtensionForMimeType(mimeType.value))
const displayMimeType = computed(() => mimeType.value || t('formatUnknown'))
const fileSizeLabel = computed(() =>
  recordingBlob.value ? formatFileSize(recordingBlob.value.size) : '0 B',
)
const downloadName = computed(() => {
  const base = fileName.value.trim() || t('fileNamePlaceholder')
  return base + '.' + fileExtension.value
})

defineExpose({ displayMimeType, fileSizeLabel, downloadName })

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
    const display = await navigator.mediaDevices.getDisplayMedia({
      video: true,
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

<i18n lang="json">
{
  "en": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "zh": {
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "recordingFailed": "无法开始录制。",
    "retryPermission": "重试",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "屏幕录制"
  },
  "zh-CN": {
    "microphoneNotSupported": "当前浏览器不支持麦克风录制。",
    "recordingFailed": "无法开始录制。",
    "retryPermission": "重试",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "屏幕录制"
  },
  "zh-TW": {
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "recordingFailed": "無法開始錄製。",
    "retryPermission": "重試",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "螢幕錄製"
  },
  "zh-HK": {
    "microphoneNotSupported": "目前瀏覽器不支援麥克風錄製。",
    "recordingFailed": "無法開始錄製。",
    "retryPermission": "重試",
    "formatUnknown": "未知",
    "fileNamePlaceholder": "螢幕錄製"
  },
  "es": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "fr": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "de": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "it": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ja": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ko": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ru": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "pt": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ar": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "hi": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "tr": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "nl": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "sv": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "pl": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "vi": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "th": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "id": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "he": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "ms": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  },
  "no": {
    "microphoneNotSupported": "Microphone capture is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "retryPermission": "Retry",
    "formatUnknown": "Unknown",
    "fileNamePlaceholder": "screen-recording"
  }
}
</i18n>
