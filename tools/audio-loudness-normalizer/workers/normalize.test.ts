import { afterEach, describe, expect, it, vi } from "vitest"
import type { Request } from "./normalize"

afterEach(() => {
  self.onmessage = null
  vi.unstubAllGlobals()
  vi.resetModules()
})

async function setup() {
  const postMessage = vi.fn()
  vi.stubGlobal("postMessage", postMessage)
  await import("./normalize")
  const send = (data: Request) =>
    self.onmessage?.(new MessageEvent("message", { data }))
  return { send, postMessage }
}

describe("normalization worker", () => {
  it("measures a file and transfers a normalized WAV", async () => {
    const { send, postMessage } = await setup()
    const tone = Float32Array.from(
      { length: 48_000 },
      (_, i) => Math.sin(i / 10) / 8
    )
    send({ type: "measure", channels: [tone] })
    expect(postMessage).toHaveBeenCalledWith({
      type: "measured",
      loudness: expect.any(Number),
      peak: expect.any(Number),
    })
    send({ type: "render", target: -16, id: 1 })
    const wav = postMessage.mock.lastCall?.[0].wav
    expect(wav).toBeInstanceOf(ArrayBuffer)
    expect(postMessage).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "rendered", id: 1 }),
      { transfer: [wav] }
    )
  })

  it("returns a quiet status for silence and a render error before measuring", async () => {
    const { send, postMessage } = await setup()
    send({ type: "render", target: -16, id: 2 })
    expect(postMessage).toHaveBeenCalledWith({ type: "renderError", id: 2 })
    send({ type: "measure", channels: [new Float32Array(1000)] })
    expect(postMessage).toHaveBeenLastCalledWith({ type: "quiet" })
  })
})
