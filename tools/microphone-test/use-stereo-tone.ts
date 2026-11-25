import { useEffect, useRef, useState } from "react"

const pan = { left: -1, both: 0, right: 1 } as const
type Channel = keyof typeof pan

export function useStereoTone() {
  const audio = useRef<AudioContext | null>(null)
  const active = useRef<OscillatorNode | null>(null)
  const [channel, setChannel] = useState<Channel | null>(null)
  const [error, setError] = useState(false)

  useEffect(
    () => () => {
      const context = audio.current
      audio.current = null
      active.current = null
      void context?.close()
    },
    []
  )

  async function play(nextChannel: Channel) {
    let oscillator: OscillatorNode | undefined
    try {
      setError(false)
      const context = (audio.current ??= new AudioContext())
      if (active.current) {
        active.current.stop()
        active.current = null
      }
      if (channel === nextChannel) {
        setChannel(null)
        return
      }

      oscillator = context.createOscillator()
      active.current = oscillator
      setChannel(nextChannel)

      const panner = context.createStereoPanner()
      panner.pan.value = pan[nextChannel]
      const gain = context.createGain()
      const start = context.currentTime
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.04)
      gain.gain.setValueAtTime(0.16, start + 0.6)
      gain.gain.linearRampToValueAtTime(0, start + 0.75)
      oscillator.frequency.value = 440
      oscillator.connect(gain).connect(panner).connect(context.destination)
      oscillator.onended = () => {
        panner.disconnect()
        if (active.current === oscillator) {
          active.current = null
          setChannel(null)
        }
      }
      oscillator.start(start)
      oscillator.stop(start + 0.75)
      await context.resume()
    } catch {
      if (!oscillator || active.current === oscillator) {
        active.current = null
        setChannel(null)
        setError(true)
      }
    }
  }

  return { channel, error, play }
}
