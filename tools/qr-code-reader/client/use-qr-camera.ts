import { useCallback, useEffect, useRef, useState } from "react"

import { decodeQrFromVideoFrame } from "../core/qr-decoder"

import type { CameraStatus, QRCodeReaderMessages, QRScanResult } from "./types"

type UseQrCameraOptions = Readonly<{
  messages: QRCodeReaderMessages
  onDecoded: (
    decoded: Omit<QRScanResult, "source">,
    source: QRScanResult["source"]
  ) => void
  onError: (message: string) => void
}>

function isPermissionError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
  )
}

function useQrCamera({ messages, onDecoded, onError }: UseQrCameraOptions) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isScanningRef = useRef(false)

  const releaseCamera = useCallback(() => {
    isScanningRef.current = false

    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const stopCamera = useCallback(() => {
    releaseCamera()
    setCameraStatus((currentStatus) =>
      currentStatus === "unsupported" ? "unsupported" : "idle"
    )
  }, [releaseCamera])

  const scanCameraFrame = useCallback(
    function scanCameraFrame() {
      const video = videoRef.current

      if (!video || !isScanningRef.current) {
        return
      }

      const canvas =
        canvasRef.current ??
        (canvasRef.current = document.createElement("canvas"))

      try {
        const decoded = decodeQrFromVideoFrame(video, canvas)

        if (decoded) {
          onDecoded(decoded, "camera")
          stopCamera()
          return
        }

        animationRef.current = window.requestAnimationFrame(scanCameraFrame)
      } catch {
        releaseCamera()
        setCameraStatus("error")
        onError(messages.cameraFrameError)
      }
    },
    [messages.cameraFrameError, onDecoded, onError, releaseCamera, stopCamera]
  )

  const startCamera = useCallback(async () => {
    if (cameraStatus === "starting" || cameraStatus === "scanning") {
      return
    }

    if (typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setCameraStatus("unsupported")
      return
    }

    releaseCamera()
    setCameraStatus("starting")
    onError("")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          height: { ideal: 1280 },
          width: { ideal: 1280 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }

      isScanningRef.current = true
      setCameraStatus("scanning")
      animationRef.current = window.requestAnimationFrame(scanCameraFrame)
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
    messages.cameraPermissionDescription,
    onError,
    releaseCamera,
    scanCameraFrame,
  ])

  useEffect(() => {
    if (typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setCameraStatus("unsupported")
    }
  }, [])

  useEffect(() => releaseCamera, [releaseCamera])

  return { cameraStatus, startCamera, stopCamera, videoRef }
}

export { useQrCamera }
