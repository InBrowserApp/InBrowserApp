// @vitest-environment node
import { describe, expect, it, vi } from "vitest"
import { attachTransfer, FILE_LIMIT, TEXT_LIMIT } from "./transfer"
import type { Received } from "./transfer"

function connect() {
  class Channel {
    binaryType = ""
    bufferedAmount = 0
    onmessage: ((event: { data: string | ArrayBuffer }) => void) | undefined
    send: (data: string | ArrayBuffer) => void
    constructor(deliver: (data: string | ArrayBuffer) => void) {
      this.send = (data) => queueMicrotask(() => deliver(data))
    }
  }
  const first = new Channel((data) => second.onmessage?.({ data }))
  const second = new Channel((data) => first.onmessage?.({ data }))

  function endpoint(channel: Channel) {
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
      controller.signal
    )
    return { channel, controller, events, send }
  }

  return [endpoint(first), endpoint(second)] as const
}

describe("direct transfer", () => {
  it("delivers a multi-chunk file and exact Unicode text in opposite directions", async () => {
    const [a, b] = connect()
    const bytes = new Uint8Array(70_341).map((_, i) => i % 239)
    const text = "\uFEFF你好\r\nhttps://example.com/📎"
    await Promise.all([a.send(new File([bytes], "report.pdf")), b.send(text)])

    const result = b.events.received.mock.calls[0]?.[0]
    expect(result?.kind).toBe("file")
    if (result?.kind !== "file") throw new Error("Expected a received file")
    expect(result.file.name).toBe("report.pdf")
    expect(new Uint8Array(await result.file.arrayBuffer())).toEqual(bytes)
    expect(a.events.received).toHaveBeenCalledWith({ kind: "text", text })
    expect(a.events.sentProgress).toHaveBeenLastCalledWith(100)
    expect(b.events.receivedProgress.mock.calls.slice(-2)).toEqual([
      [100],
      [null],
    ])
  })

  it("delivers a zero-byte file", async () => {
    const [a, b] = connect()
    await a.send(new File([], "empty.txt"))
    expect(b.events.received).toHaveBeenCalledWith({
      kind: "file",
      file: expect.objectContaining({ name: "empty.txt", size: 0 }),
    })
  })

  it.each([
    ["unknown frame", "garbage"],
    ["null header", "null"],
    ["unknown kind", '{"kind":"url","name":"","size":2}'],
    ["invalid filename", '{"kind":"file","size":2}'],
    ["invalid size", '{"kind":"file","name":"file","size":-1}'],
    ["non-integer size", '{"kind":"file","name":"file","size":1.5}'],
    [
      "oversize file",
      JSON.stringify({ kind: "file", name: "a", size: FILE_LIMIT + 1 }),
    ],
    [
      "oversize text",
      JSON.stringify({ kind: "text", name: "", size: TEXT_LIMIT + 1 }),
    ],
    ["unexpected end", "end"],
    ["unexpected chunk", new ArrayBuffer(1)],
  ])("rejects %s", async (_, frame) => {
    const [a, b] = connect()
    a.channel.send(frame)
    await vi.waitFor(() => expect(b.events.failed).toHaveBeenCalledOnce())
    expect(b.events.received).not.toHaveBeenCalled()
  })

  const header = JSON.stringify({ kind: "file", name: "test.txt", size: 1 })
  it.each([new ArrayBuffer(0), new ArrayBuffer(2), header, "end"])(
    "rejects invalid data after a header",
    async (frame) => {
      const [a, b] = connect()
      a.channel.send(header)
      a.channel.send(frame)
      await vi.waitFor(() => expect(b.events.failed).toHaveBeenCalledOnce())
    }
  )

  it("aborts while waiting for the channel buffer to drain", async () => {
    const [a] = connect()
    a.channel.bufferedAmount = 1_048_576
    const send = a.send("hello")
    a.controller.abort(new Error("closed"))
    await expect(send).rejects.toThrow("closed")
  })

  it("aborts while awaiting delivery confirmation", async () => {
    const [a, b] = connect()
    b.channel.send = () => {}
    const send = a.send(new File([], "empty"))
    a.controller.abort(new Error("closed"))
    await expect(send).rejects.toThrow("closed")
  })
})
