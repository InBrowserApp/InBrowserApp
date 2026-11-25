import { useEffect, useRef, useState } from "react"

const pan = { left: -1, both: 0, right: 1 } as const
type Channel = keyof typeof pan
type Tone = { channel: Channel; oscillator?: OscillatorNode }

export function useStereoTone() {
  const audio = useRef<AudioContext | null>(null)
  const active = useRef<Tone | null>(null)
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
    const previous = active.current
    active.current = null
    previous?.oscillator?.stop()
    setError(false)
    if (previous?.channel === nextChannel) {
      setChannel(null)
      return
    }

    const tone: Tone = { channel: nextChannel }
    active.current = tone
    setChannel(nextChannel)

    function finish() {
      if (active.current !== tone) return
      active.current = null
      setChannel(null)
    }

    try {
      const context = (audio.current ??= new AudioContext())
      await context.resume()
      if (active.current !== tone) return

      const oscillator = context.createOscillator()
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
        finish()
      }
      oscillator.start(start)
      oscillator.stop(start + 0.75)
      tone.oscillator = oscillator
    } catch {
      if (active.current !== tone) return
      finish()
      setError(true)
    }
  }

  return { channel, error, play }
}
