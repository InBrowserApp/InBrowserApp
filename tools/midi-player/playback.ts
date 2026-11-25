import { loadDefaultSoundBank } from "@workspace/midi-audio/sound-bank"
import { Sequencer, WorkletSynthesizer } from "spessasynth_lib"
import processorUrl from "spessasynth_lib/dist/spessasynth_processor.min.js?url"

import type { LibSequencerEvent } from "spessasynth_lib"

export interface MidiPlayback {
  readonly position: number
  readonly closed: boolean
  readonly playing: boolean
  play(): void
  pause(): void
  seek(seconds: number): void
  setSpeed(rate: number): void
  setLoop(enabled: boolean): void
  replace(midi: ArrayBuffer, position: number): Promise<void>
  close(): void
}

export async function openMidiPlayback(
  context: AudioContext,
  midi: ArrayBuffer
): Promise<MidiPlayback> {
  const [soundBank] = await Promise.all([
    loadDefaultSoundBank(),
    context.audioWorklet.addModule(processorUrl),
  ])
  let closed = false
  let rejectPending: ((error: unknown) => void) | undefined
  const synth = new WorkletSynthesizer(context, {
    eventsEnabled: false,
    audioNodeCreators: {
      worklet: (audioContext, name, options) => {
        const node = new AudioWorkletNode(audioContext, name, options)
        node.addEventListener("processorerror", close, { once: true })
        return node
      },
    },
  })
  context.addEventListener("statechange", checkContext)

  function checkContext() {
    if (context.state === "closed") close()
  }

  function close() {
    if (closed) return
    closed = true
    context.removeEventListener("statechange", checkContext)
    rejectPending?.(new Error("MIDI playback closed"))
    synth.destroy()
  }

  try {
    synth.connect(context.destination)
    await Promise.all([
      synth.isReady,
      synth.soundBankManager.addSoundBank(soundBank, "default"),
    ])

    const sequencer = new Sequencer(synth, { skipToFirstNoteOn: false })
    const { eventHandler } = sequencer
    let duration = 0
    let speed = 1
    let loop = false
    let wantsPlayback = false
    let loadingPosition: number | undefined
    let resumePosition: number | undefined
    let queue = Promise.resolve()
    const eventId = "midi-player-load"
    eventHandler.addEvent("songEnded", "midi-player-loop", () => {
      if (closed || !loop || !wantsPlayback || loadingPosition !== undefined) {
        return
      }
      // The native loop can start at the first note or an embedded marker.
      sequencer.currentTime = 0
      sequencer.play()
    })

    function waitFor<Event extends "songChange" | "timeChange">(
      event: Event,
      send: () => void,
      matches: (data: LibSequencerEvent[Event]) => boolean = () => true
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        function cleanup() {
          eventHandler.removeEvent(event, eventId)
          eventHandler.removeEvent("midiError", eventId)
          rejectPending = undefined
        }
        function fail(error: unknown) {
          cleanup()
          reject(error)
        }
        rejectPending = fail
        eventHandler.addEvent("midiError", eventId, fail)
        eventHandler.addEvent(event, eventId, (data) => {
          if (!matches(data)) return
          cleanup()
          resolve()
        })
        try {
          send()
        } catch (error) {
          fail(error)
        }
      })
    }

    function clamp(seconds: number) {
      return Math.max(0, Math.min(duration, seconds))
    }

    function replace(input: ArrayBuffer, position: number) {
      const operation = queue.then(async () => {
        if (closed) throw new Error("MIDI playback closed")
        loadingPosition = clamp(position)
        wantsPlayback = false
        sequencer.pause()
        synth.stopAll(true)
        try {
          await waitFor("songChange", () =>
            sequencer.loadNewSongList([{ binary: input }])
          )
          duration = sequencer.duration
          sequencer.playbackRate = speed
          sequencer.loopCount = 0
          const target = clamp(position)
          await waitFor(
            "timeChange",
            () => {
              sequencer.currentTime = target
            },
            ({ newTime }) => Math.abs(newTime - target) < 1e-6
          )
          resumePosition = target
        } finally {
          loadingPosition = undefined
        }
      })
      queue = operation.catch(() => undefined)
      return operation
    }

    await replace(midi, 0)
    return {
      get closed() {
        return closed
      },
      get position() {
        return loadingPosition ?? clamp(sequencer.currentTime)
      },
      get playing() {
        return !closed && loadingPosition === undefined && !sequencer.paused
      },
      play() {
        if (closed || loadingPosition !== undefined || !sequencer.paused) return
        wantsPlayback = true
        sequencer.play()
        // SpessaSynth can round a paused seek forward to the next MIDI event.
        // Reapply the requested position after starting so resume stays exact.
        if (
          resumePosition !== undefined &&
          resumePosition > 0 &&
          resumePosition < duration
        ) {
          sequencer.currentTime = resumePosition
        }
        resumePosition = undefined
      },
      pause() {
        wantsPlayback = false
        if (!closed) sequencer.pause()
      },
      seek(seconds) {
        if (!closed && loadingPosition === undefined) {
          const target = clamp(seconds)
          if (sequencer.paused) resumePosition = target
          sequencer.currentTime = target
        }
      },
      setSpeed(rate) {
        speed = rate
        if (!closed) sequencer.playbackRate = rate
      },
      setLoop(enabled) {
        loop = enabled
      },
      replace,
      close,
    }
  } catch (error) {
    close()
    throw error
  }
}
