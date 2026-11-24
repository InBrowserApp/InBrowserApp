import { useEffect, useRef, useState } from "react"

function connectedInputs(access: MIDIAccess) {
  return [...access.inputs.values()].filter(
    (input) => input.state === "connected"
  )
}

export function useMidiInput(
  receive: (data: Uint8Array) => void,
  switchInput: (hasInput: boolean) => void
) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [enabling, setEnabling] = useState(false)
  const [error, setError] = useState<"accessError" | "inputError">()
  const [access, setAccess] = useState<MIDIAccess>()
  const [inputs, setInputs] = useState<MIDIInput[]>([])
  const [selectedId, setSelectedId] = useState("")
  const closingPorts = useRef(new WeakMap<MIDIInput, Promise<void>>())
  const awaitingAccess = useRef<symbol | undefined>(undefined)

  useEffect(() => {
    setSupported(typeof navigator.requestMIDIAccess === "function")
    return () => {
      awaitingAccess.current = undefined
    }
  }, [])

  useEffect(() => {
    if (!access) return

    let previous: MIDIInput[] | undefined
    const refresh = () => {
      const current = connectedInputs(access)
      if (
        previous &&
        current.length === previous.length &&
        current.every((input, index) => input === previous?.[index])
      )
        return
      previous = current
      setInputs(current)
      setSelectedId((id) =>
        current.some((input) => input.id === id) ? id : (current[0]?.id ?? "")
      )
    }
    access.addEventListener("statechange", refresh)
    refresh()
    return () => access.removeEventListener("statechange", refresh)
  }, [access])

  const input = inputs.find((port) => port.id === selectedId)
  useEffect(() => {
    switchInput(!!input)
    if (!input) return

    const port = input
    let listening = true
    let started = false
    const closings = closingPorts.current
    function handleMessage(event: MIDIMessageEvent) {
      if (event.data) receive(event.data)
    }
    function open() {
      if (!listening) return
      started = true
      port.addEventListener("midimessage", handleMessage)
      return port.open()
    }
    const previousClose = closings.get(port)
    const opening = previousClose
      ? previousClose.then(open)
      : Promise.resolve(open())
    void opening.catch(() => {
      if (listening) {
        setError("inputError")
        setSelectedId("")
      }
    })
    return () => {
      listening = false
      port.removeEventListener("midimessage", handleMessage)
      const closing = opening
        .then(async () => {
          if (started) await port.close()
        })
        .catch(() => undefined)
      closings.set(port, closing)
      void closing.then(() => {
        if (closings.get(port) === closing) closings.delete(port)
      })
    }
  }, [input, receive, switchInput])

  async function enable() {
    if (
      awaitingAccess.current ||
      typeof navigator.requestMIDIAccess !== "function"
    )
      return
    const request = Symbol()
    awaitingAccess.current = request
    setEnabling(true)
    setError(undefined)
    try {
      const next = await navigator.requestMIDIAccess({ sysex: false })
      if (awaitingAccess.current === request) {
        const available = connectedInputs(next)
        setInputs(available)
        setSelectedId(available[0]?.id ?? "")
        setAccess(next)
      }
    } catch {
      if (awaitingAccess.current === request) setError("accessError")
    } finally {
      if (awaitingAccess.current === request) {
        awaitingAccess.current = undefined
        setEnabling(false)
      }
    }
  }

  function select(id: string) {
    setError(undefined)
    setSelectedId(id)
  }

  return {
    supported,
    error,
    enabled: !!access,
    enabling,
    inputs,
    input,
    enable,
    select,
  }
}
