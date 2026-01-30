<template>
  <AudioRecorderControls
    :is-supported="isSupported"
    :permission-denied="permissionDenied"
    :error-message="errorMessage"
    :is-preparing="isPreparing"
    :is-recording="isRecording"
    :is-paused="isPaused"
    :formatted-duration="formattedDuration"
    :on-start="startRecording"
    :on-pause="pauseRecording"
    :on-resume="resumeRecording"
    :on-stop="stopRecording"
  />

  <AudioRecorderOutput
    v-if="recordingBlob"
    v-model:file-name="fileName"
    :recording-blob="recordingBlob"
    :recording-url="recordingUrl"
    :mime-type="mimeType"
    :on-clear="clearRecording"
  />

  <AudioRecorderNotes />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import AudioRecorderControls from './AudioRecorderControls.vue'
import AudioRecorderNotes from './AudioRecorderNotes.vue'
import AudioRecorderOutput from './AudioRecorderOutput.vue'
import { formatDuration, getSupportedMimeType } from '../utils/recorder'

const { t } = useI18n({ useScope: 'local' })

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
const formattedDuration = computed(() => formatDuration(elapsedMs.value))

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
    const nextMimeType = recorder.mimeType || supportedMimeType
    attachRecorderEvents(recorder, nextMimeType)
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

<i18n lang="json">
{
  "en": {
    "recordingFailed": "Failed to start recording."
  },
  "zh": {
    "recordingFailed": "无法开始录音。"
  },
  "zh-CN": {
    "recordingFailed": "无法开始录音。"
  },
  "zh-TW": {
    "recordingFailed": "無法開始錄音。"
  },
  "zh-HK": {
    "recordingFailed": "無法開始錄音。"
  },
  "es": {
    "recordingFailed": "Failed to start recording."
  },
  "fr": {
    "recordingFailed": "Failed to start recording."
  },
  "de": {
    "recordingFailed": "Failed to start recording."
  },
  "it": {
    "recordingFailed": "Failed to start recording."
  },
  "ja": {
    "recordingFailed": "Failed to start recording."
  },
  "ko": {
    "recordingFailed": "Failed to start recording."
  },
  "ru": {
    "recordingFailed": "Failed to start recording."
  },
  "pt": {
    "recordingFailed": "Failed to start recording."
  },
  "ar": {
    "recordingFailed": "Failed to start recording."
  },
  "hi": {
    "recordingFailed": "Failed to start recording."
  },
  "tr": {
    "recordingFailed": "Failed to start recording."
  },
  "nl": {
    "recordingFailed": "Failed to start recording."
  },
  "sv": {
    "recordingFailed": "Failed to start recording."
  },
  "pl": {
    "recordingFailed": "Failed to start recording."
  },
  "vi": {
    "recordingFailed": "Failed to start recording."
  },
  "th": {
    "recordingFailed": "Failed to start recording."
  },
  "id": {
    "recordingFailed": "Failed to start recording."
  },
  "he": {
    "recordingFailed": "Failed to start recording."
  },
  "ms": {
    "recordingFailed": "Failed to start recording."
  },
  "no": {
    "recordingFailed": "Failed to start recording."
  }
}
</i18n>
