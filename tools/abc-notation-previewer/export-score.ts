import { exportScore, type ScoreFormat } from "@workspace/score-export"
import {
  flowScorePages,
  inScoreHost,
  pageContentWidth,
} from "@workspace/score-export/pages"
import { renderAbc, TuneBook } from "abcjs"
import { prepareAbc } from "./core/source"
import { abcLayout } from "./render-options"

export async function exportAbc(
  source: string,
  format: ScoreFormat,
  name: string,
  language: string
) {
  const pages = await inScoreHost(pageContentWidth, (host) => {
    const book = new TuneBook(prepareAbc(source))
    const tunes = book.tunes.flatMap((tune) => {
      const target = document.createElement("div")
      host.append(target)
      const [result] = renderAbc(target, tune.abc, {
        ...abcLayout(pageContentWidth),
        paddingleft: 0,
        paddingright: 0,
        add_classes: true,
        oneSvgPerLine: true,
      })
      if (!result?.lines.some((line) => line.staff?.length)) return []
      return [Array.from(target.querySelectorAll<SVGSVGElement>("svg"))]
    })
    return flowScorePages(tunes)
  })
  return exportScore(pages, format, name, language)
}
