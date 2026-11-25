import { renderMidiToWav } from "./render"
import { loadDefaultSoundBank } from "./sound-bank"

export type Request = { file: File; soundFont?: File }
export type Response =
  | Awaited<ReturnType<typeof renderMidiToWav>>
  | { type: "progress"; percent: number }
  | { type: "error"; key: "soundFontUnavailable" }

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  let input: ArrayBuffer
  try {
    input = await data.file.arrayBuffer()
  } catch {
    self.postMessage({ type: "error", key: "invalidMidi" } satisfies Response)
    return
  }

  let soundFont: ArrayBuffer
  try {
    soundFont = await (data.soundFont?.arrayBuffer() ?? loadDefaultSoundBank())
  } catch {
    self.postMessage({
      type: "error",
      key: data.soundFont ? "invalidSoundFont" : "soundFontUnavailable",
    } satisfies Response)
    return
  }

  const result = await renderMidiToWav(input, soundFont, (percent) =>
    self.postMessage({ type: "progress", percent } satisfies Response)
  ).catch(() => ({ type: "error", key: "renderFailed" }) as const)
  if (result.type === "complete")
    self.postMessage(result, { transfer: [result.wav] })
  else self.postMessage(result)
}
