import { useEffect, useRef, useState } from "react"
import { midiMix, type MidiSource } from "./midi-source"
import type { MidiPlayback } from "./playback"

type Session = { context: AudioContext; player?: MidiPlayback; timer?: number }
type Settings = { rate: number; loop: boolean }

function release(session: { current: Session | null }) {
  const active = session.current
  session.current = null
  if (!active) return
  window.clearInterval(active.timer)
  active.player?.close()
  void active.context.close().catch(() => {})
}

export function usePlayback(source: MidiSource) {
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mixing, setMixing] = useState(false)
  const [muted, setMuted] = useState<ReadonlySet<number>>(() => new Set())
  const [settings, setSettings] = useState<Settings>({ rate: 1, loop: false })
  const [error, setError] = useState<"playError" | "mixError">()
  const session = useRef<Session | null>(null)
  const currentPosition = useRef(0)
  const preferences = useRef(settings)

  useEffect(() => () => release(session), [])

  function showPosition(value: number) {
    currentPosition.current = Math.min(source.duration, Math.max(0, value))
    setPosition(currentPosition.current)
  }

  function sync(player: MidiPlayback) {
    if (player.closed) {
      release(session)
      setPlaying(false)
      setMixing(false)
      setError("playError")
      return
    }
    showPosition(player.position)
    setPlaying(player.playing)
  }

  function seek(seconds: number) {
    showPosition(seconds)
    session.current?.player?.seek(currentPosition.current)
  }

  function updateSettings(next: Settings) {
    preferences.current = next
    setSettings(next)
    const player = session.current?.player
    player?.setSpeed(next.rate)
    player?.setLoop(next.loop)
  }

  async function playPause() {
    const existing = session.current
    const player = existing?.player
    if (player) {
      if (player.playing) player.pause()
      else {
        if (currentPosition.current >= source.duration - 0.01) seek(0)
        player.play()
      }
      sync(player)
      return
    }
    if (existing) return

    setLoading(true)
    setError(undefined)
    let run: Session | undefined
    try {
      const context = new AudioContext()
      run = { context }
      session.current = run
      const ready = context.resume().then(
        () => true,
        () => false
      )
      const { openMidiPlayback } = await import("./playback")
      if (session.current !== run) return
      if (!(await ready)) throw new Error("Audio context could not start")

      const next = await openMidiPlayback(context, midiMix(source, muted))
      if (session.current !== run) {
        next.close()
        return
      }
      run.player = next
      next.setSpeed(preferences.current.rate)
      next.setLoop(preferences.current.loop)
      next.seek(
        currentPosition.current < source.duration ? currentPosition.current : 0
      )
      next.play()
      run.timer = window.setInterval(() => sync(next), 100)
      sync(next)
      setLoading(false)
    } catch {
      if (run && session.current !== run) return
      release(session)
      setPlaying(false)
      setLoading(false)
      setError("playError")
    }
  }

  async function toggleTrack(index: number) {
    if (loading || mixing) return
    const next = new Set(muted)
    if (next.has(index)) next.delete(index)
    else next.add(index)

    const run = session.current
    const player = run?.player
    if (!run || !player) {
      setMuted(next)
      setError(undefined)
      return
    }

    const time = player.position
    const resume = player.playing
    setMixing(true)
    setError(undefined)
    showPosition(time)
    player.pause()
    setPlaying(false)
    try {
      await player.replace(midiMix(source, next), time)
      if (session.current !== run) return
      setMuted(next)
      if (resume) player.play()
      sync(player)
      setMixing(false)
    } catch {
      if (session.current !== run) return
      release(session)
      setPlaying(false)
      setMixing(false)
      setError("mixError")
    }
  }

  return {
    position,
    playing,
    loading,
    mixing,
    muted,
    settings,
    error,
    seek,
    updateSettings,
    playPause,
    toggleTrack,
  }
}
