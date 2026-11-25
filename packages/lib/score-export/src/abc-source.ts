import type { AbcVisualParams, TuneObject } from "abcjs"

export function abcLayout(staffwidth: number): AbcVisualParams {
  return {
    staffwidth,
    wrap: {
      preferredMeasuresPerLine: 4,
      minSpacing: 1.8,
      maxSpacing: 2.7,
    },
  }
}

export function prepareAbc(source: string) {
  const normalized = source.replace(/\r\n?/g, "\n")
  const firstTune = normalized.search(/^X:/m)
  if (firstTune <= 0) return normalized

  // abcjs keeps file-wide directives but drops these ABC header defaults.
  const header = normalized.slice(0, firstTune)
  const defaults = header.split("\n").filter((line) => /^[LMQ]:/.test(line))
  if (defaults.length === 0) return normalized

  return (
    header +
    normalized
      .slice(firstTune)
      .replace(/^X:[^\n]*$/gm, (line) => `${line}\n${defaults.join("\n")}`)
  )
}

export function hasAbcMusic(tune: TuneObject) {
  return tune.lines.some(({ staff }) =>
    staff?.some(({ voices }) =>
      voices?.some((voice) => voice.some(({ el_type }) => el_type === "note"))
    )
  )
}
