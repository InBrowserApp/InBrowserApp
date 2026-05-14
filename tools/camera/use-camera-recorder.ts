import { useCallback } from "react"

import {
  buildCaptureFileName,
  getSupportedVideoMimeType,
} from "./core/recorder"

import type { CameraMessages, CameraMode, CameraOutput } from "./types"
import type { Dispatch, SetStateAction } from "react"

type MutableRef<T> = {
  current: T
}

type UseCameraRecorderOptions = Readonly<{
  messages: CameraMessages
  mode: CameraMode
  recorderSupported: boolean
  isPreparing: boolean
  isRecording: boolean
  streamRef: MutableRef<MediaStream | null>
  recorderRef: MutableRef<MediaRecorder | null>
  recordedChunksRef: MutableRef<Blob[]>
  timerRef: MutableRef<number | null>
  recordingStartRef: MutableRef<number>
  startCamera: () => Promise<void>
  stopTimer: () => void
  setElapsedMs: Dispatch<SetStateAction<number>>
  setErrorMessage: Dispatch<SetStateAction<string>>
  setIsRecording: Dispatch<SetStateAction<boolean>>
  setOutput: Dispatch<SetStateAction<CameraOutput | null>>
}>

function useCameraRecorder({
  messages,
  mode,
  recorderSupported,
  isPreparing,
  isRecording,
  streamRef,
  recorderRef,
  recordedChunksRef,
  timerRef,
  recordingStartRef,
  startCamera,
  stopTimer,
  setElapsedMs,
  setErrorMessage,
  setIsRecording,
  setOutput,
}: UseCameraRecorderOptions) {
  const finishRecording = useCallback(
    (recorder: MediaRecorder, supportedMimeType: string) => {
      setIsRecording(false)
      stopTimer()
      const blobType = recorder.mimeType || supportedMimeType || "video/webm"
      const blob = new Blob(recordedChunksRef.current, { type: blobType })
      recordedChunksRef.current = []
      recorderRef.current = null

      if (blob.size <= 0) {
        setErrorMessage(messages.recordingFailed)
        return
      }

      setOutput({
        blob,
        kind: "video",
        mimeType: blob.type || blobType,
        fileName: buildCaptureFileName(messages.videoName, blobType, "video"),
      })
    },
    [
      messages.recordingFailed,
      messages.videoName,
      recordedChunksRef,
      recorderRef,
      setErrorMessage,
      setIsRecording,
      setOutput,
      stopTimer,
    ]
  )

  const startRecordingTimer = useCallback(() => {
    setIsRecording(true)
    setElapsedMs(0)
    recordingStartRef.current = Date.now()
    stopTimer()
    timerRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - recordingStartRef.current)
    }, 200)
  }, [recordingStartRef, setElapsedMs, setIsRecording, stopTimer, timerRef])

  const configureRecorder = useCallback(
    (recorder: MediaRecorder, supportedMimeType: string) => {
      recordedChunksRef.current = []
      recorderRef.current = recorder
      setOutput(null)
      setErrorMessage("")
      recorder.onstart = () => startRecordingTimer()
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data)
      }
      recorder.onerror = () => setErrorMessage(messages.recordingFailed)
      recorder.onstop = () => finishRecording(recorder, supportedMimeType)
    },
    [
      finishRecording,
      messages.recordingFailed,
      recordedChunksRef,
      recorderRef,
      setErrorMessage,
      setOutput,
      startRecordingTimer,
    ]
  )

  const startRecording = useCallback(async () => {
    if (!recorderSupported || isRecording || isPreparing || mode !== "video") {
      return
    }
    if (!streamRef.current) await startCamera()
    if (!streamRef.current) return

    const supportedMimeType = getSupportedVideoMimeType(
      MediaRecorder.isTypeSupported
    )
    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(
        streamRef.current,
        supportedMimeType ? { mimeType: supportedMimeType } : {}
      )
    } catch {
      recorder = new MediaRecorder(streamRef.current)
    }

    configureRecorder(recorder, supportedMimeType)
    try {
      recorder.start(1000)
    } catch {
      recorderRef.current = null
      setErrorMessage(messages.recordingFailed)
    }
  }, [
    configureRecorder,
    isPreparing,
    isRecording,
    messages.recordingFailed,
    mode,
    recorderRef,
    recorderSupported,
    startCamera,
    streamRef,
    setErrorMessage,
  ])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop()
    }
  }, [recorderRef])

  return { startRecording, stopRecording }
}

export { useCameraRecorder }
