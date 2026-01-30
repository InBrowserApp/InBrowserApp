import { computed, onBeforeUnmount, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedMimeType,
} from '../utils/recorder'

type RecorderState = 'inactive' | 'recording' | 'paused'

type ScreenRecorderMessages = {
  microphoneNotSupported: () => string
  recordingFailed: () => string
  formatUnknown: () => string
  fileNamePlaceholder: () => string
}

export function useScreenRecorder(messages: ScreenRecorderMessages) {
  const permissionDenied = ref(false)
  const microphoneDenied = ref(false)
  const errorMessage = ref('')
  const isPreparing = ref(false)

  const includeSystemAudio = ref(true)
  const includeMicrophone = ref(false)
  const recorderState = ref<RecorderState>('inactive')
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
  const displayMimeType = computed(() => mimeType.value || messages.formatUnknown())
  const fileSizeLabel = computed(() =>
    recordingBlob.value ? formatFileSize(recordingBlob.value.size) : '0 B',
  )
  const downloadName = computed(() => {
    const base = fileName.value.trim() || messages.fileNamePlaceholder()
    return base + '.' + fileExtension.value
  })

  function defaultFileName() {
    const now = new Date()
    const pad = (value: number) => String(value).padStart(2, '0')
    return `screen-recording-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate(),
    )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
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
      errorMessage.value = messages.microphoneNotSupported()
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
            errorMessage.value = messages.recordingFailed()
          }
          isPreparing.value = false
          return
        }
      }

      const tracks = [displayStream.value, microphoneStream.value]
        .filter(Boolean)
        .flatMap((stream) => stream!.getAudioTracks())
      const audioTrack = pickAudioTrack(tracks)

      const combined = new MediaStream()
      displayStream.value.getVideoTracks().forEach((track) => combined.addTrack(track))
      if (audioTrack) combined.addTrack(audioTrack)

      const supportedMimeType = getSupportedMimeType(MediaRecorder.isTypeSupported)
      const options = supportedMimeType ? { mimeType: supportedMimeType } : undefined
      let recorder: MediaRecorder
      try {
        recorder = options ? new MediaRecorder(combined, options) : new MediaRecorder(combined)
      } catch {
        recorder = new MediaRecorder(combined)
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
        errorMessage.value = messages.recordingFailed()
      }
    } finally {
      isPreparing.value = false
    }
  }

  function pauseRecording() {
    mediaRecorder.value?.pause()
  }

  function resumeRecording() {
    mediaRecorder.value?.resume()
  }

  function stopRecording() {
    mediaRecorder.value?.stop()
  }

  function clearRecording() {
    recordingBlob.value = null
    fileName.value = ''
    mimeType.value = ''
  }

  onBeforeUnmount(() => {
    cleanupStreams()
  })

  return {
    permissionDenied,
    microphoneDenied,
    errorMessage,
    isPreparing,
    includeSystemAudio,
    includeMicrophone,
    isSupported,
    isMicSupported,
    isRecording,
    isPaused,
    settingsDisabled,
    formattedDuration,
    fileExtension,
    displayMimeType,
    fileSizeLabel,
    downloadName,
    recordingBlob,
    recordingUrl,
    mimeType,
    fileName,
    elapsedMs,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording,
  }
}
