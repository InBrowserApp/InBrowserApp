import { convertMusicXmlToMidi } from "./midi"

export type ConversionResult = { file: File } | { error: true }

self.onmessage = async ({ data }: MessageEvent<File>) => {
  const result: ConversionResult = await convertMusicXmlToMidi(data)
    .then((file) => ({ file }))
    .catch(() => ({ error: true }))
  self.postMessage(result)
}
