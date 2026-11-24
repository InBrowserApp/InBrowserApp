import { useEffect, useRef, useState } from "react"
import { createFileStorage, StorageError } from "./file-storage"
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
  const [storage] = useState(createFileStorage)
  const [fileIds] = useState(() => new WeakMap<File, string>())
  const [resumeFile, setResumeFile] = useState<File>()
  const [phase, setPhase] = useState<Phase>("home")
  const [pending, setPending] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState<keyof Messages>()
  const [outgoing, setOutgoing] = useState<number | File | string | null>(null)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [receivingFile, setReceivingFile] = useState(false)
  const [receivedFiles, setReceivedFiles] = useState<
    { file: File; name: string }[]
  >([])
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

  useEffect(
    () => () => {
      closeSession(session.current)
      void storage.dispose()
    },
    [storage]
  )

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
            if (data.kind === "file") {
              setReceivedFiles((files) =>
                files.some(({ file }) => file.name === data.file.name)
                  ? files
                  : [data, ...files]
              )
            } else setReceivedText(data.text)
          },
          receivedProgress: setIncoming,
          receivingFile: setReceivingFile,
          sentProgress: setOutgoing,
          failed: (reason) => {
            if (reason) setError(reason)
            else fail("transferError")
          },
        },
        controller.signal,
        storage
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
      typeof DecompressionStream === "undefined" ||
      !globalThis.crypto?.subtle ||
      typeof globalThis.crypto?.randomUUID !== "function"
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
    setError(undefined)
    setOutgoing(0)
    const file = typeof value === "string" ? undefined : value
    const id = (file && fileIds.get(file)) || crypto.randomUUID()
    if (file) {
      fileIds.set(file, id)
      setResumeFile(file)
    }
    try {
      await active.send(value, id)
      if (!active.controller.signal.aborted) {
        setOutgoing(value)
        if (file) {
          fileIds.delete(file)
          setResumeFile(undefined)
        }
      }
    } catch (error) {
      if (!active.controller.signal.aborted) {
        if (error instanceof StorageError) {
          if (file) fileIds.delete(file)
          setResumeFile(undefined)
          setError("storageError")
          setOutgoing(null)
        } else {
          reset("transferError")
        }
      }
    } finally {
      active.sending = false
    }
  }

  async function removeFile(file: File) {
    try {
      await storage.removeCompleted(file.name)
      setReceivedFiles((files) =>
        files.filter((received) => received.file.name !== file.name)
      )
    } catch {
      setError("storageError")
    }
  }

  return {
    phase,
    pending,
    code,
    error,
    outgoing,
    incoming,
    receivedFiles,
    removeFile,
    receivedText,
    resumeFile,
    receivingFile,
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
