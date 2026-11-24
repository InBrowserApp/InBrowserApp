import { useEffect, useEffectEvent, useRef, useState } from "react"

export function PairingQr({
  value,
  label,
}: Readonly<{ value: string; label: string }>) {
  const [src, setSrc] = useState("")
  useEffect(() => {
    let current = true
    void import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(value, { errorCorrectionLevel: "L", width: 640 })
      )
      .then((url) => {
        if (current) setSrc(url)
      })
      .catch(() => {
        if (current) setSrc("")
      })
    return () => {
      current = false
    }
  }, [value])

  return src ? (
    <img
      src={src}
      alt={label}
      width={256}
      height={256}
      className="h-auto w-full max-w-64 rounded-lg bg-white"
    />
  ) : null
}

export function QrScanner({
  onRead,
  onError,
  label,
}: Readonly<{
  onRead: (text: string) => void
  onError: () => void
  label: string
}>) {
  const video = useRef<HTMLVideoElement>(null)
  const read = useEffectEvent(onRead)
  const fail = useEffectEvent(onError)
  useEffect(() => {
    let stream: MediaStream | undefined
    let timer: ReturnType<typeof setInterval>
    let stopped = false
    function stop() {
      stopped = true
      clearInterval(timer)
      stream?.getTracks().forEach((track) => track.stop())
    }

    async function scan() {
      const { default: decode } = await import("jsqr")
      if (stopped) return
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      if (stopped) {
        stop()
        return
      }
      const preview = video.current!
      preview.srcObject = stream
      await preview.play()
      if (stopped) return
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d", { willReadFrequently: true })
      if (!context) throw new Error("Camera frame is unavailable")
      timer = setInterval(() => {
        if (!preview.videoWidth) return
        canvas.width = Math.min(1280, preview.videoWidth)
        canvas.height = Math.round(
          (canvas.width * preview.videoHeight) / preview.videoWidth
        )
        context.drawImage(preview, 0, 0, canvas.width, canvas.height)
        const image = context.getImageData(0, 0, canvas.width, canvas.height)
        const result = decode(image.data, image.width, image.height, {
          inversionAttempts: "dontInvert",
        })
        if (result) {
          stop()
          read(result.data)
        }
      }, 180)
    }
    void scan().catch(() => {
      if (!stopped) {
        stop()
        fail()
      }
    })
    return stop
  }, [])

  return (
    <video
      ref={video}
      aria-label={label}
      muted
      playsInline
      className="aspect-video w-full rounded-lg bg-black object-contain"
    />
  )
}
