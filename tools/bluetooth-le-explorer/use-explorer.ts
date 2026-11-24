import { useEffect, useRef, useState } from "react"

import { getBluetooth } from "./bluetooth"
import { displayValue } from "./core/data"

import type { Characteristic, Device } from "./bluetooth"

export type Value = ReturnType<typeof displayValue>
export type Service = { uuid: string; characteristics: Characteristic[] }
export type Notification = Value & { id: number; time: string; uuid: string }

type Session = {
  gatt: NonNullable<Device["gatt"]>
  listeners: Map<Characteristic, EventListener>
  cleanup: () => void
}

const logLimit = 100

export function useExplorer() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState<Device>()
  const [services, setServices] = useState<Service[]>([])
  const [values, setValues] = useState(new Map<Characteristic, Value>())
  const [subscribed, setSubscribed] = useState(new Set<Characteristic>())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<"connectionError" | "operationError">()
  const current = useRef<Session | undefined>(undefined)
  const pending = useRef<symbol | undefined>(undefined)
  const nextId = useRef(0)

  useEffect(() => {
    setSupported(!!getBluetooth())
    return () => {
      pending.current = undefined
      current.current?.cleanup()
      current.current = undefined
    }
  }, [])

  function disconnect() {
    const session = current.current
    current.current = undefined
    pending.current = undefined
    session?.cleanup()
    setConnecting(false)
    setBusy(false)
    setConnected(undefined)
    setServices([])
    setValues(new Map())
    setSubscribed(new Set())
  }

  async function connect(optionalServices: (number | string)[]) {
    const bluetooth = getBluetooth()
    if (!bluetooth || pending.current || current.current) return
    const operation = Symbol()
    pending.current = operation
    setError(undefined)
    setConnecting(true)
    try {
      const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices,
      })
      if (pending.current !== operation) return
      if (!device.gatt) throw new Error("The device has no GATT server")
      const gatt = device.gatt
      const listeners = new Map<Characteristic, EventListener>()
      const session: Session = {
        gatt,
        listeners,
        cleanup() {
          device.removeEventListener("gattserverdisconnected", disconnect)
          for (const [characteristic, listener] of listeners) {
            characteristic.removeEventListener(
              "characteristicvaluechanged",
              listener
            )
          }
          gatt.disconnect()
        },
      }
      current.current = session
      device.addEventListener("gattserverdisconnected", disconnect)
      await gatt.connect()
      if (current.current !== session) {
        if (current.current?.gatt !== gatt) gatt.disconnect()
        return
      }
      const discovered: Service[] = []
      for (const service of await gatt.getPrimaryServices()) {
        if (current.current !== session) return
        discovered.push({
          uuid: service.uuid,
          characteristics: await service.getCharacteristics(),
        })
      }
      if (current.current === session) {
        setServices(discovered)
        setConnected(device)
      }
    } catch (failure) {
      if (pending.current !== operation) return
      disconnect()
      if (
        !(failure instanceof DOMException && failure.name === "NotFoundError")
      ) {
        setError("connectionError")
      }
    } finally {
      if (pending.current === operation) {
        pending.current = undefined
        setConnecting(false)
      }
    }
  }

  function record(
    characteristic: Characteristic,
    value: DataView,
    notified: boolean
  ) {
    const display = displayValue(value)
    setValues((previous) => new Map(previous).set(characteristic, display))
    if (notified) {
      const entry = {
        id: nextId.current++,
        time: new Date().toISOString(),
        uuid: characteristic.uuid,
        ...display,
      }
      setNotifications((previous) => [
        ...previous.slice(-(logLimit - 1)),
        entry,
      ])
    }
  }

  async function operate(action: (session: Session) => Promise<void>) {
    const session = current.current
    if (!session || pending.current) return
    const operation = Symbol()
    pending.current = operation
    setBusy(true)
    setError(undefined)
    try {
      await action(session)
    } catch {
      if (current.current === session) setError("operationError")
    } finally {
      if (pending.current === operation) {
        pending.current = undefined
        setBusy(false)
      }
    }
  }

  function read(characteristic: Characteristic) {
    return operate(async (session) => {
      const value = await characteristic.readValue()
      if (current.current === session) record(characteristic, value, false)
    })
  }

  function toggleSubscription(characteristic: Characteristic) {
    return operate(async (session) => {
      const existing = session.listeners.get(characteristic)
      if (existing) {
        await characteristic.stopNotifications()
        characteristic.removeEventListener(
          "characteristicvaluechanged",
          existing
        )
        session.listeners.delete(characteristic)
      } else {
        const listener = () => {
          if (current.current === session && characteristic.value) {
            record(characteristic, characteristic.value, true)
          }
        }
        session.listeners.set(characteristic, listener)
        characteristic.addEventListener("characteristicvaluechanged", listener)
        try {
          await characteristic.startNotifications()
        } catch (failure) {
          characteristic.removeEventListener(
            "characteristicvaluechanged",
            listener
          )
          session.listeners.delete(characteristic)
          throw failure
        }
      }
      if (current.current === session)
        setSubscribed(new Set(session.listeners.keys()))
    })
  }

  return {
    supported,
    connecting,
    connected,
    services,
    values,
    subscribed,
    notifications,
    busy,
    error,
    connect,
    disconnect,
    read,
    toggleSubscription,
    clearLog: () => setNotifications([]),
  }
}
