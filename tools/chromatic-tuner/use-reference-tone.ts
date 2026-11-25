import { useEffect, useRef, useState } from "react"

export function useReferenceTone() {
  const audio = useRef<AudioContext | null>(null)
  const active = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(
    () => () => {
      const context = audio.current
      audio.current = null
      active.current = false
      void context?.close()
    },
    []
  )

  async function play(frequency: number) {
    if (active.current) return
    active.current = true
    setPlaying(true)
    setError(false)

    function finish() {
      if (!active.current) return
      active.current = false
      setPlaying(false)
    }

    try {
      const context = (audio.current ??= new AudioContext())
      await context.resume()
      if (audio.current !== context) return

      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = context.currentTime
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.04)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.55)
      gain.gain.linearRampToValueAtTime(0, start + 0.7)
      oscillator.connect(gain).connect(context.destination)
      oscillator.onended = finish
      oscillator.start(start)
      // Let the reference tone clear the microphone frame before measuring again.
      oscillator.stop(start + 0.85)
    } catch {
      finish()
      setError(true)
    }
  }

  return { active, playing, error, play }
}
