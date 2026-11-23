import {
  BlobSource,
  BufferTarget,
  EncodedAudioPacketSource,
  EncodedPacketSink,
  Input,
  MP4,
  Mp4OutputFormat,
  Output,
  WEBM,
  WebMOutputFormat,
  type InputAudioTrack,
} from "mediabunny"

export type Track = {
  number: number
  codec: string
  language: string
  name: string | null
  output?: {
    extension: "m4a" | "webm"
    extract: (signal: AbortSignal) => Promise<Blob>
  }
}

export function openVideo(file: File) {
  return new Input({ formats: [MP4, WEBM], source: new BlobSource(file) })
}

export async function readAudioTracks(input: Input): Promise<Track[]> {
  const format = await input.getFormat()
  return Promise.all(
    (await input.getAudioTracks()).map(async (track) => {
      const [codec, languageCode, name] = await Promise.all([
        track.getCodec(),
        track.getLanguageCode(),
        track.getName(),
      ])
      const details = {
        number: track.number,
        codec: codec ?? String((await track.getInternalCodecId()) ?? ""),
        language: languageCode.toLowerCase(),
        name,
      }
      if (
        !(
          (format === MP4 && codec === "aac") ||
          (format === WEBM && (codec === "opus" || codec === "vorbis"))
        )
      ) {
        return details
      }
      const extension = codec === "aac" ? "m4a" : "webm"
      return {
        ...details,
        output: {
          extension,
          extract: (signal) => remux(track, codec, extension, details, signal),
        },
      }
    })
  )
}

async function remux(
  track: InputAudioTrack,
  codec: "aac" | "opus" | "vorbis",
  extension: "m4a" | "webm",
  { language, name }: Pick<Track, "language" | "name">,
  signal: AbortSignal
) {
  const sink = new EncodedPacketSink(track)
  const [first, decoderConfig] = await Promise.all([
    sink.getFirstPacket(),
    track.getDecoderConfig(),
  ])
  signal.throwIfAborted()
  if (!first || !decoderConfig) throw new Error("Missing audio data")

  const target = new BufferTarget()
  const output = new Output({
    format:
      extension === "m4a" ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  })
  const source = new EncodedAudioPacketSource(codec)
  output.addAudioTrack(source, {
    // WebM may return a BCP 47 subtag. The muxer accepts ISO 639-2 only.
    languageCode: /^[a-z]{3}$/.test(language) ? language : undefined,
    name: name || undefined,
    decoderConfig,
  })
  // Start delayed tracks at zero and retain negative timestamps for codec priming.
  const offset = Math.max(0, first.timestamp)
  try {
    await output.start()
    for await (const packet of sink.packets(first)) {
      signal.throwIfAborted()
      await source.add(
        offset ? packet.clone({ timestamp: packet.timestamp - offset }) : packet
      )
    }
    await output.finalize()
    return new Blob([target.buffer!], {
      type: extension === "m4a" ? "audio/mp4" : "audio/webm",
    })
  } catch (error) {
    await output.cancel()
    throw error
  }
}
