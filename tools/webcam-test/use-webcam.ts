import { useEffect, useRef, useState } from "react"

import type { RefObject } from "react"

export const resolutions = {
  "720": { width: 1280, height: 720 },
  "1080": { width: 1920, height: 1080 },
  "2160": { width: 3840, height: 2160 },
} as const

type Resolution = keyof typeof resolutions
type VideoSize = { width: number; height: number }
type FrameRate = { value: number | undefined; reported: boolean }
type Session = {
  video: HTMLVideoElement
  stream?: MediaStream
  stopMeasuring?: () => void
}

export function useWebcam() {
  const video = useRef<HTMLVideoElement>(null)
  const session = useRef<Session | null>(null)
  const [status, setStatus] = useState<
    "idle" | "starting" | "active" | "error"
  >("idle")
  const [videoSize, setVideoSize] = useState<VideoSize | null>(null)
  const [frameRate, setFrameRate] = useState<FrameRate | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [device, setDevice] = useState("")
  const [requested, setRequested] = useState<Resolution>("1080")

  useEffect(() => () => releaseSession(session), [])

  function stop(nextStatus: "idle" | "starting" | "error" = "idle") {
    releaseSession(session)
    setVideoSize(null)
    setFrameRate(null)
    setStatus(nextStatus)
  }

  function updateSize() {
    const active = session.current
    if (
      !active?.stream ||
      !active.video.videoWidth ||
      !active.video.videoHeight
    )
      return
    setVideoSize({
      width: active.video.videoWidth,
      height: active.video.videoHeight,
    })
  }

  async function start(
    selectedDevice = device,
    selectedResolution = requested
  ) {
    const preview = video.current!
    stop("starting")
    const active: Session = { video: preview }
    session.current = active
    const size = resolutions[selectedResolution]

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: size.width },
          height: { ideal: size.height },
          frameRate: { ideal: 60 },
          ...(selectedDevice ? { deviceId: { exact: selectedDevice } } : {}),
        },
      })
      if (session.current !== active) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      active.stream = stream
      const track = stream.getVideoTracks()[0]
      if (!track) {
        stop("error")
        return
      }

      track.addEventListener(
        "ended",
        () => {
          if (session.current === active) stop("error")
        },
        { once: true }
      )
      preview.srcObject = stream
      setStatus("active")
      await preview.play()
      if (session.current !== active) return

      updateSize()
      if (typeof preview.requestVideoFrameCallback === "function") {
        active.stopMeasuring = measureFrames(preview, (value) => {
          setFrameRate({ value, reported: false })
        })
      } else {
        setFrameRate({ value: track.getSettings().frameRate, reported: true })
      }

      void navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          if (session.current === active) {
            setDevices(
              devices.filter(
                (item) => item.kind === "videoinput" && item.deviceId
              )
            )
          }
        })
        .catch(() => {
          // A preview is still useful when device names cannot be listed.
        })
    } catch {
      if (session.current === active) stop("error")
    }
  }

  function chooseDevice(next: string) {
    setDevice(next)
    if (session.current) void start(next, requested)
  }

  function chooseResolution(next: Resolution) {
    setRequested(next)
    if (session.current) void start(device, next)
  }

  return {
    video,
    status,
    videoSize,
    frameRate,
    devices,
    device,
    requested,
    updateSize,
    start,
    stop,
    chooseDevice,
    chooseResolution,
  }
}

function releaseSession(session: RefObject<Session | null>) {
  const active = session.current
  session.current = null
  if (!active) return
  active.stopMeasuring?.()
  active.stream?.getTracks().forEach((track) => track.stop())
  active.video.srcObject = null
}

function measureFrames(video: HTMLVideoElement, report: (fps: number) => void) {
  let base: VideoFrameCallbackMetadata | undefined

  function resetSample() {
    base = undefined
  }

  function frame(_now: number, metadata: VideoFrameCallbackMetadata) {
    if (!document.hidden) {
      base ??= metadata
      const elapsed = metadata.presentationTime - base.presentationTime
      if (elapsed >= 1000) {
        report(
          ((metadata.presentedFrames - base.presentedFrames) * 1000) / elapsed
        )
        base = metadata
      }
    }
    callback = video.requestVideoFrameCallback(frame)
  }

  let callback = video.requestVideoFrameCallback(frame)
  document.addEventListener("visibilitychange", resetSample)
  return () => {
    video.cancelVideoFrameCallback(callback)
    document.removeEventListener("visibilitychange", resetSample)
  }
}
