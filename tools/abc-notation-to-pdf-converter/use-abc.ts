import { useEffect, useState } from "react"
import type { AbcTune } from "@workspace/score-export/abc"
import type { ScorePaper } from "@workspace/score-export/pages"

type BookTune = { key: string; tune: AbcTune }

function keyTunes(tunes: AbcTune[]): BookTune[] {
  const occurrences = new Map<string, number>()
  return tunes.map((tune, index) => {
    if (!tune.id) return { key: `position:${index}`, tune }
    const count = occurrences.get(tune.id) ?? 0
    occurrences.set(tune.id, count + 1)
    return { key: `reference:${tune.id}:${count}`, tune }
  })
}

export function useAbcBook(source: string) {
  const [state, setState] = useState<{
    source: string
    book: BookTune[] | null
  }>()
  useEffect(() => {
    if (!source.trim()) {
      setState(undefined)
      return
    }
    let cancelled = false
    async function read() {
      try {
        const { readAbcTunes } = await import("@workspace/score-export/abc")
        if (!cancelled)
          setState({ source, book: keyTunes(readAbcTunes(source)) })
      } catch {
        if (!cancelled) setState({ source, book: null })
      }
    }
    const timer = window.setTimeout(() => void read(), 140)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [source])
  return state?.source === source ? state.book : undefined
}

export function useAbcPages(tunes: AbcTune[] | undefined, paper: ScorePaper) {
  const [state, setState] = useState<{
    tunes: AbcTune[]
    paper: ScorePaper
    pages: SVGSVGElement[] | null
  }>()
  useEffect(() => {
    if (!tunes?.length) {
      setState(undefined)
      return
    }
    let cancelled = false
    async function layout(selected: AbcTune[]) {
      try {
        const { renderAbcPages } = await import("@workspace/score-export/abc")
        if (cancelled) return
        const pages = await renderAbcPages(selected, paper)
        if (!cancelled) setState({ tunes: selected, paper, pages })
      } catch {
        if (!cancelled) setState({ tunes: selected, paper, pages: null })
      }
    }
    void layout(tunes)
    return () => {
      cancelled = true
    }
  }, [tunes, paper])
  return state?.tunes === tunes && state?.paper === paper
    ? state?.pages
    : undefined
}
