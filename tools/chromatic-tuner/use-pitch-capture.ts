import { useEffect, useRef, useState } from "react"
import { detectPitch } from "./pitch"

type Capture = {
  context: AudioContext
  stream?: MediaStream
  interval?: number
}

function release(capture: { current: Capture | null }) {
  const active = capture.current
  capture.current = null
  if (!active) return

  window.clearInterval(active.interval)
  active.stream?.getTracks().forEach((track) => track.stop())
  void active.context.close()
}

export function usePitchCapture(
  referenceActive: Readonly<{ current: boolean }>
) {
  const capture = useRef<Capture | null>(null)
  const [status, setStatus] = useState<
    "idle" | "starting" | "listening" | "error"
  >("idle")
  const [frequency, setFrequency] = useState<number | null>(null)

  useEffect(() => () => release(capture), [])

  function stop(next: "idle" | "error" = "idle") {
    release(capture)
    setStatus(next)
    setFrequency(null)
  }

  async function start() {
    if (capture.current) return
    setStatus("starting")
    let session: Capture | undefined

    try {
      const context = new AudioContext()
      session = { context }
      capture.current = session
      const ready = context.resume().then(
        () => true,
        () => false
      )
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      if (capture.current !== session) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      session.stream = stream
      const resumed = await ready
      if (capture.current !== session) return
      if (!resumed) {
        stop("error")
        return
      }

      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = Math.max(
        4096,
        2 ** Math.ceil(Math.log2(context.sampleRate / 20))
      )
      source.connect(analyser)

      const samples = new Float32Array(analyser.fftSize)
      let lastFrequency: number | null = null
      const active = session
      function read() {
        if (referenceActive.current) return
        analyser.getFloatTimeDomainData(samples)
        const next = detectPitch(samples, context.sampleRate)
        if (
          next !== null &&
          lastFrequency !== null &&
          Math.abs(Math.log2(next / lastFrequency)) < 1 / 24
        ) {
          lastFrequency = lastFrequency * 0.6 + next * 0.4
        } else {
          lastFrequency = next
        }
        setFrequency(lastFrequency)
      }

      active.interval = window.setInterval(read, 85)
      for (const track of stream.getTracks()) {
        track.addEventListener(
          "ended",
          () => {
            if (capture.current === active) stop("error")
          },
          { once: true }
        )
      }
      setStatus("listening")
    } catch {
      if (!session || capture.current === session) stop("error")
    }
  }

  return { status, frequency, start, stop }
}
