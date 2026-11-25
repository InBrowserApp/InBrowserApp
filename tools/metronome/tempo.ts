import { parseNumber } from "@workspace/localized-number"

const minBpm = 30
const maxBpm = 300
const tapTimeoutMs = 2500

function limitTempo(value: number) {
  return Math.min(maxBpm, Math.max(minBpm, Math.round(value)))
}

function readTempo(value: string, lang: string) {
  const locale = lang === "th" ? "th-u-nu-thai" : lang
  const result = parseNumber(value.normalize("NFKC"), locale)
  return result.kind === "valid" ? result.value : null
}

function recordTap(previous: readonly number[], time: number) {
  const last = previous.at(-1)
  const taps =
    last === undefined || time - last > tapTimeoutMs
      ? [time]
      : [...previous.slice(-4), time]
  const elapsed = time - taps[0]!
  const bpm =
    elapsed > 0 ? limitTempo((60_000 * (taps.length - 1)) / elapsed) : null
  return { taps, bpm }
}

export { limitTempo, maxBpm, minBpm, readTempo, recordTap, tapTimeoutMs }
