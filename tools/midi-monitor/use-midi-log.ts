import { useCallback, useEffect, useRef, useState } from "react"

import { decodeMidi, hexBytes, trackNotes } from "./core/midi"

import type { HeldNote, Message } from "./core/midi"

export type Entry = {
  id: number
  time: Date
  data: string
  message: Exclude<Message, { kind: "clock" }>
}
type Snapshot = { entries: Entry[]; notes: HeldNote[]; pulses: number }

const empty: Snapshot = { entries: [], notes: [], pulses: 0 }
const limit = 100

export function useMidiLog() {
  const buffer = useRef<Snapshot>({ ...empty, entries: [] })
  const [snapshot, setSnapshot] = useState(empty)
  const frame = useRef<number | undefined>(undefined)
  const nextId = useRef(0)

  useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    },
    []
  )

  const publish = useCallback(() => {
    const { entries, notes, pulses } = buffer.current
    setSnapshot({ entries: [...entries].reverse(), notes, pulses })
  }, [])

  const receive = useCallback(
    (data: Uint8Array) => {
      const message = decodeMidi(data)
      if (!message) return
      const current = buffer.current
      if (message.kind === "clock") {
        current.pulses++
      } else {
        current.notes = trackNotes(current.notes, message)
        current.entries.push({
          id: nextId.current++,
          time: new Date(),
          data: hexBytes(data),
          message,
        })
        if (current.entries.length > limit) current.entries.shift()
      }
      frame.current ??= requestAnimationFrame(() => {
        frame.current = undefined
        publish()
      })
    },
    [publish]
  )

  const switchInput = useCallback(
    (hasInput: boolean) => {
      if (hasInput) buffer.current = { ...empty, entries: [] }
      else buffer.current.notes = []
      publish()
    },
    [publish]
  )

  function clear() {
    buffer.current.entries = []
    buffer.current.pulses = 0
    publish()
  }

  return { ...snapshot, receive, switchInput, clear }
}
