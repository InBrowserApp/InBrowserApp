import { useEffect, useRef, useState } from "react"

import { deniedAccess } from "./core/format"
import { getUsb } from "./usb"

import type { ConnectionEvent, Device } from "./usb"

type Status =
  | "permissionError"
  | "selectionError"
  | "openError"
  | "closeError"
  | "accessOk"
type Operation = { kind: "selecting" | "checking" }

export function useInspector() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [device, setDevice] = useState<Device>()
  const [connected, setConnected] = useState(false)
  const [busy, setBusy] = useState<Operation["kind"]>()
  const [status, setStatus] = useState<Status>()
  const selected = useRef<Device | undefined>(undefined)
  const connectedRef = useRef(false)
  const pending = useRef<Operation | undefined>(undefined)

  useEffect(() => {
    const usb = getUsb()
    setSupported(!!usb)
    function onDisconnect(event: Event) {
      if ((event as ConnectionEvent).device !== selected.current) return
      connectedRef.current = false
      setConnected(false)
      setStatus(undefined)
    }
    usb?.addEventListener("disconnect", onDisconnect)
    return () => {
      pending.current = undefined
      usb?.removeEventListener("disconnect", onDisconnect)
    }
  }, [])

  async function select() {
    const usb = getUsb()
    if (!usb || pending.current) return
    const operation = { kind: "selecting" } as const
    pending.current = operation
    setBusy(operation.kind)
    setStatus(undefined)
    try {
      const next = await usb.requestDevice({ filters: [] })
      if (pending.current !== operation) return
      selected.current = next
      connectedRef.current = true
      setDevice(next)
      setConnected(true)
    } catch (error) {
      if (
        pending.current !== operation ||
        (error instanceof DOMException && error.name === "NotFoundError")
      )
        return
      setStatus(deniedAccess(error) ? "permissionError" : "selectionError")
    } finally {
      if (pending.current === operation) {
        pending.current = undefined
        setBusy(undefined)
      }
    }
  }

  async function checkAccess() {
    const current = selected.current
    if (!current || !connectedRef.current || pending.current) return
    const operation = { kind: "checking" } as const
    pending.current = operation
    setBusy(operation.kind)
    setStatus(undefined)
    try {
      if (!current.opened) {
        await current.open()
        try {
          await current.close()
        } catch {
          if (pending.current === operation && connectedRef.current)
            setStatus("closeError")
          return
        }
      }
      if (pending.current === operation && connectedRef.current)
        setStatus("accessOk")
    } catch (error) {
      if (pending.current === operation && connectedRef.current) {
        setStatus(deniedAccess(error) ? "permissionError" : "openError")
      }
    } finally {
      if (pending.current === operation) {
        pending.current = undefined
        setBusy(undefined)
      }
    }
  }

  return { supported, device, connected, busy, status, select, checkAccess }
}
