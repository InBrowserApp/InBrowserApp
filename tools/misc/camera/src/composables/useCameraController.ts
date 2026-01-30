import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedVideoMimeType,
} from '../utils/recorder'

type CameraLabels = {
  formatUnknown: string
  photoName: string
  videoName: string
  cameraNotReady: string
  cameraError: string
  videoNotSupported: string
  recordingFailed: string
}

export function useCameraController(labels: Ref<CameraLabels>) {
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

  const rawOutputUrl = useObjectUrl(outputBlob)
  const outputUrl = computed(() => rawOutputUrl.value ?? '')

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
  const displayMimeType = computed(() => mimeType.value || labels.value.formatUnknown)
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
    const prefix = kind === 'photo' ? labels.value.photoName : labels.value.videoName
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
      if (errorMessage.value === labels.value.cameraNotReady) {
        errorMessage.value = ''
      }
      previewRef.value?.play().catch(() => undefined)
    }
    await previewRef.value.play().catch(() => undefined)
    updateAspectRatioFromVideo()
    if (errorMessage.value === labels.value.cameraNotReady) {
      errorMessage.value = ''
    }
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
        errorMessage.value = labels.value.cameraError
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
      errorMessage.value = labels.value.videoNotSupported
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
      errorMessage.value = labels.value.cameraNotReady
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) {
      errorMessage.value = labels.value.cameraError
      return
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.92)
    })

    if (!blob) {
      errorMessage.value = labels.value.cameraError
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
      recorder = options
        ? new MediaRecorder(stream.value, options)
        : new MediaRecorder(stream.value)
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
      errorMessage.value = labels.value.recordingFailed
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
      errorMessage.value = labels.value.recordingFailed
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

  return {
    previewRef,
    viewfinderAspectRatio,
    isSupported,
    permissionDenied,
    errorMessage,
    isPreparing,
    torchSupported,
    torchEnabled,
    isVideoMode,
    micEnabled,
    isRecording,
    formattedDuration,
    canSwitchMode,
    zoomSupported,
    zoomValue,
    zoomMin,
    zoomMax,
    zoomStep,
    zoomDisplay,
    outputBlob,
    outputKind,
    outputUrl,
    mode,
    shutterDisabled,
    isRecorderSupported,
    isMirrored,
    startCamera,
    toggleTorch,
    toggleMic,
    switchCamera,
    applyZoom,
    setMode,
    handleShutter,
    displayMimeType,
    fileSizeLabel,
    downloadName,
    clearOutput,
  }
}
