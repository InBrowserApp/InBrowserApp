import { useCallback, useEffect, useRef, useState } from "react"

import {
  buildDefaultRecordingName,
  buildDownloadFileName,
  formatDuration,
  formatFileSize,
  getSupportedScreenRecorderMimeType,
} from "./core/recorder"
import {
  buildDisplayMediaOptions,
  closeAudioMixer,
  createMediaRecorder,
  createRecordingStream,
  isMicrophonePermissionError,
  isScreenPermissionError,
  stopMediaStream,
} from "./browser-recorder"
import { useObjectUrl } from "./use-object-url"
import { useRecorderSupport } from "./use-recorder-support"

import type { AudioMixer } from "./browser-recorder"
import type {
  RecorderError,
  RecorderStatus,
  ScreenRecorderMessages,
  ScreenRecordingOutput,
} from "./types"

function useScreenRecorder(messages: ScreenRecorderMessages) {
  const { isSupported, support, supportStatus } = useRecorderSupport()
  const [status, setStatus] = useState<RecorderStatus>("idle")
  const [error, setError] = useState<RecorderError | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const [includeSystemAudio, setIncludeSystemAudio] = useState(true)
  const [includeMicrophone, setIncludeMicrophone] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [activeMimeType, setActiveMimeType] = useState("")
  const [fileName, setFileName] = useState(messages.output.fileNamePlaceholder)
  const [output, setOutput] = useState<ScreenRecordingOutput | null>(null)

  const displayStreamRef = useRef<MediaStream | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioMixerRef = useRef<AudioMixer | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const startTimestampRef = useRef(0)
  const elapsedMsRef = useRef(0)
  const fileNameRef = useRef(fileName)

  const outputUrl = useObjectUrl(output?.blob ?? null)
  const isRecording = status !== "idle"
  const isPaused = status === "paused"
  const settingsDisabled = isPreparing || isRecording

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    startTimestampRef.current = Date.now() - elapsedMsRef.current
    timerRef.current = window.setInterval(() => {
      const nextElapsedMs = Date.now() - startTimestampRef.current
      elapsedMsRef.current = nextElapsedMs
      setElapsedMs(nextElapsedMs)
    }, 200)
  }, [stopTimer])

  const cleanupCapture = useCallback(() => {
    stopMediaStream(displayStreamRef.current)
    stopMediaStream(microphoneStreamRef.current)
    displayStreamRef.current = null
    microphoneStreamRef.current = null
    closeAudioMixer(audioMixerRef.current)
    audioMixerRef.current = null
  }, [])

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== "inactive") {
      recorder.stop()
    }
  }, [])

  const clearRecording = useCallback(() => {
    setOutput(null)
    setActiveMimeType("")
    setFileName(messages.output.fileNamePlaceholder)
  }, [messages.output.fileNamePlaceholder])

  const finishRecording = useCallback(
    (recorder: MediaRecorder, fallbackMimeType: string) => {
      setStatus("idle")
      stopTimer()
      const blobType = recorder.mimeType || fallbackMimeType || "video/webm"
      const blob = new Blob(recordedChunksRef.current, { type: blobType })
      recordedChunksRef.current = []
      recorderRef.current = null
      cleanupCapture()

      if (blob.size <= 0) {
        setError("generic")
        return
      }

      setOutput({
        blob,
        mimeType: blob.type || blobType,
        fileName: fileNameRef.current,
        durationMs: elapsedMsRef.current,
      })
      setActiveMimeType(blob.type || blobType)
    },
    [cleanupCapture, stopTimer]
  )

  const configureRecorder = useCallback(
    (recorder: MediaRecorder, fallbackMimeType: string) => {
      recorderRef.current = recorder
      recordedChunksRef.current = []
      setError(null)
      setOutput(null)
      recorder.onstart = () => {
        const nextFileName = buildDefaultRecordingName()
        fileNameRef.current = nextFileName
        setFileName(nextFileName)
        elapsedMsRef.current = 0
        setElapsedMs(0)
        setStatus("recording")
        setActiveMimeType(recorder.mimeType || fallbackMimeType)
        startTimer()
      }
      recorder.onpause = () => {
        setStatus("paused")
        stopTimer()
      }
      recorder.onresume = () => {
        setStatus("recording")
        startTimer()
      }
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      recorder.onerror = () => {
        setError("generic")
      }
      recorder.onstop = () => finishRecording(recorder, fallbackMimeType)
    },
    [finishRecording, startTimer, stopTimer]
  )

  const startRecording = useCallback(async () => {
    if (!isSupported || isPreparing || isRecording) {
      return
    }

    setError(null)
    setIsPreparing(true)
    recordedChunksRef.current = []

    if (includeMicrophone && !support.microphone) {
      setError("microphone-unsupported")
      setIsPreparing(false)
      return
    }

    try {
      const display = await navigator.mediaDevices.getDisplayMedia(
        buildDisplayMediaOptions(includeSystemAudio)
      )
      displayStreamRef.current = display
      display.getVideoTracks()[0]?.addEventListener("ended", stopRecording)

      if (includeMicrophone) {
        try {
          microphoneStreamRef.current =
            await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (microphoneError) {
          cleanupCapture()
          setError(
            isMicrophonePermissionError(microphoneError)
              ? "microphone-permission"
              : "generic"
          )
          setIsPreparing(false)
          return
        }
      }

      const recordingStream = createRecordingStream(
        display,
        microphoneStreamRef.current
      )
      audioMixerRef.current = recordingStream.mixer

      const mimeType = getSupportedScreenRecorderMimeType(
        MediaRecorder.isTypeSupported
      )
      const recorder = createMediaRecorder(recordingStream.stream, mimeType)
      configureRecorder(recorder, mimeType)
      recorder.start(1000)
    } catch (screenError) {
      cleanupCapture()
      setError(
        isScreenPermissionError(screenError) ? "screen-permission" : "generic"
      )
    } finally {
      setIsPreparing(false)
    }
  }, [
    cleanupCapture,
    configureRecorder,
    includeMicrophone,
    includeSystemAudio,
    isPreparing,
    isRecording,
    isSupported,
    stopRecording,
    support.microphone,
  ])

  const pauseRecording = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state === "recording") {
      recorder.pause()
    }
  }, [])

  const resumeRecording = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state === "paused") {
      recorder.resume()
    }
  }, [])

  useEffect(() => {
    fileNameRef.current = fileName
  }, [fileName])

  useEffect(() => {
    return () => {
      stopTimer()
      cleanupCapture()
    }
  }, [cleanupCapture, stopTimer])

  return {
    actions: {
      clearRecording,
      pauseRecording,
      resumeRecording,
      setFileName,
      setIncludeMicrophone,
      setIncludeSystemAudio,
      startRecording,
      stopRecording,
    },
    state: {
      activeMimeType,
      displayMimeType:
        output?.mimeType || activeMimeType || messages.output.formatUnknown,
      downloadName: buildDownloadFileName(
        fileName,
        output?.mimeType || activeMimeType,
        messages.output.fileNamePlaceholder
      ),
      elapsedMs,
      error,
      fileName,
      fileSizeLabel: output ? formatFileSize(output.blob.size) : "0 B",
      formattedDuration: formatDuration(output?.durationMs ?? elapsedMs),
      includeMicrophone,
      includeSystemAudio,
      isPaused,
      isPreparing,
      isRecording,
      isSupported,
      microphoneSupported: support.microphone,
      output,
      outputUrl,
      settingsDisabled,
      status,
      supportStatus,
    },
  }
}

export { useScreenRecorder }
