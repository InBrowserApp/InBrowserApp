import { parseOnly, synth } from "abcjs"
import { hasAbcMusic } from "./abc-source"
import { exportScoreZip } from "./archive"
import { scoreItemNumber, tuneFilename } from "./pages"

import type { AbcTune } from "./abc"

function midiBytes(tune: AbcTune) {
  const [parsed] = parseOnly(tune.abc)
  if (!parsed || !hasAbcMusic(parsed)) {
    throw new Error("No ABC music to export")
  }

  const bytes: unknown = synth.getMidiFile(parsed, {
    midiOutputType: "binary",
  })
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("Could not create a MIDI file")
  }
  return new Uint8Array(bytes)
}

function midiFile(tune: AbcTune, basename: string): File {
  return new File(
    [midiBytes(tune)],
    `${tuneFilename(tune.title.trim() || basename)}.mid`,
    { type: "audio/midi" }
  )
}

export function compileAbcMidi(tune: AbcTune): File {
  return midiFile(tune, "score")
}

export async function exportAbcMidi(
  tunes: readonly AbcTune[],
  basename: string
): Promise<{ blob: Blob; filename: string }> {
  const [first] = tunes
  if (!first) throw new Error("No ABC tunes to export")

  const name = tuneFilename(basename)
  if (tunes.length === 1) {
    const file = midiFile(first, name)
    return { blob: file, filename: file.name }
  }

  const files: Record<string, Uint8Array> = {}
  for (const [index, tune] of tunes.entries()) {
    const number = scoreItemNumber(index, tunes.length)
    const title = tuneFilename(tune.title.trim() || name)
    files[`${number}-${title}.mid`] = midiBytes(tune)
  }
  return exportScoreZip(files, `${name}-midi.zip`, 6)
}
