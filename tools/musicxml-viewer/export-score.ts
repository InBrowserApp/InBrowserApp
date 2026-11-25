import { exportScore, type ScoreFormat } from "@workspace/score-export"
import {
  inScoreHost,
  paperWidth,
  placeFullPage,
} from "@workspace/score-export/pages"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"

export async function exportMusicXml(
  file: File,
  format: ScoreFormat,
  language: string
) {
  const pages = await inScoreHost(paperWidth, async (host) => {
    const display = new OpenSheetMusicDisplay(host, {
      backend: "svg",
      pageFormat: "A4 P",
      autoResize: false,
      keepWarm: false,
    })
    try {
      await display.load(file)
      display.render()
      const pages = host.querySelectorAll<SVGSVGElement>(
        'svg[id^="osmdSvgPage"]'
      )
      return Array.from(pages, (page) =>
        placeFullPage(page.cloneNode(true) as SVGSVGElement)
      )
    } finally {
      display.destroy()
    }
  })
  const name = file.name.replace(/\.(?:musicxml|xml|mxl)$/i, "")
  return exportScore(pages, format, name, language)
}
