import { useEffect, useRef, useState } from "react"

import { getHid } from "./hid"

import type { HidConnectionEvent, HidDevice, HidReportEvent } from "./hid"

type Phase = "disconnected" | "connecting" | "connected" | "disconnecting"
type Session = { device: HidDevice; dispose: () => void }

async function closeSession(session: Session) {
  session.dispose()
  try {
    if (session.device.opened) await session.device.close()
  } catch {
    // An unplugged device may already have been closed.
  }
}

export function useHidDevice(
  onReport: (reportId: number, data: DataView) => void,
  onConnected: () => void
) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [device, setDevice] = useState<HidDevice>()
  const [interfaces, setInterfaces] = useState<HidDevice[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("disconnected")
  const [error, setError] = useState(false)
  const session = useRef<Session | undefined>(undefined)
  const pending = useRef<symbol | undefined>(undefined)

  useEffect(() => {
    setSupported(!!getHid())
    return () => {
      pending.current = undefined
      const current = session.current
      session.current = undefined
      if (current) void closeSession(current)
    }
  }, [])

  async function disconnect() {
    const current = session.current
    if (!current || pending.current) return
    const operation = Symbol()
    pending.current = operation
    session.current = undefined
    setPhase("disconnecting")
    await closeSession(current)
    if (pending.current === operation) {
      pending.current = undefined
      setDevice(undefined)
      setInterfaces([])
      setPhase("disconnected")
    }
  }

  async function connect(index?: number) {
    const hid = getHid()
    if (!hid || pending.current || (index === undefined && session.current))
      return
    const operation = Symbol()
    pending.current = operation
    setPhase("connecting")
    setError(false)
    try {
      const available =
        index === undefined
          ? await hid.requestDevice({ filters: [] })
          : interfaces
      const nextIndex = index ?? 0
      const selected = available[nextIndex]
      if (!selected || pending.current !== operation) return
      setInterfaces(available)
      setSelectedIndex(nextIndex)
      const previous = session.current
      session.current = undefined
      setDevice(undefined)
      if (previous) await closeSession(previous)
      if (pending.current !== operation) return
      if (!selected.opened) await selected.open()
      if (pending.current !== operation) {
        await selected.close()
        return
      }
      function handleReport(event: Event) {
        const { reportId, data } = event as HidReportEvent
        onReport(reportId, data)
      }
      function handleDisconnect(event: Event) {
        if ((event as HidConnectionEvent).device === selected) void disconnect()
      }
      onConnected()
      selected.addEventListener("inputreport", handleReport)
      hid.addEventListener("disconnect", handleDisconnect)
      session.current = {
        device: selected,
        dispose() {
          selected.removeEventListener("inputreport", handleReport)
          hid.removeEventListener("disconnect", handleDisconnect)
        },
      }
      setDevice(selected)
      setPhase("connected")
    } catch (failure) {
      if (
        pending.current === operation &&
        !(failure instanceof DOMException && failure.name === "NotFoundError")
      ) {
        setError(true)
      }
    } finally {
      if (pending.current === operation) {
        pending.current = undefined
        if (!session.current) setPhase("disconnected")
      }
    }
  }

  return {
    supported,
    device,
    interfaces,
    selectedIndex,
    phase,
    error,
    connect,
    disconnect,
  }
}
