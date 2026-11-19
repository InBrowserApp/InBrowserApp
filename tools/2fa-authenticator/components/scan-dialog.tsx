import { useEffect, useEffectEvent, useRef, useState } from "react"
import type QrScanner from "qr-scanner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog"

import { parseImportLink } from "../import"
import type { Setup } from "../accounts"
import type { Messages } from "../types"

type Capture = {
  source: "camera" | "screen"
  stream: Promise<MediaStream | null>
  stop: () => void
}

function requestCapture(
  source: Capture["source"],
  devices: MediaDevices
): Capture {
  const controller = new AbortController()
  const { signal } = controller
  // Display capture needs the activation from the click that opens the scanner.
  const request =
    source === "camera"
      ? devices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        })
      : devices.getDisplayMedia({ video: true, audio: false })
  const stream = request
    .then((stream) => {
      function stopTracks() {
        for (const track of stream.getTracks()) track.stop()
      }

      if (signal.aborted) {
        stopTracks()
        return null
      }
      signal.addEventListener("abort", stopTracks, { once: true })
      return stream
    })
    .catch(() => null)

  return { source, stream, stop: () => controller.abort() }
}

function Scanner({
  capture,
  messages,
  onFinish,
}: {
  capture: Capture
  messages: Messages
  onFinish: (setups?: Setup[]) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const finish = useEffectEvent(onFinish)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const video = videoRef.current!
    let timer: number
    let engine: Awaited<ReturnType<typeof QrScanner.createQrEngine>> | undefined

    function release() {
      window.clearTimeout(timer)
      if (engine && "terminate" in engine) {
        engine.terminate()
        engine = undefined
      }
      video.srcObject = null
    }

    function complete(setups?: Setup[]) {
      if (signal.aborted) return
      controller.abort()
      finish(setups)
    }

    async function start() {
      try {
        const stream = await capture.stream
        if (signal.aborted) return
        if (!stream) {
          complete()
          return
        }
        for (const track of stream.getVideoTracks()) {
          track.addEventListener("ended", () => complete(), { signal })
        }
        video.srcObject = stream
        await video.play()
        const { default: QrScanner } = await import("qr-scanner")
        engine = await QrScanner.createQrEngine()
        if (signal.aborted) {
          release()
          return
        }
        const canvas = document.createElement("canvas")
        setScanning(true)

        async function scanFrame() {
          try {
            const { data } = await QrScanner.scanImage(video, {
              canvas,
              qrEngine: engine,
              returnDetailedScanResult: true,
            })
            const setups = await parseImportLink(data).catch(() => undefined)
            if (setups) {
              complete(setups)
              return
            }
          } catch (error) {
            if (error !== QrScanner.NO_QR_CODE_FOUND) {
              complete()
              return
            }
          }
          if (!signal.aborted) {
            timer = window.setTimeout(() => void scanFrame(), 300)
          }
        }

        void scanFrame()
      } catch {
        complete()
      }
    }

    void start()
    return () => {
      controller.abort()
      release()
    }
  }, [capture])

  return (
    <>
      <DialogHeader className="pe-6 text-start">
        <DialogTitle>
          {capture.source === "camera" ? messages.camera : messages.screen}
        </DialogTitle>
        <DialogDescription role="status">
          {scanning ? messages.scanning : messages.starting}
        </DialogDescription>
      </DialogHeader>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="max-h-[55dvh] w-full rounded-md bg-muted"
      />
    </>
  )
}

function ScanDialog({
  capture,
  messages,
  onFinish,
  onClose,
  onCloseAutoFocus,
}: {
  capture: Capture | null
  messages: Messages
  onFinish: (setups?: Setup[]) => void
  onClose: () => void
  onCloseAutoFocus: () => void
}) {
  return (
    <Dialog
      open={capture !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        closeLabel={messages.cancel}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onCloseAutoFocus()
        }}
      >
        {capture && (
          <Scanner capture={capture} messages={messages} onFinish={onFinish} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export { requestCapture, ScanDialog }
export type { Capture }
