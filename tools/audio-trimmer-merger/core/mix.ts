import { SAMPLE_RATE } from "./settings"
import type { JoinSettings, PcmClip } from "../types"

export function validJoin(join: JoinSettings) {
  return (
    join.mode === "none" ||
    (Number.isFinite(join.seconds) && join.seconds >= 0 && join.seconds <= 5)
  )
}

export function audioLayout(lengths: number[], join: JoinSettings) {
  const starts: number[] = []
  const overlaps = lengths.map(() => 0)
  const transition = Math.round(join.seconds * SAMPLE_RATE)
  let frames = 0
  for (let i = 0; i < lengths.length; i++) {
    if (i > 0) {
      if (join.mode === "gap") frames += transition
      if (join.mode === "crossfade") {
        overlaps[i] = Math.min(
          transition,
          Math.floor(lengths[i - 1]! / 2),
          Math.floor(lengths[i]! / 2)
        )
        frames -= overlaps[i]!
      }
    }
    starts.push(frames)
    frames += lengths[i]!
  }
  return { starts, overlaps, frames }
}

export function* mixBlocks(
  clips: PcmClip[],
  smooth: boolean,
  join: JoinSettings,
  blockSize = 16384
) {
  const lengths = clips.map((clip) => clip.channels[0]!.length)
  const layout = audioLayout(lengths, join)
  const channels = Math.max(...clips.map((clip) => clip.channels.length))
  for (let position = 0; position < layout.frames; position += blockSize) {
    const size = Math.min(blockSize, layout.frames - position)
    const block = Array.from({ length: channels }, () => new Float32Array(size))
    for (let clipIndex = 0; clipIndex < clips.length; clipIndex++) {
      const clip = clips[clipIndex]!
      const offset = layout.starts[clipIndex]!
      const length = lengths[clipIndex]!
      const first = Math.max(0, position - offset)
      const last = Math.min(length, position + size - offset)
      const fade = smooth ? Math.min(480, Math.floor(length / 2)) : 0
      const fadeIn = layout.overlaps[clipIndex]!
      const fadeOut = layout.overlaps[clipIndex + 1] ?? 0
      for (let frame = first; frame < last; frame++) {
        let gain = 1
        if (fadeIn && frame < fadeIn) gain *= frame / fadeIn
        if (fadeOut && frame >= length - fadeOut)
          gain *= (length - frame) / fadeOut
        if (fade)
          gain *= Math.min(
            1,
            fadeIn ? 1 : frame / fade,
            fadeOut ? 1 : (length - 1 - frame) / fade
          )
        for (let channel = 0; channel < channels; channel++) {
          const source =
            clip.channels[Math.min(channel, clip.channels.length - 1)]!
          const destination = frame + offset - position
          block[channel]![destination] =
            block[channel]![destination]! + source[frame]! * gain
        }
      }
    }
    for (const channel of block) {
      for (let i = 0; i < size; i++)
        channel[i] = Math.max(-1, Math.min(1, channel[i]!))
    }
    yield block
  }
}
