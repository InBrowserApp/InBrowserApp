import { useEffect, useRef, useState } from "react"

import {
  buildDefaultRecordingName,
  buildRecordingDownloadName,
  getSupportedAudioMimeType,
  isPermissionDeniedError,
} from "../core/recorder"

type RecorderState = "idle" | "recording" | "paused"
type RecorderError = "permission" | "failed"

type RecordingResult = Readonly<{
  blob: Blob
  downloadName: string
  durationMs: number
  mimeType: string
  url: string
}>

function hasAudioRecordingSupport() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined"
  )
}

function useAudioRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const timerStartedAtRef = useRef(0)
  const elapsedMsRef = useRef(0)
  const objectUrlRef = useRef<string | null>(null)

  const [isSupported, setIsSupported] = useState(true)
  const [recorderState, setRecorderState] = useState<RecorderState>("idle")
  const [isPreparing, setIsPreparing] = useState(false)
  const [error, setError] = useState<RecorderError | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [recording, setRecording] = useState<RecordingResult | null>(null)

  useEffect(() => {
    setIsSupported(hasAudioRecordingSupport())
  }, [])

  useEffect(() => {
    return () => {
      stopTimer()
      discardActiveRecorder()
      cleanupStream()
      revokeObjectUrl()
    }
  }, [])

  function updateElapsedMs(nextElapsedMs: number) {
    elapsedMsRef.current = Math.max(0, nextElapsedMs)
    setElapsedMs(elapsedMsRef.current)
  }

  function startTimer() {
    stopTimer()
    timerStartedAtRef.current = Date.now() - elapsedMsRef.current
    timerRef.current = window.setInterval(() => {
      updateElapsedMs(Date.now() - timerStartedAtRef.current)
    }, 200)
  }

  function stopTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function syncElapsedBeforePauseOrStop() {
    updateElapsedMs(Date.now() - timerStartedAtRef.current)
  }

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
  }

  function revokeObjectUrl() {
    if (objectUrlRef.current !== null) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  function clearRecording() {
    revokeObjectUrl()
    setRecording(null)
  }

  function discardActiveRecorder() {
    const recorder = recorderRef.current

    if (!recorder) {
      return
    }

    recorder.ondataavailable = null
    recorder.onerror = null
    recorder.onpause = null
    recorder.onresume = null
    recorder.onstart = null
    recorder.onstop = null

    if (recorder.state !== "inactive") {
      recorder.stop()
    }

    recorderRef.current = null
  }

  function attachRecorderEvents(
    recorder: MediaRecorder,
    requestedMimeType: string,
    nextBaseName: string
  ) {
    recorder.onstart = () => {
      revokeObjectUrl()
      setRecording(null)
      setRecorderState("recording")
      startTimer()
    }
    recorder.onpause = () => {
      stopTimer()
      setRecorderState("paused")
    }
    recorder.onresume = () => {
      setRecorderState("recording")
      startTimer()
    }
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }
    recorder.onerror = () => {
      setError("failed")
      stopTimer()
      setRecorderState("idle")
      cleanupStream()
      recorderRef.current = null
    }
    recorder.onstop = () => {
      stopTimer()
      const blobType = recorder.mimeType || requestedMimeType || "audio/webm"
      const blob = new Blob(chunksRef.current, { type: blobType })
      const mimeType = blob.type || blobType
      const url = URL.createObjectURL(blob)

      revokeObjectUrl()
      objectUrlRef.current = url
      setRecording({
        blob,
        downloadName: buildRecordingDownloadName(nextBaseName, mimeType),
        durationMs: elapsedMsRef.current,
        mimeType,
        url,
      })
      setRecorderState("idle")
      cleanupStream()
      chunksRef.current = []
      recorderRef.current = null
    }
  }

  async function startRecording() {
    if (isPreparing || recorderState !== "idle") {
      return
    }

    if (!hasAudioRecordingSupport()) {
      setIsSupported(false)
      return
    }

    setError(null)
    setIsPreparing(true)
    updateElapsedMs(0)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const supportedMimeType = getSupportedAudioMimeType(
        MediaRecorder.isTypeSupported?.bind(MediaRecorder)
      )
      const options = supportedMimeType
        ? { mimeType: supportedMimeType }
        : undefined
      let recorder: MediaRecorder
      const nextBaseName = buildDefaultRecordingName()

      streamRef.current = stream

      try {
        recorder = options
          ? new MediaRecorder(stream, options)
          : new MediaRecorder(stream)
      } catch {
        recorder = new MediaRecorder(stream)
      }

      recorderRef.current = recorder
      attachRecorderEvents(
        recorder,
        recorder.mimeType || supportedMimeType,
        nextBaseName
      )
      recorder.start(1000)
    } catch (caughtError) {
      discardActiveRecorder()
      cleanupStream()
      setError(isPermissionDeniedError(caughtError) ? "permission" : "failed")
    } finally {
      setIsPreparing(false)
    }
  }

  function pauseRecording() {
    const recorder = recorderRef.current

    if (!recorder || recorder.state !== "recording") {
      return
    }

    syncElapsedBeforePauseOrStop()
    recorder.pause()
  }

  function resumeRecording() {
    const recorder = recorderRef.current

    if (!recorder || recorder.state !== "paused") {
      return
    }

    recorder.resume()
  }

  function stopRecording() {
    const recorder = recorderRef.current

    if (!recorder || recorder.state === "inactive") {
      return
    }

    syncElapsedBeforePauseOrStop()
    recorder.stop()
  }

  return {
    isSupported,
    recorderState,
    isPreparing,
    error,
    elapsedMs,
    recording,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording,
  }
}

export { useAudioRecorder }
export type { RecorderError, RecorderState, RecordingResult }
