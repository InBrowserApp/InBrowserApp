import { tuneFilename } from "@workspace/score-export/pages"
import { parseMidi } from "midi-file"
import { VerovioToolkit } from "verovio/esm"
import createVerovioModule from "verovio/wasm"

function decodeMusicXml(data: Uint8Array<ArrayBuffer>) {
  const [first, second] = data
  if (first === 0xff && second === 0xfe) {
    return new TextDecoder("utf-16le").decode(data)
  }
  if (first === 0xfe && second === 0xff) {
    return new TextDecoder("utf-16be").decode(data)
  }
  return new TextDecoder().decode(data)
}

export async function convertMusicXmlToMidi(file: File): Promise<File> {
  const [data, module] = await Promise.all([
    file.arrayBuffer(),
    createVerovioModule(),
  ])
  const toolkit = new VerovioToolkit(module)

  try {
    toolkit.setOptions({ inputFrom: "xml" })
    const bytes = new Uint8Array(data)
    const [first, second, third, fourth] = bytes
    const compressed =
      first === 0x50 && second === 0x4b && third === 0x03 && fourth === 0x04
    const loaded = compressed
      ? toolkit.loadZipDataBuffer(data)
      : toolkit.loadData(decodeMusicXml(bytes))

    if (!loaded) throw new Error("Could not load the MusicXML score")

    const midi = Uint8Array.from(atob(toolkit.renderToMIDI()), (byte) =>
      byte.charCodeAt(0)
    )
    const { tracks } = parseMidi(midi)
    if (
      !tracks.some((track) =>
        track.some((event) => event.type === "noteOn" && event.velocity > 0)
      )
    ) {
      throw new Error("The score has no playable notes")
    }

    const basename = tuneFilename(
      file.name.replace(/\.(?:musicxml|xml|mxl)$/i, "")
    )
    return new File([midi], `${basename}.mid`, { type: "audio/midi" })
  } finally {
    toolkit.destroy()
  }
}
