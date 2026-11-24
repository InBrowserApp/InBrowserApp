const CHUNK_SIZE = 16 * 1024
export const FILE_LIMIT = 128 * 1024 * 1024
export const TEXT_LIMIT = 1024 * 1024

type Header = { kind: "text" | "file"; size: number; name: string }

export type Received =
  | { kind: "text"; text: string }
  | { kind: "file"; file: File }

function parseHeader(message: string): Header {
  const header = JSON.parse(message) as Partial<Header> | null
  if (
    !header ||
    (header.kind !== "file" && header.kind !== "text") ||
    typeof header.name !== "string" ||
    typeof header.size !== "number" ||
    !Number.isSafeInteger(header.size) ||
    header.size < 0 ||
    header.size > (header.kind === "file" ? FILE_LIMIT : TEXT_LIMIT)
  ) {
    throw new Error("Invalid transfer header")
  }
  return { kind: header.kind, name: header.name, size: header.size }
}

type TransferEvents = {
  received: (data: Received) => void
  receivedProgress: (progress: number | null) => void
  sentProgress: (progress: number) => void
  failed: () => void
}

export function attachTransfer(
  channel: RTCDataChannel,
  events: TransferEvents,
  signal: AbortSignal
) {
  channel.binaryType = "arraybuffer"
  let incoming:
    | { header: Header; parts: ArrayBuffer[]; bytes: number; progress: number }
    | undefined
  let acknowledge: (() => void) | undefined

  async function receive(data: string | ArrayBuffer) {
    if (data === "delivered") {
      acknowledge?.()
      return
    }

    if (data === "end") {
      if (!incoming || incoming.bytes !== incoming.header.size) {
        throw new Error("Incomplete transfer")
      }
      const { header, parts } = incoming
      incoming = undefined
      const value = new File(parts, header.name)
      const result: Received =
        header.kind === "text"
          ? {
              kind: "text",
              text: new TextDecoder("utf-8", { ignoreBOM: true }).decode(
                await value.arrayBuffer()
              ),
            }
          : { kind: "file", file: value }
      signal.throwIfAborted()
      events.received(result)
      events.receivedProgress(null)
      channel.send("delivered")
      return
    }

    if (typeof data === "string") {
      if (incoming) throw new Error("Transfer already in progress")
      incoming = { header: parseHeader(data), parts: [], bytes: 0, progress: 0 }
      events.receivedProgress(0)
      return
    }

    if (
      !incoming ||
      data.byteLength === 0 ||
      incoming.bytes + data.byteLength > incoming.header.size
    ) {
      throw new Error("Unexpected file chunk")
    }
    incoming.parts.push(data)
    incoming.bytes += data.byteLength
    const progress = Math.floor((100 * incoming.bytes) / incoming.header.size)
    if (progress !== incoming.progress) {
      incoming.progress = progress
      events.receivedProgress(progress)
    }
  }

  channel.onmessage = ({ data }: MessageEvent<string | ArrayBuffer>) => {
    void receive(data).catch(() => {
      if (!signal.aborted) events.failed()
    })
  }

  async function send(value: File | string) {
    const file = typeof value === "string" ? new Blob([value]) : value
    const header: Header =
      typeof value === "string"
        ? { kind: "text", name: "", size: file.size }
        : { kind: "file", name: value.name, size: file.size }
    channel.send(JSON.stringify(header))
    let reported = 0
    for (let offset = 0; offset < file.size; offset += CHUNK_SIZE) {
      while (channel.bufferedAmount > CHUNK_SIZE * 16) {
        signal.throwIfAborted()
        await new Promise((resolve) => setTimeout(resolve, 25))
      }
      const chunk = await file.slice(offset, offset + CHUNK_SIZE).arrayBuffer()
      signal.throwIfAborted()
      channel.send(chunk)
      const progress = Math.floor(
        (100 * Math.min(offset + CHUNK_SIZE, file.size)) / file.size
      )
      if (progress !== reported) {
        events.sentProgress(progress)
        reported = progress
      }
    }
    const delivered = AbortSignal.any([signal, AbortSignal.timeout(30_000)])
    delivered.throwIfAborted()
    await new Promise<void>((resolve, reject) => {
      const abort = () => reject(delivered.reason)
      acknowledge = () => {
        delivered.removeEventListener("abort", abort)
        resolve()
      }
      delivered.addEventListener("abort", abort, { once: true })
      try {
        channel.send("end")
      } catch (error) {
        delivered.removeEventListener("abort", abort)
        reject(error)
      }
    }).finally(() => {
      acknowledge = undefined
    })
  }

  return send
}
