import { useEffect, useRef, useState } from "react"
import { decodePairing, localPairing } from "./pairing"
import { attachTransfer } from "./transfer"
import type { Messages } from "./types"

type Phase = "home" | "receive" | "preparing" | "invite" | "reply" | "connected"
type Session = {
  peer: RTCPeerConnection
  controller: AbortController
  send?: ReturnType<typeof attachTransfer>
  sending?: boolean
  connectTimeout?: ReturnType<typeof setTimeout>
  disconnectTimeout?: ReturnType<typeof setTimeout>
}

export function useConnection() {
  const session = useRef<Session | null>(null)
  const [phase, setPhase] = useState<Phase>("home")
  const [pending, setPending] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState<keyof Messages>()
  const [outgoing, setOutgoing] = useState<number | File | string | null>(null)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [receivedFile, setReceivedFile] = useState<File>()
  const [receivedText, setReceivedText] = useState<string>()

  function reset(nextError?: keyof Messages, nextPhase: Phase = "home") {
    closeSession(session.current)
    session.current = null
    setPhase(nextPhase)
    setPending(false)
    setCode("")
    setError(nextError)
    setOutgoing(null)
    setIncoming(null)
  }

  useEffect(() => () => closeSession(session.current), [])

  function openSession() {
    const peer = new RTCPeerConnection({ iceServers: [] })
    const controller = new AbortController()
    const active: Session = { peer, controller }
    session.current = active
    const fail = (reason: keyof Messages) => {
      if (!controller.signal.aborted) reset(reason)
    }

    function useChannel(channel: RTCDataChannel) {
      channel.onopen = () => {
        if (controller.signal.aborted) return
        clearTimeout(active.connectTimeout)
        setPending(false)
        setPhase("connected")
      }
      channel.onclose = () => fail("connectionError")
      channel.onerror = () => fail("transferError")
      active.send = attachTransfer(
        channel,
        {
          received(data) {
            if (data.kind === "file") setReceivedFile(data.file)
            else setReceivedText(data.text)
          },
          receivedProgress: setIncoming,
          sentProgress: setOutgoing,
          failed: () => fail("transferError"),
        },
        controller.signal
      )
    }

    peer.onconnectionstatechange = () => {
      switch (peer.connectionState) {
        case "failed":
        case "closed":
          fail("connectionError")
          break
        case "disconnected":
          clearTimeout(active.disconnectTimeout)
          active.disconnectTimeout = setTimeout(
            () => fail("connectionError"),
            8_000
          )
          break
        case "connected":
          clearTimeout(active.disconnectTimeout)
          break
      }
    }
    peer.ondatachannel = ({ channel }) => useChannel(channel)
    return { active, useChannel }
  }

  async function begin(invite?: string) {
    const waiting: Phase = invite === undefined ? "preparing" : "receive"
    reset(undefined, waiting)
    if (
      typeof RTCPeerConnection === "undefined" ||
      typeof CompressionStream === "undefined" ||
      typeof DecompressionStream === "undefined"
    ) {
      reset("unsupported")
      return
    }
    setPending(true)
    let active: Session | undefined
    let failure: keyof Messages = "connectionError"
    try {
      const opened = openSession()
      active = opened.active
      const { peer, controller } = active
      if (invite === undefined) {
        opened.useChannel(peer.createDataChannel("local-transfer"))
      } else {
        failure = "badInvite"
        const offer = await decodePairing(invite, "offer")
        controller.signal.throwIfAborted()
        await peer.setRemoteDescription(offer)
        failure = "connectionError"
      }
      const pairing = await localPairing(
        peer,
        invite === undefined ? "offer" : "answer",
        controller.signal
      )
      controller.signal.throwIfAborted()
      if (invite === undefined) {
        const link = new URL(window.location.href)
        link.hash = new URLSearchParams({ invite: pairing }).toString()
        setCode(link.toString())
        setPhase("invite")
      } else {
        setCode(pairing)
        setPhase("reply")
      }
      setPending(false)
    } catch {
      if (!active?.controller.signal.aborted)
        reset(failure, invite === undefined ? "home" : "receive")
    }
  }

  async function reply(input: string) {
    const active = session.current
    if (!active) return
    const { peer, controller } = active
    setError(undefined)
    setPending(true)
    try {
      const answer = await decodePairing(input, "answer")
      controller.signal.throwIfAborted()
      active.connectTimeout = setTimeout(() => reset("connectionError"), 25_000)
      await peer.setRemoteDescription(answer)
    } catch {
      if (controller.signal.aborted) return
      clearTimeout(active.connectTimeout)
      setError("badReply")
      setPending(false)
    }
  }

  async function send(value: File | string) {
    const active = session.current
    if (!active?.send || active.sending) return
    active.sending = true
    setOutgoing(0)
    try {
      await active.send(value)
      if (!active.controller.signal.aborted) setOutgoing(value)
    } catch {
      if (!active.controller.signal.aborted) reset("transferError")
    } finally {
      active.sending = false
    }
  }

  return {
    phase,
    pending,
    code,
    error,
    outgoing,
    incoming,
    receivedFile,
    receivedText,
    begin,
    reply,
    send,
    reset,
    receive: () => reset(undefined, "receive"),
  }
}

function closeSession(session: Session | null | undefined) {
  if (!session) return
  session.controller.abort()
  clearTimeout(session.connectTimeout)
  clearTimeout(session.disconnectTimeout)
  session.peer.close()
}
