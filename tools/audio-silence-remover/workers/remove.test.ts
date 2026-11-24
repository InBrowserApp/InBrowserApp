import { afterEach, expect, it, vi } from "vitest"
import type { Request } from "./remove"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it("transfers analysis and renders only the requested ranges as WAV", async () => {
  const scope = {
    onmessage: null as unknown as (event: MessageEvent<Request>) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./remove")
  const send = (data: Request) =>
    scope.onmessage(new MessageEvent("message", { data }))
  send({ type: "edit", cuts: [] })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ type: "error" })
  const samples = new Float32Array(48_000).fill(0.25)
  send({ type: "analyze", channels: [samples] })
  const audio = scope.postMessage.mock.lastCall?.[0].audio
  expect(audio.length).toBe(48_000)
  expect(scope.postMessage).toHaveBeenLastCalledWith(
    { type: "analyzed", audio },
    { transfer: [audio.levels.buffer] }
  )
  send({ type: "edit", cuts: [{ start: 24_000, end: 48_000 }] })
  const wav = scope.postMessage.mock.lastCall?.[0].wav
  expect(wav.byteLength).toBe(44 + 2 * 24_000)
  expect(scope.postMessage).toHaveBeenLastCalledWith(
    { type: "edited", wav },
    { transfer: [wav] }
  )
})
