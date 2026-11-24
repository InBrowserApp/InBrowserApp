import { useMemo } from "react"
import type { audioLevels, SilenceCut } from "./core/silence"

type Audio = ReturnType<typeof audioLevels>

export function Waveform({
  audio,
  cuts,
}: {
  audio: Audio
  cuts: SilenceCut[]
}) {
  const peaks = useMemo(() => {
    const { levels } = audio
    const bars = Math.min(180, levels.length)
    return Array.from({ length: bars }, (_, bar) => {
      const start = Math.floor((bar * levels.length) / bars)
      const end = Math.floor(((bar + 1) * levels.length) / bars)
      let peak = 0
      for (let i = start; i < end; i++) peak = Math.max(peak, levels[i]!)
      return Math.min(100, Math.max(2, 100 * Math.sqrt(Math.sqrt(peak))))
    })
  }, [audio])
  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="relative isolate h-24 overflow-hidden rounded-md border bg-muted/30 sm:h-28"
    >
      <div className="absolute inset-0 flex items-center gap-px">
        {peaks.map((size, i) => (
          // The bars keep their index as a fixed position in the audio timeline.
          <div
            key={i}
            className="grow rounded-xs bg-foreground/35"
            style={{ height: size + "%" }}
          />
        ))}
      </div>
      {cuts.map(({ start, end }) => (
        <div
          key={start}
          className="absolute inset-y-0 min-w-px border-x border-amber-600/60 bg-amber-500/25 dark:border-amber-300/45"
          style={{
            left: (start / audio.length) * 100 + "%",
            width: ((end - start) / audio.length) * 100 + "%",
          }}
        />
      ))}
    </div>
  )
}
