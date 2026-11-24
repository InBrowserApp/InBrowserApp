import { BLOCK_SIZE, StorageError } from "./file-storage"
import type { FileHeader, FileStorage } from "./file-storage"

const FRAME_SIZE = 16 * 1024
export const TEXT_LIMIT = 1024 * 1024

type Header = FileHeader & { kind: "text" | "file" }
type Receipt = { type: "ready" | "saved" | "delivered"; offset: number }
type Control =
  | { type: "start"; header: Header }
  | { type: "block"; offset: number; hash: string }
  | { type: "end" }
  | { type: "storage-error" }
  | Receipt

export type Received =
  | { kind: "text"; text: string }
  | { kind: "file"; file: File; name: string }

type TransferEvents = {
  received: (data: Received) => void
  receivedProgress: (progress: number | null) => void
  sentProgress: (progress: number) => void
  receivingFile?: (active: boolean) => void
  failed: (reason?: "storageError") => void
}

function parseControl(data: string): Control {
  const frame = JSON.parse(data) as Control | null
  switch (frame?.type) {
    case "start": {
      const header = frame.header
      if (
        header &&
        (header.kind === "file" || header.kind === "text") &&
        typeof header.id === "string" &&
        /^[\da-f-]{36}$/i.test(header.id) &&
        typeof header.name === "string" &&
        Number.isSafeInteger(header.size) &&
        header.size >= 0 &&
        (header.kind === "file" || header.size <= TEXT_LIMIT)
      )
        return frame
      break
    }
    case "block":
      if (
        Number.isSafeInteger(frame.offset) &&
        typeof frame.hash === "string" &&
        /^[\da-f]{64}$/.test(frame.hash)
      )
        return frame
      break
    case "ready":
    case "saved":
    case "delivered":
      if (Number.isSafeInteger(frame.offset) && frame.offset >= 0) return frame
      break
    case "end":
    case "storage-error":
      return frame
  }
  throw new Error("Invalid transfer frame")
}

async function checksum(data: Uint8Array<ArrayBuffer>) {
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", data))
  return Array.from(hash, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function percent(offset: number, size: number) {
  return size === 0 ? 100 : Math.floor((offset / size) * 100)
}

export function attachTransfer(
  channel: RTCDataChannel,
  events: TransferEvents,
  signal: AbortSignal,
  storage: FileStorage
) {
  channel.binaryType = "arraybuffer"
  let incoming:
    | {
        header: Header
        offset: number
        buffer: Uint8Array<ArrayBuffer>
        buffered: number
        text: string
      }
    | undefined
  let reply: ((receipt: Receipt) => void) | undefined
  let rejectReply: ((error: Error) => void) | undefined
  let busy = false
  let failed = false

  function control(frame: Control) {
    channel.send(JSON.stringify(frame))
  }

  async function receive(frame: Control) {
    if (frame.type === "start") {
      if (incoming) throw new Error("Transfer already in progress")
      const { header } = frame
      const offset = header.kind === "file" ? await storage.open(header) : 0
      signal.throwIfAborted()
      incoming = {
        header,
        offset,
        buffer: new Uint8Array(BLOCK_SIZE),
        buffered: 0,
        text: "",
      }
      if (header.kind === "file") events.receivingFile?.(true)
      events.receivedProgress(percent(offset, header.size))
      control({ type: "ready", offset })
      return
    }

    if (!incoming) throw new Error("No incoming transfer")
    const { header, offset, buffer, buffered } = incoming
    if (frame.type === "end" && offset === header.size) {
      const received: Received =
        header.kind === "file"
          ? {
              kind: "file",
              file: await storage.finish(header.id),
              name: header.name,
            }
          : { kind: "text", text: incoming.text }
      signal.throwIfAborted()
      incoming = undefined
      if (header.kind === "file") events.receivingFile?.(false)
      events.received(received)
      events.receivedProgress(null)
      control({ type: "delivered", offset })
      return
    }

    if (
      frame.type !== "block" ||
      frame.offset !== offset ||
      buffered === 0 ||
      buffered !== Math.min(BLOCK_SIZE, header.size - offset)
    ) {
      throw new Error("Unexpected transfer block")
    }
    const block = buffer.subarray(0, buffered)
    if ((await checksum(block)) !== frame.hash)
      throw new Error("Block checksum mismatch")
    signal.throwIfAborted()
    if (header.kind === "file") {
      await storage.write(header.id, offset, block)
    } else {
      incoming.text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(
        block
      )
    }
    signal.throwIfAborted()
    incoming.offset += buffered
    incoming.buffered = 0
    events.receivedProgress(percent(incoming.offset, header.size))
    control({ type: "saved", offset: incoming.offset })
  }

  function fail(error: unknown) {
    if (failed || signal.aborted) return
    if (error instanceof StorageError) {
      incoming = undefined
      busy = false
      try {
        control({ type: "storage-error" })
      } catch {
        failed = true
        events.failed()
        return
      }
      events.receivedProgress(null)
      events.receivingFile?.(false)
      events.failed("storageError")
    } else {
      failed = true
      events.failed()
    }
  }

  channel.onmessage = ({ data }: MessageEvent<string | ArrayBuffer>) => {
    if (failed || signal.aborted) return
    try {
      if (typeof data === "string") {
        const frame = parseControl(data)
        if (
          frame.type === "ready" ||
          frame.type === "saved" ||
          frame.type === "delivered"
        ) {
          reply?.(frame)
          return
        }
        if (frame.type === "storage-error") {
          rejectReply?.(new StorageError(undefined))
          return
        }
        if (busy) throw new Error("The previous block is still being verified")
        busy = true
        void receive(frame).then(() => {
          busy = false
        }, fail)
        return
      }
      if (
        busy ||
        !incoming ||
        data.byteLength === 0 ||
        incoming.buffered + data.byteLength >
          Math.min(BLOCK_SIZE, incoming.header.size - incoming.offset)
      ) {
        throw new Error("Unexpected binary frame")
      }
      incoming.buffer.set(new Uint8Array(data), incoming.buffered)
      incoming.buffered += data.byteLength
    } catch (error) {
      fail(error)
    }
  }

  async function exchange(
    frame: Control,
    expected: Receipt["type"],
    block?: Uint8Array<ArrayBuffer>
  ) {
    const deadline = AbortSignal.any([signal, AbortSignal.timeout(45_000)])
    deadline.throwIfAborted()
    let abort: () => void
    return new Promise<number>((resolve, reject) => {
      abort = () => reject(deadline.reason)
      reply = (receipt) => {
        if (receipt.type === expected) resolve(receipt.offset)
        else reject(new Error("Unexpected transfer receipt"))
      }
      rejectReply = reject
      deadline.addEventListener("abort", abort, { once: true })
      try {
        if (block) {
          for (let index = 0; index < block.length; index += FRAME_SIZE) {
            channel.send(block.subarray(index, index + FRAME_SIZE))
          }
        }
        control(frame)
      } catch (error) {
        reject(error)
      }
    }).finally(() => {
      reply = undefined
      rejectReply = undefined
      deadline.removeEventListener("abort", abort)
    })
  }

  return async function send(value: File | string, id: string) {
    const file = typeof value === "string" ? new Blob([value]) : value
    const header: Header =
      typeof value === "string"
        ? { id, kind: "text", name: "", size: file.size }
        : { id, kind: "file", name: value.name, size: file.size }
    let offset = await exchange({ type: "start", header }, "ready")
    if (
      offset > file.size ||
      (offset !== file.size && offset % BLOCK_SIZE !== 0) ||
      (header.kind === "text" && offset !== 0)
    ) {
      throw new Error("Invalid resume offset")
    }
    let progress = percent(offset, file.size)
    events.sentProgress(progress)
    while (offset < file.size) {
      signal.throwIfAborted()
      const block = new Uint8Array(
        await file.slice(offset, offset + BLOCK_SIZE).arrayBuffer()
      )
      const hash = await checksum(block)
      const saved = await exchange(
        { type: "block", offset, hash },
        "saved",
        block
      )
      if (saved !== offset + block.length) throw new Error("Invalid checkpoint")
      offset = saved
      const nextProgress = percent(offset, file.size)
      if (nextProgress !== progress) {
        progress = nextProgress
        events.sentProgress(progress)
      }
    }
    if ((await exchange({ type: "end" }, "delivered")) !== file.size) {
      throw new Error("Invalid delivery receipt")
    }
  }
}
