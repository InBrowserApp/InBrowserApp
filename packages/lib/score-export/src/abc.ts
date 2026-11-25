import { renderAbc, TuneBook } from "abcjs"
import { abcLayout, hasAbcMusic, prepareAbc } from "./abc-source"
import { flowScorePages, inScoreHost, scoreContentWidth } from "./pages"
import type { ScorePaper } from "./pages"

export type AbcTune = TuneBook["tunes"][number]

export function readAbcTunes(source: string) {
  return new TuneBook(prepareAbc(source)).tunes
}

export function renderAbcPages(
  tunes: readonly AbcTune[],
  paper: ScorePaper = "a4"
) {
  const width = scoreContentWidth(paper)
  const options = {
    ...abcLayout(width),
    paddingleft: 0,
    paddingright: 0,
    add_classes: true,
    oneSvgPerLine: true,
  }
  return inScoreHost(width, (host) => {
    const systems = tunes.flatMap((tune) => {
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
      return [Array.from(target.querySelectorAll<SVGSVGElement>("svg"))]
    })
    return flowScorePages(systems, paper)
  })
}
