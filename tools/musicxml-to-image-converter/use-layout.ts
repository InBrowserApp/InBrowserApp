import { useEffect, useState } from "react"
import type {
  MeasureRange,
  renderMusicXmlScore,
} from "@workspace/score-export/musicxml"

type Layout = Awaited<ReturnType<typeof renderMusicXmlScore>>

export function useMusicXmlLayout(
  file: File | undefined,
  measures?: MeasureRange
) {
  const [state, setState] = useState<{
    file: File
    measures?: MeasureRange
    layout: Layout | null
  }>()
  useEffect(() => {
    if (!file) {
      setState(undefined)
      return
    }
    let cancelled = false
    async function render(source: File) {
      try {
        const { renderMusicXmlScore } =
          await import("@workspace/score-export/musicxml")
        if (cancelled) return
        const layout = await renderMusicXmlScore(source, { measures })
        if (!cancelled) setState({ file: source, measures, layout })
      } catch {
        if (!cancelled) setState({ file: source, measures, layout: null })
      }
    }
    void render(file)
    return () => {
      cancelled = true
    }
  }, [file, measures])
  return state?.file === file && state?.measures === measures
    ? state?.layout
    : undefined
}
