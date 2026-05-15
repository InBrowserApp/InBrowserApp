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

function useBarcodeCamera({ messages, onDecoded }: UseBarcodeCameraOptions) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle")
  const [cameraErrorMessage, setCameraErrorMessage] = useState("")
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
      setCameraErrorMessage(messages.cameraErrorDescription)
      return
    }

    releaseCamera()
    setCameraStatus("starting")
    setCameraErrorMessage("")
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
            setCameraErrorMessage(messages.cameraFrameError)
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
      const permissionError = isPermissionError(cameraError)

      setCameraStatus(permissionError ? "permission-denied" : "error")
      setCameraErrorMessage(
        permissionError
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
    releaseCamera,
    stopCamera,
  ])

  useEffect(() => {
    if (typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setCameraStatus("unsupported")
    }
  }, [])

  useEffect(() => releaseCamera, [releaseCamera])

  return { cameraErrorMessage, cameraStatus, startCamera, stopCamera, videoRef }
}

export { useBarcodeCamera }
