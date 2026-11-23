// @vitest-environment node
import { readFile } from "node:fs/promises"
import {
  BlobSource,
  EncodedPacketSink,
  Input,
  MP4,
  WEBM,
  type InputAudioTrack,
} from "mediabunny"
import { describe, expect, it } from "vitest"
import { openVideo, readAudioTracks } from "./extract"

async function fixture(extension: string) {
  const name = `multitrack.${extension}`
  const bytes = await readFile(new URL(`./fixtures/${name}`, import.meta.url))
  return new File([new Uint8Array(bytes)], name)
}

async function payloads(track: InputAudioTrack) {
  const packets = []
  for await (const packet of new EncodedPacketSink(track).packets()) {
    packets.push(packet.data)
  }
  return packets
}

describe("extracting selected audio packets", () => {
  it.each([
    ["mp4", "m4a", "audio/mp4", ["aac", "aac"]],
    ["webm", "webm", "audio/webm", ["opus", "vorbis"]],
  ] as const)(
    "exports individual %s tracks without transcoding",
    async (extension, outputExtension, type, codecs) => {
      using input = openVideo(await fixture(extension))
      const tracks = await readAudioTracks(input)
      expect(
        tracks.map(({ number, codec, language }) => ({
          number,
          codec,
          language,
        }))
      ).toEqual([
        { number: 1, codec: codecs[0], language: "eng" },
        { number: 2, codec: codecs[1], language: "spa" },
      ])
      if (extension === "webm") expect(tracks[1]?.name).toBe("Commentary")

      const originals = await input.getAudioTracks()
      for (const track of tracks) {
        expect(track.output?.extension).toBe(outputExtension)
        const blob = await track.output!.extract(new AbortController().signal)
        expect(blob.type).toBe(type)
        using result = new Input({
          formats: [MP4, WEBM],
          source: new BlobSource(blob),
        })
        expect(await result.getVideoTracks()).toHaveLength(0)
        const [audio, ...otherTracks] = await result.getAudioTracks()
        expect(otherTracks).toHaveLength(0)
        expect(await audio!.getCodec()).toBe(track.codec)
        expect(await audio!.getLanguageCode()).toBe(track.language)
        const original = originals[track.number - 1]!
        expect(await payloads(audio!)).toEqual(await payloads(original))
        if ((await original.getFirstTimestamp()) > 0) {
          expect(await audio!.getFirstTimestamp()).toBeCloseTo(0)
        }
      }
    }
  )

  it("rejects invalid media and honors canceled selections", async () => {
    using invalid = openVideo(new File(["invalid"], "invalid.mp4"))
    await expect(readAudioTracks(invalid)).rejects.toThrow(
      "Input has an unsupported or unrecognizable format."
    )

    using input = openVideo(await fixture("mp4"))
    const [track] = await readAudioTracks(input)
    const signal = AbortSignal.abort()
    await expect(track!.output!.extract(signal)).rejects.toBe(signal.reason)
  })
})
