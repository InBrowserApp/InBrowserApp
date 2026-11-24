import { useEffect, useRef, useState } from "react"

import { createConnection, getSerial } from "./serial-connection"

import type { Entry } from "./core/data"
import type { Connection } from "./serial-connection"

type Phase = "disconnected" | "connecting" | "connected" | "disconnecting"
type Failure = "connectionError" | "readError" | "writeError"
const logLimit = 400

export function useTerminal() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [phase, setPhase] = useState<Phase>("disconnected")
  const [failure, setFailure] = useState<Failure>()
  const [entries, setEntries] = useState<Entry[]>([])
  const [truncated, setTruncated] = useState(false)
  const [sending, setSending] = useState(false)
  const log = useRef<Entry[]>([])
  const nextId = useRef(0)
  const flushTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const lifetime = useRef<AbortController | null>(null)
  const connecting = useRef(false)
  const current = useRef<Connection | undefined>(undefined)
  const writePending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    lifetime.current = controller
    setSupported(!!getSerial())
    return () => {
      controller.abort()
      clearTimeout(flushTimer.current)
      void current.current?.close().catch(() => undefined)
    }
  }, [])

  function append(
    direction: Entry["direction"],
    bytes: Uint8Array,
    text: string
  ) {
    if (lifetime.current?.signal.aborted) return
    const previous = log.current.at(-1)
    if (
      direction === "RX" &&
      previous?.direction === "RX" &&
      !previous.text.endsWith("\n") &&
      previous.bytes.length + bytes.length <= 4096
    ) {
      const combined = new Uint8Array(previous.bytes.length + bytes.length)
      combined.set(previous.bytes)
      combined.set(bytes, previous.bytes.length)
      log.current[log.current.length - 1] = {
        ...previous,
        text: previous.text + text,
        bytes: combined,
      }
    } else {
      log.current.push({
        id: nextId.current++,
        time: new Date(),
        direction,
        text,
        bytes,
      })
    }
    if (log.current.length > logLimit) {
      log.current.shift()
      setTruncated(true)
    }
    flushTimer.current ??= setTimeout(() => {
      flushTimer.current = undefined
      setEntries([...log.current])
    }, 60)
  }

  function clear() {
    clearTimeout(flushTimer.current)
    flushTimer.current = undefined
    log.current = []
    setEntries([])
    setTruncated(false)
  }

  async function disconnect() {
    const active = current.current
    if (!active) return
    const controller = lifetime.current
    setPhase("disconnecting")
    try {
      await active.close()
    } catch {
      // An unplugged device can already have closed its port.
    } finally {
      if (!controller?.signal.aborted && current.current === active) {
        current.current = undefined
        setPhase("disconnected")
      }
    }
  }

  async function connect(baudRate: number) {
    const controller = lifetime.current
    const serial = getSerial()
    if (!serial || connecting.current || current.current) return
    connecting.current = true
    setPhase("connecting")
    setFailure(undefined)
    try {
      const port = await serial.requestPort()
      if (controller?.signal.aborted) return
      await port.open({ baudRate })
      if (controller?.signal.aborted) {
        await port.close()
        return
      }
      current.current = createConnection(
        port,
        (bytes, text) => append("RX", bytes, text),
        (failed) => {
          if (failed) setFailure("readError")
          void disconnect()
        }
      )
      setPhase("connected")
    } catch (error) {
      if (controller?.signal.aborted) return
      if (!(error instanceof DOMException && error.name === "NotFoundError")) {
        setFailure("connectionError")
      }
      setPhase("disconnected")
    } finally {
      connecting.current = false
    }
  }

  async function send(bytes: Uint8Array) {
    const active = current.current
    if (!active || writePending.current) return false
    const controller = lifetime.current
    writePending.current = true
    setSending(true)
    setFailure(undefined)
    try {
      await active.send(bytes)
      append("TX", bytes, new TextDecoder().decode(bytes))
      return true
    } catch {
      if (!controller?.signal.aborted) setFailure("writeError")
      return false
    } finally {
      writePending.current = false
      if (!controller?.signal.aborted) setSending(false)
    }
  }

  return {
    phase,
    supported,
    failure,
    entries,
    truncated,
    sending,
    connect,
    disconnect,
    send,
    clear,
    getLog: () => log.current,
  }
}
