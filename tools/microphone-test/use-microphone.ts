import { useEffect, useRef, useState } from "react"

type MicrophoneSession = {
  context: AudioContext
  stream?: MediaStream
  output?: GainNode
  frame?: number
}

export function useMicrophone() {
  const session = useRef<MicrophoneSession | null>(null)
  const [status, setStatus] = useState<
    "idle" | "starting" | "active" | "error"
  >("idle")
  const [level, setLevel] = useState(0)
  const [monitoring, setMonitoring] = useState(false)

  function stop(nextStatus: "idle" | "error" = "idle") {
    release(session)
    setStatus(nextStatus)
    setMonitoring(false)
    setLevel(0)
  }

  useEffect(() => () => release(session), [])

  async function start() {
    setStatus("starting")
    let pending: MicrophoneSession | undefined
    try {
      const context = new AudioContext()
      pending = { context }
      session.current = pending
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
      if (session.current !== pending) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      pending.stream = stream
      const resumed = await ready
      if (session.current !== pending) return
      if (!resumed) {
        stop("error")
        return
      }

      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      const output = context.createGain()
      output.gain.value = 0
      source.connect(analyser)
      source.connect(output)
      output.connect(context.destination)
      pending.output = output

      const samples = new Float32Array(analyser.fftSize)
      const active = pending
      function readLevel() {
        analyser.getFloatTimeDomainData(samples)
        let energy = 0
        for (const sample of samples) energy += sample * sample
        setLevel(
          Math.min(100, Math.round(300 * Math.sqrt(energy / samples.length)))
        )
        active.frame = requestAnimationFrame(readLevel)
      }
      active.frame = requestAnimationFrame(readLevel)
      for (const track of stream.getTracks()) {
        track.addEventListener("ended", () => stop("error"), { once: true })
      }
      setStatus("active")
    } catch {
      if (!pending || session.current === pending) stop("error")
    }
  }

  function toggleMonitoring() {
    const output = session.current?.output
    if (!output) return
    output.gain.value = monitoring ? 0 : 0.6
    setMonitoring(!monitoring)
  }

  return { status, level, monitoring, start, stop, toggleMonitoring }
}

function release(session: { current: MicrophoneSession | null }) {
  const active = session.current
  session.current = null
  if (!active) return

  if (active.frame !== undefined) cancelAnimationFrame(active.frame)
  active.stream?.getTracks().forEach((track) => track.stop())
  void active.context.close()
}
