import { useCallback, useEffect, useRef, useState } from "react"

import {
  applyTorchConstraint,
  applyZoomConstraint,
  captureVideoFrame,
  defaultZoom,
  isPermissionError,
  requestCameraStream,
  resolveMediaSupport,
  resolveRecorderSupport,
  resolveTrackControls,
} from "./browser-camera"
import { buildCaptureFileName, formatDuration } from "./core/recorder"
import { useCameraRecorder } from "./use-camera-recorder"
import { useCameraRestart } from "./use-camera-restart"
import { useObjectUrl } from "./use-object-url"
import { releaseRecorder } from "./use-recorder-release"

import type { CameraMessages, CameraMode, CameraOutput } from "./types"
import type { FacingMode, SupportState, ZoomState } from "./browser-camera"

function useCameraController(messages: CameraMessages) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoTrackRef = useRef<MediaStreamTrack | null>(null)
  const audioTrackRef = useRef<MediaStreamTrack | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const recordingStartRef = useRef(0)

  const [supportState, setSupportState] = useState<SupportState>("checking")
  const [mode, setMode] = useState<CameraMode>("photo")
  const [facingMode, setFacingMode] = useState<FacingMode>("environment")
  const [hasStarted, setHasStarted] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [micEnabled, setMicEnabled] = useState(true)
  const [torchSupported, setTorchSupported] = useState(false)
  const [torchEnabled, setTorchEnabled] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>(defaultZoom)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [output, setOutput] = useState<CameraOutput | null>(null)
  const [recorderSupported, setRecorderSupported] = useState(false)
  const outputUrl = useObjectUrl(output?.blob ?? null)

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    videoTrackRef.current = null
    audioTrackRef.current = null
    setTorchSupported(false)
    setTorchEnabled(false)
    setZoom(defaultZoom)
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const attachStream = useCallback(
    async (stream: MediaStream) => {
      cleanupStream()
      streamRef.current = stream
      videoTrackRef.current = stream.getVideoTracks()[0] ?? null
      audioTrackRef.current = stream.getAudioTracks()[0] ?? null
      if (audioTrackRef.current) audioTrackRef.current.enabled = micEnabled

      const controls = resolveTrackControls(videoTrackRef.current)
      setTorchSupported(controls.torchSupported)
      setTorchEnabled(controls.torchEnabled)
      setZoom(controls.zoom)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
    },
    [cleanupStream, micEnabled]
  )

  const startCamera = useCallback(async () => {
    if (supportState !== "supported" || isPreparing || isRecording) return
    setIsPreparing(true)
    setPermissionDenied(false)
    setErrorMessage("")

    try {
      let stream: MediaStream
      try {
        stream = await requestCameraStream(facingMode, mode)
      } catch (error) {
        if (mode !== "video") throw error
        stream = await requestCameraStream(facingMode, mode, false)
        setMicEnabled(false)
      }
      await attachStream(stream)
      setHasStarted(true)
    } catch (error) {
      cleanupStream()
      setHasStarted(false)
      if (isPermissionError(error)) setPermissionDenied(true)
      else setErrorMessage(messages.cameraErrorDescription)
    } finally {
      setIsPreparing(false)
    }
  }, [
    attachStream,
    cleanupStream,
    facingMode,
    isPreparing,
    isRecording,
    messages.cameraErrorDescription,
    mode,
    supportState,
  ])

  const stopCamera = useCallback(() => {
    if (isRecording) return
    cleanupStream()
    setHasStarted(false)
    setErrorMessage("")
    setPermissionDenied(false)
  }, [cleanupStream, isRecording])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || isPreparing || isRecording) return
    if (!streamRef.current) await startCamera()

    const video = videoRef.current
    if (!streamRef.current || !video.videoWidth || !video.videoHeight) {
      setErrorMessage(messages.cameraNotReady)
      return
    }

    const blob = await captureVideoFrame(video, facingMode === "user")
    if (!blob) {
      setErrorMessage(messages.cameraErrorDescription)
      return
    }

    const mimeType = blob.type || "image/jpeg"
    setOutput({
      blob,
      kind: "photo",
      mimeType,
      fileName: buildCaptureFileName(messages.photoName, mimeType, "photo"),
    })
    setErrorMessage("")
  }, [
    facingMode,
    isPreparing,
    isRecording,
    messages.cameraErrorDescription,
    messages.cameraNotReady,
    messages.photoName,
    startCamera,
  ])

  const { startRecording, stopRecording } = useCameraRecorder({
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
  })

  const handleShutter = useCallback(() => {
    if (mode === "video") {
      if (isRecording) stopRecording()
      else void startRecording()
      return
    }
    void capturePhoto()
  }, [capturePhoto, isRecording, mode, startRecording, stopRecording])

  const handleModeChange = useCallback(
    (nextMode: CameraMode) => {
      if (isRecording || isPreparing) return
      if (nextMode === "video" && !recorderSupported) {
        setErrorMessage(messages.videoNotSupported)
        return
      }
      setMode(nextMode)
    },
    [isPreparing, isRecording, messages.videoNotSupported, recorderSupported]
  )

  const switchCamera = useCallback(() => {
    if (isPreparing || isRecording) return
    setFacingMode((value) => (value === "user" ? "environment" : "user"))
  }, [isPreparing, isRecording])

  const toggleTorch = useCallback(async () => {
    const track = videoTrackRef.current
    if (!torchSupported || !track) return
    const nextValue = !torchEnabled
    try {
      await applyTorchConstraint(track, nextValue)
      setTorchEnabled(nextValue)
    } catch {
      setTorchEnabled(false)
    }
  }, [torchEnabled, torchSupported])

  const toggleMic = useCallback(() => {
    setMicEnabled((value) => {
      const nextValue = !value
      if (audioTrackRef.current) audioTrackRef.current.enabled = nextValue
      return nextValue
    })
  }, [])

  const applyZoom = useCallback(
    async (value: number) => {
      setZoom((current) => ({ ...current, value }))
      const track = videoTrackRef.current
      if (!track) return
      try {
        await applyZoomConstraint(track, value)
      } catch {
        setZoom((current) => ({ ...current, value: zoom.value }))
      }
    },
    [zoom.value]
  )

  useEffect(() => {
    setSupportState(resolveMediaSupport())
    setRecorderSupported(resolveRecorderSupport())
  }, [])

  useCameraRestart({ facingMode, hasStarted, isRecording, mode, startCamera })

  useEffect(() => {
    return () => {
      releaseRecorder(recorderRef, recordedChunksRef)
      cleanupStream()
      stopTimer()
    }
  }, [cleanupStream, stopTimer])

  return {
    state: {
      supportState,
      mode,
      hasStarted,
      isPreparing,
      isRecording,
      permissionDenied,
      errorMessage,
      recorderSupported,
      micEnabled,
      torchSupported,
      torchEnabled,
      zoom,
      output,
      outputUrl,
      formattedDuration: formatDuration(elapsedMs),
      isMirrored: facingMode === "user",
    },
    actions: {
      startCamera,
      stopCamera,
      handleModeChange,
      handleShutter,
      switchCamera,
      toggleTorch,
      toggleMic,
      applyZoom,
      clearOutput: () => setOutput(null),
    },
    videoRef,
  }
}

export { useCameraController }
