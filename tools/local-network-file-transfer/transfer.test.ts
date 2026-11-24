// @vitest-environment node
import { describe, expect, it, vi } from "vitest"
import { BLOCK_SIZE, StorageError } from "./file-storage"
import { attachTransfer, TEXT_LIMIT } from "./transfer"
import type { FileStorage } from "./file-storage"
import type { Received } from "./transfer"

const FILE_ID = "00000000-0000-0000-0000-000000000001"
const TEXT_ID = "00000000-0000-0000-0000-000000000002"

function memoryStore(): FileStorage {
  let parts: Uint8Array<ArrayBuffer>[] = []
  let key: string | undefined
  let offset = 0
  return {
    open: vi.fn(async ({ id }) => {
      if (id !== key) {
        key = id
        offset = 0
        parts = []
      }
      return offset
    }),
    write: vi.fn(async (_id, _offset, data) => {
      parts.push(data.slice())
      offset += data.length
      return offset
    }),
    finish: vi.fn(async () => new File(parts, "storage-key")),
    dispose: vi.fn(),
    removeCompleted: vi.fn(),
  }
}

function connect(store = memoryStore()) {
  type Data = string | ArrayBuffer | Uint8Array<ArrayBuffer>
  class Channel {
    binaryType = ""
    readyState = "open"
    onmessage: ((event: { data: string | ArrayBuffer }) => void) | undefined
    send: (data: Data) => void
    constructor(deliver: (data: string | ArrayBuffer) => void) {
      this.send = (data) =>
        queueMicrotask(() =>
          deliver(data instanceof Uint8Array ? data.slice().buffer : data)
        )
    }
  }
  const first = new Channel((data) => second.onmessage?.({ data }))
  const second = new Channel((data) => first.onmessage?.({ data }))

  function endpoint(channel: Channel, storage: FileStorage) {
    const controller = new AbortController()
    const events = {
      received: vi.fn<(value: Received) => void>(),
      sentProgress: vi.fn<(value: number) => void>(),
      receivedProgress: vi.fn<(value: number | null) => void>(),
      failed: vi.fn(),
    }
    const send = attachTransfer(
      channel as unknown as RTCDataChannel,
      events,
      controller.signal,
      storage
    )
    return { channel, controller, events, send }
  }

  return [endpoint(first, memoryStore()), endpoint(second, store)] as const
}

describe("direct transfer", () => {
  it("delivers a file and exact Unicode text in opposite directions", async () => {
    const [a, b] = connect()
    const bytes = new Uint8Array(70_341).map((_, i) => i % 239)
    const text = "\uFEFF你好\r\nhttps://example.com/📎"
    await Promise.all([
      a.send(new File([bytes], "report.pdf"), FILE_ID),
      b.send(text, TEXT_ID),
    ])
    const result = b.events.received.mock.calls[0]?.[0]
    if (result?.kind !== "file") throw new Error("Expected a received file")
    expect(result.name).toBe("report.pdf")
    expect(new Uint8Array(await result.file.arrayBuffer())).toEqual(bytes)
    expect(a.events.received).toHaveBeenCalledWith({ kind: "text", text })
    expect(a.events.sentProgress).toHaveBeenLastCalledWith(100)
    expect(b.events.receivedProgress.mock.calls.slice(-2)).toEqual([
      [100],
      [null],
    ])
  })

  it("resumes on a new channel without writing the verified prefix again", async () => {
    const store = memoryStore()
    const [a, b] = connect(store)
    const bytes = new Uint8Array(BLOCK_SIZE + 23).fill(77)
    const file = new File([bytes], "resume.bin")
    const deliver = b.channel.send
    b.channel.send = (data) => {
      if (typeof data === "string" && JSON.parse(data).type === "saved") {
        a.controller.abort(new Error("interrupted"))
        b.controller.abort()
      } else {
        deliver(data)
      }
    }
    await expect(a.send(file, FILE_ID)).rejects.toThrow("interrupted")
    expect(store.write).toHaveBeenCalledOnce()

    const [newSender, newReceiver] = connect(store)
    await newSender.send(file, FILE_ID)
    expect(store.write).toHaveBeenCalledTimes(2)
    expect(store.write).toHaveBeenLastCalledWith(
      FILE_ID,
      BLOCK_SIZE,
      expect.any(Uint8Array)
    )
    const result = newReceiver.events.received.mock.calls[0]?.[0]
    if (result?.kind !== "file") throw new Error("Expected a received file")
    expect(new Uint8Array(await result.file.arrayBuffer())).toEqual(bytes)
  })

  it("rejects a corrupted block before saving it", async () => {
    const store = memoryStore()
    const [a, b] = connect(store)
    const deliver = a.channel.send
    a.channel.send = (data) =>
      deliver(data instanceof Uint8Array ? new Uint8Array(data.length) : data)
    const send = a.send(new File(["checked"], "verify.txt"), FILE_ID)
    await vi.waitFor(() => expect(b.events.failed).toHaveBeenCalledOnce())
    a.controller.abort(new Error("checksum interrupted"))
    await expect(send).rejects.toThrow("checksum interrupted")
    expect(store.write).not.toHaveBeenCalled()
    expect(b.events.received).not.toHaveBeenCalled()
  })

  it("delivers zero-byte files without writing empty frames", async () => {
    const store = memoryStore()
    const [a, b] = connect(store)
    await a.send(new File([], "empty.txt"), FILE_ID)
    expect(b.events.received).toHaveBeenCalledWith({
      kind: "file",
      name: "empty.txt",
      file: expect.objectContaining({ size: 0 }),
    })
    expect(store.write).not.toHaveBeenCalled()
  })

  it("reports receiver storage failure and still supports text on the channel", async () => {
    const store = memoryStore()
    vi.mocked(store.open).mockRejectedValueOnce(
      new StorageError(new Error("quota"))
    )
    const [a, b] = connect(store)
    await expect(
      a.send(new File(["hello"], "full.txt"), FILE_ID)
    ).rejects.toBeInstanceOf(StorageError)
    expect(b.events.failed).toHaveBeenCalledWith("storageError")
    await a.send("fallback text", TEXT_ID)
    expect(b.events.received).toHaveBeenCalledWith({
      kind: "text",
      text: "fallback text",
    })
  })

  it.each([
    ["bad JSON", "garbage"],
    [
      "invalid start",
      JSON.stringify({
        type: "start",
        header: { id: FILE_ID, kind: "file", name: "bad", size: -1 },
      }),
    ],
    [
      "oversize text",
      JSON.stringify({
        type: "start",
        header: { id: TEXT_ID, kind: "text", name: "", size: TEXT_LIMIT + 1 },
      }),
    ],
    ["unexpected end", '{"type":"end"}'],
    ["unexpected chunk", new ArrayBuffer(1)],
  ])("rejects %s", async (_, frame) => {
    const [a, b] = connect()
    a.channel.send(frame)
    await vi.waitFor(() => expect(b.events.failed).toHaveBeenCalledOnce())
    expect(b.events.received).not.toHaveBeenCalled()
  })
})
