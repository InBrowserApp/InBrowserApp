<template>
  <ToolSectionHeader>{{ t('camera') }}</ToolSectionHeader>
  <ToolSection>
    <div class="camera-shell">
      <div class="viewfinder" :style="{ aspectRatio: viewfinderAspectRatio }">
        <video
          ref="previewRef"
          class="preview-video"
          :class="{ mirrored: isMirrored }"
          autoplay
          playsinline
          muted
        />

        <div v-if="!isSupported" class="camera-overlay">
          <p>{{ t('cameraNotSupported') }}</p>
        </div>
        <div v-else-if="permissionDenied" class="camera-overlay">
          <p>{{ t('cameraPermissionDenied') }}</p>
          <n-button size="small" type="primary" @click="startCamera">
            {{ t('retryPermission') }}
          </n-button>
        </div>
        <div v-else-if="errorMessage" class="camera-overlay">
          <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="isPreparing" class="camera-overlay">
          <p>{{ t('preparingCamera') }}</p>
        </div>

        <div class="top-bar">
          <div class="top-actions">
            <n-button
              v-if="torchSupported"
              quaternary
              size="small"
              class="icon-button"
              :aria-label="t('torch')"
              @click="toggleTorch"
            >
              <template #icon>
                <n-icon :component="torchEnabled ? FlashlightOnIcon : FlashlightOffIcon" />
              </template>
            </n-button>
            <n-button
              v-if="isVideoMode"
              quaternary
              size="small"
              class="icon-button"
              :aria-label="micEnabled ? t('micOn') : t('micOff')"
              @click="toggleMic"
            >
              <template #icon>
                <n-icon :component="micEnabled ? MicOnIcon : MicOffIcon" />
              </template>
            </n-button>
          </div>

          <div v-if="isRecording" class="status-pill">
            <span class="rec-dot" />
            <span>{{ t('recording') }}</span>
            <span>{{ formattedDuration }}</span>
          </div>

          <n-button
            quaternary
            size="small"
            class="icon-button"
            :aria-label="t('switchCamera')"
            :disabled="!canSwitchMode"
            @click="switchCamera"
          >
            <template #icon>
              <n-icon :component="SwitchCameraIcon" />
            </template>
          </n-button>
        </div>

        <div v-if="zoomSupported" class="zoom-bar">
          <n-icon :component="ZoomOutIcon" />
          <n-slider
            v-model:value="zoomValue"
            :min="zoomMin"
            :max="zoomMax"
            :step="zoomStep"
            :disabled="isPreparing"
            @update:value="applyZoom"
          />
          <n-icon :component="ZoomInIcon" />
          <span class="zoom-label">{{ zoomDisplay }}</span>
        </div>

        <div v-if="outputBlob" class="thumbnail">
          <img v-if="outputKind === 'photo'" :src="outputUrl" alt="" />
          <video v-else :src="outputUrl" muted playsinline />
        </div>

        <div class="bottom-bar">
          <div class="mode-tabs">
            <button
              type="button"
              class="mode-tab"
              :class="{ active: mode === 'photo' }"
              :disabled="!canSwitchMode"
              @click="setMode('photo')"
            >
              {{ t('photoMode') }}
            </button>
            <button
              type="button"
              class="mode-tab"
              :class="{ active: mode === 'video' }"
              :disabled="!canSwitchMode || !isRecorderSupported"
              @click="setMode('video')"
            >
              {{ t('videoMode') }}
            </button>
          </div>

          <button type="button" class="shutter" :disabled="shutterDisabled" @click="handleShutter">
            <span class="shutter-core" :class="{ recording: isRecording }" />
          </button>

          <div class="bottom-actions">
            <n-text v-if="!isRecorderSupported" class="unsupported-text">
              {{ t('videoNotSupported') }}
            </n-text>
          </div>
        </div>
      </div>
    </div>
  </ToolSection>

  <template v-if="outputBlob">
    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <img v-if="outputKind === 'photo'" class="output-media" :src="outputUrl" alt="" />
        <video v-else class="output-media" :src="outputUrl" controls />

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

        <n-flex :size="8">
          <n-button tag="a" type="primary" :href="outputUrl" :download="downloadName">
            <template #icon>
              <n-icon :component="DownloadIcon" />
            </template>
            {{ t('download') }}
          </n-button>
          <n-button tertiary @click="clearOutput">
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NButton, NFlex, NGi, NGrid, NIcon, NSlider, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import SwitchCameraIcon from '@vicons/fluent/CameraSwitch24Regular'
import FlashlightOnIcon from '@vicons/fluent/Flashlight24Regular'
import FlashlightOffIcon from '@vicons/fluent/FlashlightOff24Regular'
import MicOnIcon from '@vicons/fluent/Mic16Regular'
import MicOffIcon from '@vicons/fluent/MicOff16Regular'
import ZoomInIcon from '@vicons/fluent/ZoomIn16Regular'
import ZoomOutIcon from '@vicons/fluent/ZoomOut16Regular'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Filled'
import ClearIcon from '@vicons/fluent/Delete16Regular'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedVideoMimeType,
} from '../utils/recorder'

const { t } = useI18n()

type OutputKind = 'photo' | 'video' | ''

type ExtendedCapabilities = MediaTrackCapabilities & {
  torch?: boolean
  zoom?: {
    min: number
    max: number
    step: number
  }
}

type ExtendedConstraintSet = MediaTrackConstraintSet & {
  torch?: boolean
  zoom?: number
}

const mode = ref<'photo' | 'video'>('photo')
const permissionDenied = ref(false)
const errorMessage = ref('')
const isPreparing = ref(false)
const isRecording = ref(false)
const micEnabled = ref(true)
const torchEnabled = ref(false)
const facingMode = ref<'user' | 'environment'>('environment')

const previewRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const videoTrack = ref<MediaStreamTrack | null>(null)
const audioTrack = ref<MediaStreamTrack | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const outputBlob = ref<Blob | null>(null)
const outputKind = ref<OutputKind>('')
const mimeType = ref('')
const fileName = ref('')
const elapsedMs = ref(0)

const outputUrl = useObjectUrl(outputBlob)

let timer: number | null = null
let startTimestamp = 0
const recordedChunks: Blob[] = []

const zoomSupported = ref(false)
const torchSupported = ref(false)
const zoomMin = ref(1)
const zoomMax = ref(1)
const zoomStep = ref(0.1)
const zoomValue = ref(1)
const viewfinderAspectRatio = ref(9 / 16)

const isSupported = computed(
  () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
)
const isRecorderSupported = computed(() => typeof MediaRecorder !== 'undefined')
const isVideoMode = computed(() => mode.value === 'video')
const isMirrored = computed(() => facingMode.value === 'user')
const canSwitchMode = computed(() => !isRecording.value && !isPreparing.value)
const shutterDisabled = computed(() => {
  if (!isSupported.value) return true
  if (permissionDenied.value || isPreparing.value) return true
  if (isVideoMode.value && !isRecorderSupported.value) return true
  return false
})

const formattedDuration = computed(() => formatDuration(elapsedMs.value))
const fileSizeLabel = computed(() =>
  outputBlob.value ? formatFileSize(outputBlob.value.size) : '0 B',
)
const displayMimeType = computed(() => mimeType.value || t('formatUnknown'))
const fileExtension = computed(() => getExtensionForMimeType(mimeType.value))
const downloadName = computed(() => {
  if (!fileName.value) return ''
  return `${fileName.value}.${fileExtension.value}`
})
const zoomDisplay = computed(() => `${zoomValue.value.toFixed(1)}x`)

function buildTimestamp() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

function buildFileName(kind: Exclude<OutputKind, ''>) {
  const prefix = kind === 'photo' ? t('photoName') : t('videoName')
  return `${prefix}-${buildTimestamp()}`
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

function resetOutput() {
  outputBlob.value = null
  outputKind.value = ''
  mimeType.value = ''
  fileName.value = ''
}

function updateCapabilities(track: MediaStreamTrack | null) {
  const capabilities = (track?.getCapabilities?.() ?? {}) as ExtendedCapabilities
  if (capabilities.zoom) {
    zoomSupported.value = true
    zoomMin.value = capabilities.zoom.min
    zoomMax.value = capabilities.zoom.max
    zoomStep.value = capabilities.zoom.step || 0.1
  } else {
    zoomSupported.value = false
    zoomMin.value = 1
    zoomMax.value = 1
    zoomStep.value = 0.1
  }

  const settings = track?.getSettings?.() as { zoom?: number } | undefined
  if (settings?.zoom) {
    zoomValue.value = settings.zoom
  } else {
    zoomValue.value = zoomMin.value
  }

  torchSupported.value = Boolean(capabilities.torch)
  if (!torchSupported.value) {
    torchEnabled.value = false
  }
}

function updateAspectRatio(value?: number) {
  if (!value || !Number.isFinite(value) || value <= 0) return
  viewfinderAspectRatio.value = value
}

function updateAspectRatioFromTrack(track: MediaStreamTrack | null) {
  const settings = track?.getSettings?.()
  if (!settings) return
  if (typeof settings.aspectRatio === 'number' && settings.aspectRatio > 0) {
    updateAspectRatio(settings.aspectRatio)
    return
  }
  if (
    typeof settings.width === 'number' &&
    typeof settings.height === 'number' &&
    settings.width > 0 &&
    settings.height > 0
  ) {
    updateAspectRatio(settings.width / settings.height)
  }
}

function updateAspectRatioFromVideo() {
  const video = previewRef.value
  if (!video || !video.videoWidth || !video.videoHeight) return
  updateAspectRatio(video.videoWidth / video.videoHeight)
}

function cleanupStream() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop())
  }
  stream.value = null
  videoTrack.value = null
  audioTrack.value = null
  if (previewRef.value) {
    previewRef.value.srcObject = null
  }
  torchSupported.value = false
  zoomSupported.value = false
}

async function attachStream(nextStream: MediaStream) {
  cleanupStream()
  stream.value = nextStream
  videoTrack.value = nextStream.getVideoTracks()[0] ?? null
  audioTrack.value = nextStream.getAudioTracks()[0] ?? null
  if (audioTrack.value) {
    audioTrack.value.enabled = micEnabled.value
  }
  updateCapabilities(videoTrack.value)
  updateAspectRatioFromTrack(videoTrack.value)

  if (!previewRef.value) return
  previewRef.value.srcObject = nextStream
  previewRef.value.onloadedmetadata = () => {
    updateAspectRatioFromVideo()
    previewRef.value?.play().catch(() => undefined)
  }
  await previewRef.value.play().catch(() => undefined)
  updateAspectRatioFromVideo()
}

function buildConstraints(): MediaStreamConstraints {
  const video: MediaTrackConstraints = {
    facingMode: { ideal: facingMode.value },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  }
  const wantsAudio = mode.value === 'video'
  return {
    video,
    audio: wantsAudio
      ? {
          echoCancellation: true,
          noiseSuppression: true,
        }
      : false,
  }
}

async function startCamera() {
  if (!isSupported.value || isPreparing.value) return
  if (isRecording.value) return
  permissionDenied.value = false
  errorMessage.value = ''
  isPreparing.value = true

  try {
    const nextStream = await navigator.mediaDevices.getUserMedia(buildConstraints())
    await attachStream(nextStream)
  } catch (err) {
    cleanupStream()
    if (
      err instanceof Error &&
      (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
    ) {
      permissionDenied.value = true
    } else {
      errorMessage.value = t('cameraError')
    }
  } finally {
    isPreparing.value = false
  }
}

async function applyZoom(value: number) {
  zoomValue.value = value
  if (!videoTrack.value) return
  try {
    await videoTrack.value.applyConstraints({
      advanced: [{ zoom: value } as ExtendedConstraintSet],
    })
  } catch {
    return
  }
}

async function toggleTorch() {
  if (!torchSupported.value || !videoTrack.value) return
  const nextValue = !torchEnabled.value
  try {
    await videoTrack.value.applyConstraints({
      advanced: [{ torch: nextValue } as ExtendedConstraintSet],
    })
    torchEnabled.value = nextValue
  } catch {
    torchEnabled.value = false
  }
}

function toggleMic() {
  micEnabled.value = !micEnabled.value
  if (audioTrack.value) {
    audioTrack.value.enabled = micEnabled.value
  }
}

function switchCamera() {
  if (!canSwitchMode.value) return
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
}

function setMode(nextMode: 'photo' | 'video') {
  if (!canSwitchMode.value) return
  mode.value = nextMode
  if (nextMode === 'video' && !isRecorderSupported.value) {
    errorMessage.value = t('videoNotSupported')
  }
}

async function handleShutter() {
  if (isVideoMode.value) {
    if (isRecording.value) {
      stopRecording()
    } else {
      await startRecording()
    }
    return
  }
  await capturePhoto()
}

async function capturePhoto() {
  if (isPreparing.value || isRecording.value) return
  if (!previewRef.value) return
  if (!stream.value) {
    await startCamera()
  }
  if (!previewRef.value) return

  const video = previewRef.value
  if (!video.videoWidth || !video.videoHeight) {
    errorMessage.value = t('cameraNotReady')
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  if (!context) {
    errorMessage.value = t('cameraError')
    return
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.92)
  })

  if (!blob) {
    errorMessage.value = t('cameraError')
    return
  }

  resetOutput()
  outputKind.value = 'photo'
  outputBlob.value = blob
  mimeType.value = blob.type || 'image/jpeg'
  fileName.value = buildFileName('photo')
}

async function startRecording() {
  if (!isRecorderSupported.value || isRecording.value || isPreparing.value) return
  if (!isVideoMode.value) return
  if (!stream.value) {
    await startCamera()
  }
  if (!stream.value) return

  errorMessage.value = ''
  resetOutput()
  recordedChunks.length = 0

  const supportedMimeType = getSupportedVideoMimeType(MediaRecorder.isTypeSupported)
  const options = supportedMimeType ? { mimeType: supportedMimeType } : undefined
  let recorder: MediaRecorder
  try {
    recorder = options ? new MediaRecorder(stream.value, options) : new MediaRecorder(stream.value)
  } catch {
    recorder = new MediaRecorder(stream.value)
  }

  mediaRecorder.value = recorder
  const nextMimeType = recorder.mimeType || supportedMimeType

  recorder.onstart = () => {
    isRecording.value = true
    mimeType.value = nextMimeType
    elapsedMs.value = 0
    startTimer()
  }
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }
  recorder.onerror = () => {
    errorMessage.value = t('recordingFailed')
  }
  recorder.onstop = () => {
    isRecording.value = false
    stopTimer()
    const blobType = recorder.mimeType || nextMimeType || mimeType.value
    const blob = new Blob(recordedChunks, { type: blobType })
    recordedChunks.length = 0
    outputKind.value = 'video'
    outputBlob.value = blob
    mimeType.value = blob.type || blobType
    fileName.value = buildFileName('video')
    mediaRecorder.value = null
  }

  try {
    recorder.start(1000)
  } catch {
    mediaRecorder.value = null
    errorMessage.value = t('recordingFailed')
  }
}

function stopRecording() {
  if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') return
  mediaRecorder.value.stop()
}

function clearOutput() {
  resetOutput()
}

watch([mode, facingMode], async () => {
  if (!isSupported.value) return
  if (isRecording.value) return
  await startCamera()
})

watch(micEnabled, () => {
  if (audioTrack.value) {
    audioTrack.value.enabled = micEnabled.value
  }
})

onMounted(() => {
  if (isSupported.value) {
    void startCamera()
  }
})

onBeforeUnmount(() => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
  }
  cleanupStream()
  stopTimer()
})
</script>

<style scoped>
.camera-shell {
  display: flex;
  justify-content: center;
  width: 100%;
}

.viewfinder {
  position: relative;
  width: 100%;
  max-width: 92vw;
  aspect-ratio: 9 / 16;
  max-height: 80vh;
  border-radius: 28px;
  overflow: hidden;
  background: radial-gradient(circle at top, #2b2b2b, #0f0f0f 70%);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

.preview-video.mirrored {
  transform: scaleX(-1);
}

.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.65);
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent);
  pointer-events: none;
}

.top-bar > * {
  pointer-events: auto;
}

.top-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
}

.icon-button:hover {
  background: #fff;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
}

.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 12px rgba(255, 59, 48, 0.8);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
}

.zoom-bar {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 130px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
}

.zoom-label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  min-width: 40px;
  text-align: right;
}

.thumbnail {
  position: absolute;
  left: 16px;
  bottom: 116px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: #000;
}

.thumbnail img,
.thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bottom-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px 16px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
}

.mode-tabs {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
}

.mode-tab {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab.active {
  color: #111;
  background: #fff;
}

.mode-tab:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.shutter {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.9);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  transition: transform 0.15s ease;
}

.shutter:active {
  transform: scale(0.96);
}

.shutter:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shutter-core {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  transition: all 0.2s ease;
}

.shutter-core.recording {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ff3b30;
}

.bottom-actions {
  display: flex;
  justify-content: flex-end;
}

.unsupported-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
}

.output-media {
  width: 100%;
  border-radius: 12px;
  background: #000;
}

@media (max-width: 640px) {
  .viewfinder {
    border-radius: 22px;
  }

  .bottom-bar {
    grid-template-columns: 1fr auto 1fr;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "zh": {
    "camera": "照相机",
    "photoMode": "拍照",
    "videoMode": "录像",
    "recording": "录制中",
    "switchCamera": "切换镜头",
    "torch": "补光灯",
    "micOn": "麦克风开",
    "micOff": "麦克风关",
    "output": "输出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "notes": "说明",
    "offlineNote": "仅使用本地设备（离线）。",
    "formatNote": "照片为 JPEG/PNG，视频格式取决于浏览器（MP4/WebM）。",
    "permissionNote": "弹出提示时请允许摄像头/麦克风访问。",
    "cameraNotSupported": "当前浏览器不支持摄像头。",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许访问。",
    "cameraError": "无法访问摄像头。",
    "cameraNotReady": "摄像头尚未准备就绪。",
    "preparingCamera": "正在启动摄像头...",
    "videoNotSupported": "当前浏览器不支持录像。",
    "recordingFailed": "无法开始录制。",
    "photoName": "照片",
    "videoName": "视频",
    "retryPermission": "重试"
  },
  "zh-CN": {
    "camera": "照相机",
    "photoMode": "拍照",
    "videoMode": "录像",
    "recording": "录制中",
    "switchCamera": "切换镜头",
    "torch": "补光灯",
    "micOn": "麦克风开",
    "micOff": "麦克风关",
    "output": "输出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileSize": "文件大小",
    "download": "下载",
    "clear": "清除",
    "notes": "说明",
    "offlineNote": "仅使用本地设备（离线）。",
    "formatNote": "照片为 JPEG/PNG，视频格式取决于浏览器（MP4/WebM）。",
    "permissionNote": "弹出提示时请允许摄像头/麦克风访问。",
    "cameraNotSupported": "当前浏览器不支持摄像头。",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许访问。",
    "cameraError": "无法访问摄像头。",
    "cameraNotReady": "摄像头尚未准备就绪。",
    "preparingCamera": "正在启动摄像头...",
    "videoNotSupported": "当前浏览器不支持录像。",
    "recordingFailed": "无法开始录制。",
    "photoName": "照片",
    "videoName": "视频",
    "retryPermission": "重试"
  },
  "zh-TW": {
    "camera": "相機",
    "photoMode": "拍照",
    "videoMode": "錄影",
    "recording": "錄影中",
    "switchCamera": "切換鏡頭",
    "torch": "補光燈",
    "micOn": "麥克風開",
    "micOff": "麥克風關",
    "output": "輸出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "notes": "說明",
    "offlineNote": "僅使用本機裝置（離線）。",
    "formatNote": "照片為 JPEG/PNG，影片格式取決於瀏覽器（MP4/WebM）。",
    "permissionNote": "彈出提示時請允許攝影機/麥克風存取。",
    "cameraNotSupported": "目前瀏覽器不支援攝影機。",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許存取。",
    "cameraError": "無法存取攝影機。",
    "cameraNotReady": "攝影機尚未準備就緒。",
    "preparingCamera": "正在啟動攝影機...",
    "videoNotSupported": "目前瀏覽器不支援錄影。",
    "recordingFailed": "無法開始錄影。",
    "photoName": "照片",
    "videoName": "影片",
    "retryPermission": "重試"
  },
  "zh-HK": {
    "camera": "相機",
    "photoMode": "拍照",
    "videoMode": "錄影",
    "recording": "錄影中",
    "switchCamera": "切換鏡頭",
    "torch": "補光燈",
    "micOn": "麥克風開",
    "micOff": "麥克風關",
    "output": "輸出",
    "format": "格式",
    "formatUnknown": "未知",
    "fileSize": "檔案大小",
    "download": "下載",
    "clear": "清除",
    "notes": "說明",
    "offlineNote": "僅使用本機裝置（離線）。",
    "formatNote": "照片為 JPEG/PNG，影片格式取決於瀏覽器（MP4/WebM）。",
    "permissionNote": "彈出提示時請允許攝影機/麥克風存取。",
    "cameraNotSupported": "目前瀏覽器不支援攝影機。",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許存取。",
    "cameraError": "無法存取攝影機。",
    "cameraNotReady": "攝影機尚未準備就緒。",
    "preparingCamera": "正在啟動攝影機...",
    "videoNotSupported": "目前瀏覽器不支援錄影。",
    "recordingFailed": "無法開始錄影。",
    "photoName": "照片",
    "videoName": "影片",
    "retryPermission": "重試"
  },
  "es": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "fr": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "de": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "it": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "ja": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "ko": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "ru": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "pt": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "ar": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "hi": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "tr": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "nl": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "sv": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "pl": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "vi": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "th": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "id": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "he": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "ms": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  },
  "no": {
    "camera": "Camera",
    "photoMode": "Photo",
    "videoMode": "Video",
    "recording": "REC",
    "switchCamera": "Flip",
    "torch": "Torch",
    "micOn": "Mic on",
    "micOff": "Mic off",
    "output": "Output",
    "format": "Format",
    "formatUnknown": "Unknown",
    "fileSize": "File size",
    "download": "Download",
    "clear": "Clear",
    "notes": "Notes",
    "offlineNote": "Uses your local device only (offline).",
    "formatNote": "Photo format is JPEG/PNG; video format depends on the browser (MP4/WebM).",
    "permissionNote": "Allow camera/microphone access when prompted.",
    "cameraNotSupported": "Camera is not supported in this browser.",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "cameraError": "Failed to access camera.",
    "cameraNotReady": "Camera is not ready.",
    "preparingCamera": "Preparing camera...",
    "videoNotSupported": "Video recording is not supported in this browser.",
    "recordingFailed": "Failed to start recording.",
    "photoName": "photo",
    "videoName": "video",
    "retryPermission": "Retry"
  }
}
</i18n>
