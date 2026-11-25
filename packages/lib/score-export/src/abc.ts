import { renderAbc, TuneBook } from "abcjs"
import { abcLayout, hasAbcMusic, prepareAbc } from "./abc-source"
import {
  cropScorePage,
  flowScorePages,
  inScoreHost,
  scoreContentWidth,
} from "./pages"
import type { AbcVisualParams } from "abcjs"
import type { ScoreImage } from "./export"
import type { ScorePaper } from "./pages"

export type AbcTune = TuneBook["tunes"][number]

export function readAbcTunes(source: string) {
  return new TuneBook(prepareAbc(source)).tunes
}

function renderTune(
  host: HTMLElement,
  tune: AbcTune,
  options: AbcVisualParams,
  width: number
) {
  const target = document.createElement("div")
  host.append(target)
  const [result] = renderAbc(target, tune.abc, options)
  if (!result || !hasAbcMusic(result)) return []
  const title = target.querySelector<SVGTextElement>("text.abcjs-title")
  const titleWidth = title?.getBBox().width ?? 0
  // Leave room for PDF outline fonts that are wider than the preview font.
  const titleLimit = width * 0.7
  if (title && titleWidth > titleLimit) {
    const fontSize = Number(title.getAttribute("font-size"))
    title.setAttribute(
      "font-size",
      String((fontSize * titleLimit) / titleWidth)
    )
  }
  return Array.from(target.querySelectorAll<SVGSVGElement>("svg"))
}

function tuneOptions(width: number) {
  return {
    ...abcLayout(width),
    paddingleft: 0,
    paddingright: 0,
    add_classes: true,
  }
}

export function renderAbcPages(
  tunes: readonly AbcTune[],
  paper: ScorePaper = "a4"
) {
  const width = scoreContentWidth(paper)
  const options = { ...tuneOptions(width), oneSvgPerLine: true }
  return inScoreHost(width, (host) => {
    const systems = tunes.map((tune) => renderTune(host, tune, options, width))
    return flowScorePages(systems, paper)
  })
}

export function renderAbcImages(tunes: readonly AbcTune[]) {
  const width = scoreContentWidth("a4")
  const options = tuneOptions(width)
  return inScoreHost(width, (host) =>
    tunes.flatMap((tune): ScoreImage[] => {
      const [svg] = renderTune(host, tune, options, width)
      return svg ? [{ page: cropScorePage(svg), name: tune.title }] : []
    })
  )
}
