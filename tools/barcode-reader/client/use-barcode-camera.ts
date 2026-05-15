import { useCallback, useEffect, useRef, useState } from "react"

import type { IScannerControls } from "@zxing/browser"

import {
  createBarcodeReader,
  isIgnorableDecodeError,
  toBarcodeResult,
} from "../core/barcode-decoder"

import type {
  BarcodeReaderMessages,
  BarcodeReaderResult,
  CameraStatus,
} from "./types"

type UseBarcodeCameraOptions = Readonly<{
  messages: BarcodeReaderMessages
  onDecoded: (
    decoded: Omit<BarcodeReaderResult, "source">,
    source: BarcodeReaderResult["source"]
  ) => void
  onError: (message: string) => void
}>

function isPermissionError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
  )
}

function stopVideoStream(video: HTMLVideoElement | null) {
  const stream = video?.srcObject as
    | (MediaStream & { getTracks?: () => MediaStreamTrack[] })
    | null

  stream?.getTracks?.().forEach((track) => track.stop())

  if (video) {
    video.srcObject = null
  }
}

function useBarcodeCamera({
  messages,
  onDecoded,
  onError,
}: UseBarcodeCameraOptions) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const isScanningRef = useRef(false)

  const releaseCamera = useCallback(() => {
    isScanningRef.current = false
    controlsRef.current?.stop()
    controlsRef.current = null
    stopVideoStream(videoRef.current)
  }, [])

  const stopCamera = useCallback(() => {
    releaseCamera()
    setCameraStatus((currentStatus) =>
      currentStatus === "unsupported" ? "unsupported" : "idle"
    )
  }, [releaseCamera])

  const startCamera = useCallback(async () => {
    if (cameraStatus === "starting" || cameraStatus === "scanning") {
      return
    }

    if (typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setCameraStatus("unsupported")
      return
    }

    const video = videoRef.current

    if (!video) {
      setCameraStatus("error")
      onError(messages.cameraErrorDescription)
      return
    }

    releaseCamera()
    setCameraStatus("starting")
    onError("")
    isScanningRef.current = true

    try {
      const reader = createBarcodeReader()
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        video,
        (result, error) => {
          if (result) {
            onDecoded(toBarcodeResult(result), "camera")
            stopCamera()
            return
          }

          if (error && !isIgnorableDecodeError(error)) {
            releaseCamera()
            setCameraStatus("error")
            onError(messages.cameraFrameError)
          }
        }
      )

      if (!isScanningRef.current) {
        controls.stop()
        return
      }

      controlsRef.current = controls
      setCameraStatus("scanning")
    } catch (cameraError) {
      releaseCamera()
      setCameraStatus(
        isPermissionError(cameraError) ? "permission-denied" : "error"
      )
      onError(
        isPermissionError(cameraError)
          ? messages.cameraPermissionDescription
          : messages.cameraErrorDescription
      )
    }
  }, [
    cameraStatus,
    messages.cameraErrorDescription,
    messages.cameraFrameError,
    messages.cameraPermissionDescription,
    onDecoded,
    onError,
    releaseCamera,
    stopCamera,
  ])

  useEffect(() => {
    if (typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setCameraStatus("unsupported")
    }
  }, [])

  useEffect(() => releaseCamera, [releaseCamera])

  return { cameraStatus, startCamera, stopCamera, videoRef }
}

export { useBarcodeCamera }
